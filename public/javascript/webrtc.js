//Offer→Answer→candidate 
//各IDを持つオブジェクトを変数の中に入れている。
const localVideo = document.getElementById('local_video');
const remoteVideo = document.getElementById('remote_video');
const textForSendSdp = document.getElementById('text_for_send_sdp');
const textToReceiveSdp = document.getElementById('text_for_receive_sdp');
//var 関数でのスコープ
//let ブロックレベルでの変数のスコープになる。
let videoelement=[];
let localStream = null;
let peerConnection = null;
let roomname=null;
let username=null;
let username2=null;
let Connect=null;
var myObj = new Object();
let joint=false;
let display=false;
let display2=false;
let peerConnections=[];
var peer=[];
var hungupid=null;
var fromlist=new Array();
var formlist2=new Array();
let container = document.getElementById('container');
var MemberList=document.getElementById("Textarea3");
var Pear=document.getElementById("username2");
var Own=document.getElementById("username");
var SendMessage=document.getElementById("Textarea");
var MessageList=document.getElementById("Textarea2");
var MyID=null;
var downloadAnchor = document.querySelector('a#download');//9/5
var calls=null;
downloadAnchor.textContent = '';
videoObj = {
        video: true,//{ mediaSource: "screen" },
        audio: true
};
videoObj2 = {
        video: false,//{ mediaSource: "screen" },
        audio: true
};
isLogout = false;
/* F5キーを停止 */
window.addEventListener('beforeunload', function(e) {
	if(MyID!=null){
		Logout();
	}
}, false);
function getRoomName(){
	roomname = window.prompt("ルーム名を入力してください。");
	return roomname;
}
function Login(){
    joint=true;
    username = window.prompt("ユーザー名を入力してください", "");
    Own.value=username;
    const message = JSON.stringify({
        type: 'join',
        id: username,
		room:getRoomName()
    });
    ws.send(message);
}
function Logout(){
	var select = document.getElementById('select');
    var option = document.createElement('option');
	select.length=0;
    option.setAttribute('value', "who");
    option.innerHTML = "Who do you talk with?";
    select.appendChild(option);
	for(let i=0;i<fromlist.length;i++){
    if (peerConnections[fromlist[i]]!=null) {
        if(peerConnections[fromlist[i]].iceConnectionState != 'closed'){
            peerConnections[fromlist[i]].close();
            peerConnections[fromlist[i]] = null;
            const message = JSON.stringify({ type: 'close',fromid: MyID});
            ws.send(message);
            cleanupVideoElement(remoteVideo);
            textForSendSdp.value = '';
            textToReceiveSdp.value = '';
        }
    }
	}
    iziToast.success({ title: 'ログアウト通知', message: "ログアウトに成功しました。" });
    const message = JSON.stringify({
        type: 'logout',
        id: Own.value,
    });
    Own.value=null;
	Pear.value=null;
	fromlist.length=0;
	formlist2.length=0;
    MemberList.value=null;
    MessageList.value=null;
    remoteVideo.pause();
    remoteVideo.srcObject = null;
    localVideo.pause();
    localVideo.srcObject=null;
	formlist2.length=0;
    ws.send(message);
}
function enter(){
    if( window.event.keyCode == 13 ){
      sendtext();
    }
}
function makeroom(){
	prompt("こちらが部屋のIDです。",Math.round( Math.random() * 1e15 ).toString(36));
}
function openWindow() {
  window.open("./help","OpenWindow",
    "screenX="+60+",screenY="+30+",left="+600+",top="+100+",width="+640+",height="+480);
}
function normalcall(){
    navigator.mediaDevices.getUserMedia(videoObj2)
        .then(//thenは二つの引数を渡すことができます。
        function (stream) {
            localStream = stream;
        },
        function (error) { // error
        alert('要求が拒否されました。'+error.name);
        return;
    });
}
function StartVideo(){
    calls=true;
    navigator.mediaDevices.getUserMedia(videoObj)
        .then(//thenは二つの引数を渡すことができます。
        function (stream) { // success
				    document.getElementById("button").onclick=function(){
			stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
        if(booooool1){
            document.getElementById("button").innerHTML='<span class="glyphicon glyphicon-play" "btn btn-warning" aria-hidden="true" id="button" title="カメラの再開"</span>';
            booooool1=false;
        }
        else{
            document.getElementById("button").innerHTML='<span class="glyphicon glyphicon-pause" aria-hidden="true" id="button" title="カメラの停止"></span>';
            booooool1=true;
        }
		};
		    document.getElementById("button5").onclick=function(){
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        if(booooool2){
            document.getElementById("button5").innerHTML='<span class="glyphicon glyphicon-volume-up" "btn btn-warning" id="button5" aria-hidden="true" title="ミュートを解除"></span>';
            booooool2=false;
        }
        else{
            document.getElementById("button5").innerHTML='<span class="glyphicon glyphicon-volume-off" id="button5" "btn btn-warning" aria-hidden="true" title="ミュートします"></span>';
            booooool2=true;
        }
    };
            playVideo(localVideo,stream);
            localStream = stream;
        },
        function (error) { // error
        alert('要求が拒否されました。'+error.name);
        return;
    });
}
function startVideo(){
    calls=true;
    getScreenId(function(error, sourceId, screen_constraints) {
        navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
        navigator.getUserMedia(screen_constraints, function(stream) {
        playVideo(localVideo,stream);
	    document.getElementById("button").onclick=function(){
			stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
        if(booooool1){
            document.getElementById("button").innerHTML='<span class="glyphicon glyphicon-play" "btn btn-warning" aria-hidden="true" id="button" title="カメラの再開"</span>';
            booooool1=false;
        }
        else{
            document.getElementById("button").innerHTML='<span class="glyphicon glyphicon-pause" aria-hidden="true" id="button" title="カメラの停止"></span>';
            booooool1=true;
        }
		};
        //document.querySelector('video').src = URL.createObjectURL(stream);
        localStream = stream;
        }, function(error) {
            alert('Failed to capture your screen. Please check Chrome console logs for further information.');
        });
    });
}
var booooool1=true;
var booooool2=true;
//アクセスが成功したらこの関数を使ってVideoの再生を開始する。
function playVideo(element,stream){
    localVideo.onclick=function(){
        if(display===false){
            display=true;
            localVideo.style.width="800px";
            localVideo.style.height="600px";
        }
        else{
            display=false;
            localVideo.style.width="480px";
            localVideo.style.height="360px";
        }   
    };
    remoteVideo.onclick=function(){
        if(display===false){
            display=true;
            localVideo.style.width="800px";
            localVideo.style.height="600px";
        }
        else{
            display=false;
            localVideo.style.width="480px";
            localVideo.style.height="360px";
        }   
    };
    element.srcObject=stream;
    element.play();
}
//Step1で学んだこと
//varとletの違い
//thenの使い方
//Navigator      ユーザーエージェントの状態や身元情報を表します。


