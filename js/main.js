'use strict';

var localConnection;
var remoteConnection;
var sendChannel;
var receiveChannel;
var pcConstraint;
var bitrateDiv = document.querySelector('div#bitrate');
var fileInput = document.querySelector('input#fileInput');
var downloadAnchor = document.getElementById('a#download');
var statusMessage = document.querySelector('span#status');

var receiveBuffer = [];
var receivedSize = 0;

var bytesPrev = 0;
var timestampPrev = 0;
var timestampStart;
var statsInterval = null;
var bitrateMax = 0;
fileInput.addEventListener('change', handleFileInputChange, true);

function handleFileInputChange() {
  var file = fileInput.files[0];
  if (!file) {
    trace('No file chosen');
  } else {
    createConnection();
  }
}

function createConnection() {
  var servers = null;
  pcConstraint = null;

  window.localConnection = localConnection = new RTCPeerConnection(servers,pcConstraint);


  sendChannel = localConnection.createDataChannel('sendDataChannel');
  sendChannel.binaryType = 'arraybuffer';
  //trace('Created send data channel');

  sendChannel.onopen = onSendChannelStateChange;
  sendChannel.onclose = onSendChannelStateChange;
  localConnection.onicecandidate = function(e) {
    onIceCandidate(localConnection, e);
  };

  localConnection.createOffer().then(
    gotDescription1,
    onCreateSessionDescriptionError
  );
  // Add remoteConnection to global scope to make it visible
  // from the browser console.
  window.remoteConnection = remoteConnection = new RTCPeerConnection(servers,
      pcConstraint);
  //trace('Created remote peer connection object remoteConnection');

  remoteConnection.onicecandidate = function(e) {
    onIceCandidate(remoteConnection, e);
  };
  remoteConnection.ondatachannel = receiveChannelCallback;

  fileInput.disabled = true;
}

function onCreateSessionDescriptionError(error) {
  //trace('Failed to create session description: ' + error.toString());
}

function sendData() {
  var file = fileInput.files[0];

  statusMessage.textContent = '';
  downloadAnchor.textContent = '';
  if (file.size === 0) {
    bitrateDiv.innerHTML = '';
    statusMessage.textContent = 'File is empty, please select a non-empty file';
    closeDataChannels();
    return;
  }
  var chunkSize = 16384;
  var sliceFile = function(offset) {
    var reader = new window.FileReader();
    reader.onload = (function() {
      return function(e) {
        sendChannel.send(e.target.result);
        //ws.send(e.target.result);//8/4追加
        if (file.size > offset + e.target.result.byteLength) {
          window.setTimeout(sliceFile, 0, offset + chunkSize);
        }
      };
    })(file);
    var slice = file.slice(offset, offset + chunkSize);
    reader.readAsArrayBuffer(slice);
  };
  sliceFile(0);
}

function closeDataChannels() {
  //trace('Closing data channels');
  sendChannel.close();
  //trace('Closed data channel with label: ' + sendChannel.label);
  if (receiveChannel) {
    receiveChannel.close();
   // trace('Closed data channel with label: ' + receiveChannel.label);
  }
  localConnection.close();
  remoteConnection.close();
  localConnection = null;
  remoteConnection = null;
  //trace('Closed peer connections');

  // re-enable the file select
  fileInput.disabled = false;
}

function gotDescription1(desc) {
  localConnection.setLocalDescription(desc);
  //trace('Offer from localConnection \n' + desc.sdp);
  remoteConnection.setRemoteDescription(desc);
  remoteConnection.createAnswer().then(
    gotDescription2,
    onCreateSessionDescriptionError
  );
}

function gotDescription2(desc) {
  remoteConnection.setLocalDescription(desc);
  //trace('Answer from remoteConnection \n' + desc.sdp);
  localConnection.setRemoteDescription(desc);
}

function getOtherPc(pc) {
  return (pc === localConnection) ? remoteConnection : localConnection;
}

function getName(pc) {
  return (pc === localConnection) ? 'localPeerConnection' :
      'remotePeerConnection';
}

function onIceCandidate(pc, event) {
  getOtherPc(pc).addIceCandidate(event.candidate)
  .then(
    function() {
      onAddIceCandidateSuccess(pc);
    },
    function(err) {
      onAddIceCandidateError(pc, err);
    }
  );
 // trace(getName(pc) + ' ICE candidate: \n' + (event.candidate ?event.candidate.candidate : '(null)'));
}