//Step2
function prepareNewConnection(id){
    let pc_config = {"iceServers":[]};
    peer[id] = new RTCPeerConnection(pc_config);
    if ('ontrack' in peer[id]) {
        peer[id].ontrack = function(event) {
            playVideo(remoteVideo, event.streams[0]);
        };
    }
    else {//Chome向け
        peer[id].onaddstream = function(event) {
            if(remoteVideo.srcObject!=null){
                let container = document.getElementById('container');
                let video = document.createElement('video');
                videoelement[id]=video;
                video.width = '480';
                video.height = '360';
                video.id = Own.value;
                video.style.border = 'solid black 1px';
                video.style.margin = '2px';
                window.onload=function(){
                    container.appendChild(video);
                    playVideo(video,event.stream);
                }
                container.appendChild(video);
                playVideo(video,event.stream);
            }
            else if(remoteVideo.srcObject===null){
                playVideo(remoteVideo, event.stream);
            }
        };
    }
var count=0;
    //Peer-to-Peer通信をする前に、お互いの情報を交換しなければならない。そのためのシグナリングという処理を行う。
    //Ice Candidate(通信経路の情報)を取得したときに呼ばれる
	 peer[id].onicecandidate = function (evt) {
        if (evt.candidate) {
            sendIceCandidate(evt.candidate,id);
        } else {
            console.log('empty ice event');
            // sendSdp(peer.localDescription);
        }
    };
    // ローカルのストリームを利用できるように準備する
    if (localStream) {
        console.log('Adding local stream...');
        //メディアのデータをストリームに追加している。
        peer[id].addStream(localStream);
    }
    else {
        console.warn('no local stream, but continue.');
    }
    peer[id].oniceconnectionstatechange = function() {
		console.log(id);
        console.log('ICE connection Status has changed to ' + peer[id].iceConnectionState);
        switch (peer[id].iceConnectionState) {
            case 'closed':
            case 'failed':
                // ICEのステートが切断状態または異常状態になったら切断処理を実行する
               // if (peerConnection) {
                   // hangUp();
               // }
                break;
            case 'dissconnected':
                break;
        }
    };
    return peer[id];
}
// P2P通信を切断する
function hangUp(){
    console.log("fromlist="+fromlist.length);
    for(let i=0;i<fromlist.length;i++){
    if (peerConnections[fromlist[i]]!=null) {
        if(peerConnections[fromlist[i]].iceConnectionState != 'closed'){
            peerConnections[fromlist[i]].close();
            peerConnections[fromlist[i]] = null;
            const message = JSON.stringify({ type: 'close',fromid: MyID});
            console.log('sending close message');
            ws.send(message);
            cleanupVideoElement(remoteVideo);
            textForSendSdp.value = '';
            textToReceiveSdp.value = '';
        }
    }
    console.log('peerConnection is closed.');
    }
    fromlist.length=0;
    return;
}
function HANGUP(id){
    if(peerConnections[id]!=null){
        if(peerConnections[id].iceConnectionState != 'closed'){
            peerConnections[id].close();
            peerConnections[id] = null;
            console.log('sending close message');
            cleanupVideoElement(remoteVideo);
            textForSendSdp.value = '';
            textToReceiveSdp.value = '';
            for(let i=0;i<fromlist.length;i++){
                if(fromlist[i]===id){
                    fromlist.splice(i,1);
                }
            }
        }
    }
    
}
function sendSdp(sessionDescription,id) {
    console.log('---sending sdp ---');
    textForSendSdp.value = sessionDescription.sdp;
    //textForSendSdp.focus();
    //textForSendSdp.select();
    //ここで接続先を選ぶ？？
    if(Connect){
        console.log("connection");
        Connect=false;
        const connectperson = JSON.stringify({
            type:'connectperson',
            id:Pear.value,
            to:id,
        });
        ws.send(connectperson);//全員に送る。
    }//接続先が決まる。
    //接続先に送る。
    const message = JSON.stringify({
        type:sessionDescription.type,
        sdp:sessionDescription.sdp,
        fromid:MyID,
        to:id
    });
    console.log('sending SDP=' + message);
    ws.send(message);
}
//追記
function sendtext(){
    const text=SendMessage.value;
    SendMessage.value=null;
    const message =JSON.stringify({
        name:Own.value,
        text:username+": "+text,
        type:"message",
    });
    MessageList.value+=username+": "+text+"\n";
    ws.send(message);
}

function setname2(){
    username2=Pear.value;
    const message = JSON.stringify("User:"+username2);
    ws.send(username2);
}

function connect() {
    if(calls===null){
        normalcall();
    }
    calls=null
    if(Pear.value.length!=0){
        const message=JSON.stringify({type:"call",fromid:MyID,name:Own.value,toid:myObj[Pear.value]});
        ws.send(message);
    }
    else{
        for(let i=0;i<formlist2.length;i++){
            if(!fromlist.includes(formlist2[i])){
                if(formlist2[i]!=MyID){
                    console.log("formlist2[i])="+formlist2[i]);
                    makeOffer(formlist2[i]);
                }
            }
        }
    }
}
function connectanswer(){
    Connect=true;
    if(Pear.value.length!=0){
        makeOffer(myObj[Pear.value]);
    }
}
function makeOffer(id) {
    peerConnection = prepareNewConnection(id);
    addConnection(id, peerConnection);
    peerConnections[id].onnegotiationneeded = function(){//これを消せばfirefoxでも繋がる。
        peerConnections[id].createOffer()
            .then(function (sessionDescription) {
                console.log('createOffer() succsess in promise');
                return peerConnections[id].setLocalDescription(sessionDescription);
            }).then(function() {
                console.log('setLocalDescription() succsess in promise');
                sendSdp(peerConnections[id].localDescription,id);
            }).catch(function(err) {
                console.error(err);
        });
    }
}