function onAddIceCandidateSuccess() {
  //trace('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
  //trace('Failed to add Ice Candidate: ' + error.toString());
}

function receiveChannelCallback(event) {
  //trace('Receive Channel Callback');
  receiveChannel = event.channel;
  receiveChannel.binaryType = 'arraybuffer';
  receiveChannel.onmessage = onReceiveMessageCallback;
  receiveChannel.onopen = onReceiveChannelStateChange;
  receiveChannel.onclose = onReceiveChannelStateChange;

  receivedSize = 0;
  bitrateMax = 0;
  downloadAnchor.textContent = '';
  downloadAnchor.removeAttribute('download');
  if (downloadAnchor.href) {
    URL.revokeObjectURL(downloadAnchor.href);
    downloadAnchor.removeAttribute('href');
  }
}

function onReceiveMessageCallback(event) {
  // trace('Received Message ' + event.data.byteLength);
  receiveBuffer.push(event.data);
  receivedSize += event.data.byteLength;

  var file = fileInput.files[0];
  if (receivedSize === file.size) {
    var received = new window.Blob(receiveBuffer);
    receiveBuffer = [];

    downloadAnchor.href = URL.createObjectURL(received);
    downloadAnchor.download = file.name;
    downloadAnchor.textContent =
      'Click to download \'' + file.name + '\' (' + file.size + ' bytes)';
    downloadAnchor.style.display = 'block';
    const message = JSON.stringify(//追記
        {type: 'file', 
         text: downloadAnchor.textContent,
         URL:downloadAnchor.href,
         Style:downloadAnchor.style.display,
        });
    ws.send(message);//追記
    var bitrate = Math.round(receivedSize * 8 /
        ((new Date()).getTime() - timestampStart));
    bitrateDiv.innerHTML = '<strong>Average Bitrate:</strong> ' +
        bitrate + ' kbits/sec (max: ' + bitrateMax + ' kbits/sec)';

    if (statsInterval) {
      window.clearInterval(statsInterval);
      statsInterval = null;
    }

    closeDataChannels();
  }
}

function onSendChannelStateChange() {
  var readyState = sendChannel.readyState;
  //trace('Send channel state is: ' + readyState);
  if (readyState === 'open') {
    sendData();
  }
}

function onReceiveChannelStateChange() {
  var readyState = receiveChannel.readyState;
  //trace('Receive channel state is: ' + readyState);
  if (readyState === 'open') {
    timestampStart = (new Date()).getTime();
    timestampPrev = timestampStart;
    statsInterval = window.setInterval(displayStats, 500);
    window.setTimeout(displayStats, 100);
    window.setTimeout(displayStats, 300);
  }
}

// display bitrate statistics.
function displayStats() {
  var display = function(bitrate) {
    bitrateDiv.innerHTML = '<strong>Current Bitrate:</strong> ' +
        bitrate + ' kbits/sec';
  };

  if (remoteConnection && remoteConnection.iceConnectionState === 'connected') {
    if (adapter.browserDetails.browser === 'chrome') {
      remoteConnection.getStats(null, function(stats) {
        for (var key in stats) {
          var res = stats[key];
          if (timestampPrev === res.timestamp) {
            return;
          }
          if (res.type === 'googCandidatePair' &&
              res.googActiveConnection === 'true') {
            // calculate current bitrate
            var bytesNow = res.bytesReceived;
            var bitrate = Math.round((bytesNow - bytesPrev) * 8 /
                (res.timestamp - timestampPrev));
            display(bitrate);
            timestampPrev = res.timestamp;
            bytesPrev = bytesNow;
            if (bitrate > bitrateMax) {
              bitrateMax = bitrate;
            }
          }
        }
      });
    } else {
      var bytesNow = receivedSize;
      var now = (new Date()).getTime();
      var bitrate = Math.round((bytesNow - bytesPrev) * 8 /
          (now - timestampPrev));
      display(bitrate);
      timestampPrev = now;
      bytesPrev = bytesNow;
      if (bitrate > bitrateMax) {
        bitrateMax = bitrate;
      }
    }
  }
}