// Answer SDPを生成する
function makeAnswer(offerID) {
    console.log('sending Answer. Creating remote session description...' );
    Connect=true;
    if (!peerConnections[offerID]) {
        console.error('peerConnection NOT exist!');
        return;
    }
    peerConnections[offerID].createAnswer()
        .then(function (sessionDescription) {
            console.log('createAnswer() succsess in promise');
            return peerConnections[offerID].setLocalDescription(sessionDescription);
        }).then(function() {
            console.log('setLocalDescription() succsess in promise');
            sendSdp(peerConnections[offerID].localDescription,offerID);//ここで送ったところと成立する。
        }).catch(function(err) {
            console.error(err);
    });
    //peerConnection.
}
// SDPのタイプを判別しセットする
function onSdpText() {
    const text = textToReceiveSdp.value;
    if (peerConnection) {
        // Offerした側が相手からのAnswerをセットする場合
        console.log('Received answer text...');
        const answer = new RTCSessionDescription({
            type : 'answer',
            sdp : text,
            fromid:MyID,
        });
        console.log("MyID="+MyID);
        setAnswer(answer,MyID);
    }
    else {
        // Offerを受けた側が相手からのOfferをセットする場合
        console.log('Received offer text...');
        const offer = new RTCSessionDescription({
            type : 'offer',
            sdp : text,
            fromid:MyID,
        });
        console.log("MyID="+MyID);
        setOffer(offer,MyID);
    }
    textToReceiveSdp.value ='';
}
 function addConnection(id, peer) {
    if(!peerConnections.includes(id)){
        peerConnections[id] = peer;
        return;
    }
     return;
 }
// Offer側のSDPをセットした場合の処理
function setOffer(sessionDescription,offersid) {
    if (peerConnections.includes(offersid)) {
        console.error('peerConnection alreay exist!');
        return;//追加
    }
    peerConnection = prepareNewConnection(offersid);
    console.log("answerです。")
    addConnection(offersid, peerConnection);//連絡先追加
    peerConnections[offersid].onnegotiationneeded = function () {
        peerConnections[offersid].setRemoteDescription(sessionDescription)
            .then(function() {
                console.log('setRemoteDescription(offer) succsess in promise');//makeAnswerできてる。
                makeAnswer(offersid);
            }).catch(function(err) {
                console.error('setRemoteDescription(offer) ERROR: ', err);
        });
    }
}

// Answer側のSDPをセットした場合の処理
function setAnswer(sessionDescription,answersID) {
    //offerを送る時にpeerConnectionを作っている。作った時にaddConnectionできれば理想だが...
    Connect=false;
    //addConnection(answersID, peerConnection);//接続先のPeerConnectionを入れる必要がある。
    console.log("peerConnections[answersID]="+getConnection(answersID));//これが定義されていない。
    console.log("answersID="+answersID);
    if(peerConnections[answersID]===undefined){
        return;
    }
    peerConnections[answersID].setRemoteDescription(sessionDescription)//sessionDescriptionがセットできていない。
        .then(function() {
            console.log('setRemoteDescription(answer) succsess in promise');
        }).catch(function(err) {
            console.error('setRemoteDescription(answer) ERROR: ', err);//ここでエラーが出ている。
    });
}
function cleanupVideoElement(element) {
    element.pause();
    element.srcObject = null;
}

const ws = io.connect();//URLとポートを指定
//WebSocketオブジェクト作成後、onopen,onerror,onmessageのイベントハンドラを作る。
ws.on('connect', function() {
       console.log('connect');
});
ws.on('disconnect',function(){
});
ws.on('message',function(message) {
    console.log('ws onmessage() data:', message);
	const Message = JSON.parse(message);
    //送られたデータが入っている。（連想配列化　mapみたいなやつ）
    if (Message.type === 'offer') {
        // offer 受信時
        if(!fromlist.includes(Message.fromid)){
            if(Message.fromid!=MyID){
                if(Message.to===MyID){
                    fromlist.push(Message.fromid);
                    console.log('Received offer ...');
                    textToReceiveSdp.value = Message.sdp;
                    //ここでtypeとsdpだけにしたほうがいい？
                    const offer = new RTCSessionDescription({type : 'offer',sdp : Message.sdp,});
                    const IDDD=Message.fromid;
                    console.log(Message.fromid);
                    setOffer(offer,IDDD);
                }
            }
        }
    }
    else if (Message.type === 'answer') {
        // answer 受信時
         if(!fromlist.includes(Message.fromid)){
            if(Message.to===MyID){
                fromlist.push(Message.fromid);
                console.log('Received answer ...');
                textToReceiveSdp.value = Message.sdp;
                const answer = new RTCSessionDescription({type : 'answer',sdp : Message.sdp,});
                setAnswer(answer,Message.fromid);
            }
         }
    }
    else if (Message.type === "candidate") {
        console.log("受け取りました。");
        if(Message.fromid!=MyID){
                if(Message.to===MyID){
                    console.log('Received ICE candidate ...');
                    const candidate = new RTCIceCandidate(Message.ice);
                    console.log("message.fromid="+Message.fromid);
                    addIceCandidate(candidate,Message.fromid);
                }
        }
    }
    else if (Message.type === 'close') {
        // closeメッセージ受信時
        console.log('peer is closed ...');
        HANGUP(Message.fromid);
    }
    else if(Message.type==='connectperson'&&Connect===null){
        
    }
    else if (Message.type === 'name'&&joint===false){
    }
    else if (Message.type === 'name'&&joint===true){
        if(!MemberList.value.includes(Message.text)){
            MemberList.value+=Message.text+"\n";
        if(Message.text!=Own.value){
        iziToast.info({ title: 'ログイン通知', message: Message.text+"がログインしました。" });
        var select = document.getElementById('select');
        var option = document.createElement('option');
        option.setAttribute('value', Message.text);
        option.innerHTML = Message.text;
        select.appendChild(option);
        }
            if(!formlist2.includes(Message.fromid)){
                if(Message.fromid!=MyID){
                    console.log("message.fromid="+Message.fromid);
                    console.log("MyID="+MyID);
                    formlist2.push(Message.fromid);
                    myObj[Message.text]=Message.fromid;
                }
            }
        }
         
    }
    else if(Message.type === "call"&&Message.toid===MyID){
            // カスタムtoast
        iziToast.show({
            color: 'dark', // 背景色
            icon: 'fa fa-user', // font-awesomeのアイコンに変更
            title: '着信', // タイトル
            message: Message.name, // メッセージ
            progressBarColor: 'rgb(0, 255, 184)', // 進歩バー色
            // ボタンを追加
            buttons: [[
                '<button>Ok</button>',
                // ボタンをクリックした際のコールバック
                function(instance, toast) {
                    console.log("OK");
                    Pear.value=Message.name;
                    connectanswer();
                }
            ],
             ['<button>Close</button>',
            // ボタンをクリックした際のコールバック
            function(instance, toast) {
                // closeボタンでiziToastを非表示に
                instance.hide({
                    transitionOut: 'fadeOutUp'
                }, toast);
            }
        ]
    ]
});  // ! iziToast.show()
    }
    else if(Message.type === "join"){
    }
    else if(Message.type === "logout"&&joint===true){
        iziToast.info({ title: 'ログアウト通知', message: Message.id+"がログアウトしました。" });
        //ログアウトした人の情報を消す。
        var regExp = new RegExp((Message.id+"\n"), "g" );
        MemberList.value=MemberList.value.replace(regExp,"");
        //通話可能な人から取り除く。
        var select = document.getElementById('select');
        var option = document.createElement('option');
		select.options[0].selected=true;
        for(i=0;select.length>i;i++){
            if(select.options[i].value===Message.id){
                select.options[i].remove();
            }
        }
    }
    else if(Message.type === "error"){
        iziToast.error({ title: 'エラーメッセージ', message: Message.text });
    }
    else if(Message.type==="userid"){
		console.log("トーストの出力");
        iziToast.success({ title: 'ログインに成功しました。', message:"あなたのIDは"+Message.text+"です。"});
        MyID=Message.text;
    }
    else if(Message.type==="file"&&joint===true){//9/5
        downloadAnchor.href=Message.URL;
        downloadAnchor.textContent=Message.text;
        downloadAnchor.style.display=Message.Style;
    }
	else if(Message.type==="check"){
		const message = JSON.stringify({type: 'check',id:MyID});
		ws.send();
	}
    else if(Message.type==="message"&&joint===true){
        iziToast.info({ title: 'メッセージ', message: Message.name+"からメッセージが来ました。"});
        MessageList.value+=Message.text+"\n";
    }
});
function getConnection(id) {
    let peer = peerConnections[id];
    return peer;
}
// ICE candaidate受信時にセットする
function addIceCandidate(candidate,id) {
    let peerConnection=peerConnections[id];
    if (peerConnections[id]!=null){
        peerConnections[id].addIceCandidate(candidate);
    }
    else {
        console.error('PeerConnection not exist!');
        return;
    }
}

// ICE candidate生成時に送信する
//ここでサーバーに情報を送っている。
function sendIceCandidate(candidate,id) {
    console.log('---sending ICE candidate ---');
    const message = JSON.stringify({ type: 'candidate', ice: candidate,fromid:MyID ,to:id});
    console.log('sending candidate=' + message);
    ws.send(message);
}

document.getElementById("button2").onclick=function(){
    if(document.getElementById("global-wrapper").style.display=="block"){
        document.getElementById("global-wrapper").style.display="none";
    }
    else{
        document.getElementById("global-wrapper").style.display="block";
    }
};
function forsubmit(){
    Pear.value=document.getElementById("select").value;
}