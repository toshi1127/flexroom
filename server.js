var port = process.env.PORT || 9001;

var server = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    ejs = require('ejs'),
    io = require('socket.io');
const hostname = '10.110.131.224';
var app;
var options = {
    key: fs.readFileSync(path.join(__dirname, 'fake-keys/privatekey.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'fake-keys/certificate.pem'))
};
app = server.createServer();
app.on('request', function (request, response) {
    switch (request.url) {
        case '/'://カレントディレクトリは/で読んでしまう　故にディレクトリを分けて管理する必要がある。
            fs.readFile(path.join(process.cwd(), 'index.html'),
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.write(data);
                    response.end();
                }
            );
            break;
        case '/css/bootstrap.min.css':
            fs.readFile('./css/bootstrap.min.css', 'UTF-8',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'text/css' });
                    response.write(data);
                    response.end();
                }
            );
            break;
        case '/css/bootstrap.css':
            fs.readFile('./css/bootstrap.css', 'UTF-8',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'text/css' });
                    response.write(data);
                    response.end();
                }
            );
            break;
        case '/css/client.css':
            fs.readFile('./css/client.css', 'UTF-8',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'text/css' });
                    response.write(data);
                    response.end();
                }
            );
            break;
        case '/css/client2.css':
            fs.readFile('./css/client.css', 'UTF-8',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'text/css' });
                    response.write(data);
                    response.end();
                }
            );
            break;
        case '/css/iziToast.css':
            fs.readFile('./css/iziToast.css', 'UTF-8',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'text/css' });
                    response.write(data);
                    response.end();
                }
            );
            break;
        case '/css/font-awesome.min.css':
            fs.readFile('./css/font-awesome.min.css', 'UTF-8',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'text/css' });
                    response.write(data);
                    response.end();
                }
            );
            break;
        case '/img/Night-Restaurant-Cebu-UHD-Wall-Paper.jpg':
            fs.readFile('./img/Night-Restaurant-Cebu-UHD-Wall-Paper.jpg', 'binary',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'image/jpg' });
                    response.write(data, 'binary');
                    response.end();
                }
            );
            break;
        case '/img/check.png':
            fs.readFile('./img/check.png', 'binary',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'image/png' });
                    response.write(data, 'binary');
                    response.end();
                }
            );
            break;
        case '/img/error.png':
            fs.readFile('./img/error.png', 'binary',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'image/png' });
                    response.write(data, 'binary');
                    response.end();
                }
            );
            break;
        case '/img/info.png':
            fs.readFile('./img/info.png', 'binary',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'image/png' });
                    response.write(data, 'binary');
                    response.end();
                }
            );
            break;
        case '/img/error.png':
            fs.readFile('./img/error.png', 'binary',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'image/png' });
                    response.write(data, 'binary');
                    response.end();
                }
            );
            break;
        case '/js/iziToast.js':
            fs.readFile('./js/iziToast.js', 'UTF-8',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'text/js' });
                    response.write(data);
                    response.end();
                }
            );
            break;
        case '/js/webrtc.js':
            fs.readFile('./js/webrtc.js', 'UTF-8',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'text/js' });
                    response.write(data);
                    response.end();
                }
            );
            break;
        case '/js/main.js':
            fs.readFile('./js/main.js', 'UTF-8',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'text/js' });
                    response.write(data);
                    response.end();
                }
            );
            break;
        case '/js/getScreenId.js':
            fs.readFile('./js/getScreenId.js', 'UTF-8',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'text/js' });
                    response.write(data);
                    response.end();
                }
            );
            break;
        case '/fonts/glyphicons-halflings-regular.ttf':
            fs.readFile('./fonts/glyphicons-halflings-regular.ttf', 'UTF-8',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'application/x-font-ttf' });
                    response.write(data);
                    response.end();
                }
            );
            break;
        case '/fonts/glyphicons-halflings-regular.woff':
            fs.readFile('./fonts/glyphicons-halflings-regular.woff', 'UTF-8',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'application/x-font-woff' });
                    response.write(data);
                    response.end();
                }
            );
            break;
        case '/html/help.html':
            fs.readFile('./html/help.html', 'UTF-8',
                function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.write(data);
                    response.end();
                }
            );
            break;
    }
});
function runServer() {
    app = app.listen(process.env.PORT || port, function () {
        console.log('Server listening at https://' + ':' + process.env.PORT);
        console.log(process.env.IP);
    });
}

runServer();

var myObj3 = new Object();
var myObj5 = new Object();
var myObj6 = new Object();
var myObj7 = new Object();
var myObj2 = new Object();
var myObj4 = new Object();
var wsServer = io.listen(app);

var pear = null;
var pear2 = null;//追加
function getUniqueStr(myStrong) {
    var strong = 1000;
    if (myStrong) strong = myStrong;
    return new Date().getTime().toString(16) + Math.floor(strong * Math.random()).toString(16)
}
wsServer.on('connection', function (ws) {//途中からアクセスした場合
    console.log('-- websocket connected --');
    function setRoomname(room) {
        ws.roomname = room;
    }
    function getRoomname() {
        var room = ws.roomname;
        return room;
    }
    function sendmessage(message) {
        for (var Key in myObj3) {
            //グループ全体に
            if (myObj7[myObj6[Key]] === ws.roomname) {
                ws.to(myObj6[Key]).emit('message', message);
            }
        }
    }
    ws.on('message', function (message) {
        var Message = JSON.parse(message);
        if (Message.type === "join") {
            console.log("create list");
            console.log(Message.id + "さんです。");
            //部屋が違ったら登録おkにする
            if (myObj7[myObj6[myObj5[Message.id]]] === Message.room) {
                console.log("重複しています");
                const errormessage = JSON.stringify({
                    type: 'error',
                    text: Message.id + "は登録されています",
                });
                ws.send(errormessage);//ここにきたらStart()から出るか、カメラの許可をするダイアログが出ないようにする。
            }
            else if (Message.id === null) {
                const errormessage = JSON.stringify({
                    type: 'error',
                    text: "名前を入力してください",
                });
                ws.send(errormessage);
            }
            else {
                var ID = getUniqueStr(Message.id);
                ws.join(Message.room);
                console.log('id=' + ws.id + 'enter room=' + Message.room);
                setRoomname(Message.room);
                myObj3[ID] = Message.id;
                myObj5[Message.id] = ID;
                myObj6[ID] = ws.id;
                myObj2[ws.id] = ID;
                myObj7[ws.id] = ws.roomname;
                //myObj6[client]=Message.id;
                //ここまでおk
                const sendid = JSON.stringify({
                    type: 'userid',
                    text: ID
                });
                ws.send(sendid);
                console.log("ログイン通知を送りました。");
                for (var key in myObj3) {//グループから一人を摘出
                    console.log("ルーム名:" + ws.roomname);
                    console.log("ループ中");
                    console.log(key);
                    if (myObj7[myObj6[key]] === ws.roomname) {
                        console.log("ルームメンバー:" + myObj3[key]);
                        const message = JSON.stringify({
                            type: 'name',
                            text: myObj3[key],
                            fromid: key,
                        });
                        //http://thr3a.hatenablog.com/entry/20141123/1416723018
                        for (var Key in myObj3) {
                            if (myObj7[myObj6[Key]] === ws.roomname) {
                                ws.to(myObj6[Key]).emit('message', message);
                                if (myObj6[Key] === ws.id) {
                                    ws.send(message);
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (Message.type === "close") {
            pear = null;
            pear2 = null;
            sendmessage(message);
        }
        //ここまではID化できてる。pearをID使ってできたらいいね。
        else if (Message.type === "connectperson" && (pear === null || pear2 === null)) {
            //ここで接続先の名前からIDを求める
            if (Message.id in myObj5) {
                if (pear === null && pear2 === null) {//追加
                    console.log("offer answer=" + Message.id);
                    pear = myObj5[Message.id];//ここがanswe→offerになってそのまま。
                }
                else if (pear != null && pear2 === null) {//追加
                    console.log("answer offer=" + Message.id);
                    pear2 = myObj5[Message.id];//ここがanswe→offerになってそのまま。追加
                    //pear2にはtoshiが入ってる！！
                }
            }
            else {
                console.log("接続できません")//こっちに入っている。
            }
        }
        else if (Message.type === "connectperson" && pear != null && pear2 != null) {
            //通話者を3人にします。
            for (var Key in myObj3) {
                if (myObj7[myObj6[Key]] === ws.roomname) {
                    ws.to(myObj6[Key]).emit('message', message);
                }
            }
        }
        else if (Message.type === "logout") {//自分以外の全員に送っている。普段も同じ
            //wsに関する情報を全て削除する。
            console.log("ログアウトします。");
            sendmessage(message);
            ws.disconnect();
            delete myObj5[myObj3[myObj2[ws.id]]];
            delete myObj3[myObj2[ws.id]];
            delete myObj7[myObj6[myObj2[ws.id]]];
            delete myObj6[myObj2[ws.id]];
            delete myObj2[ws.id];
        }
        else if (Message.type === "check") {
            console.log("ユーザーのチェックをしています。");

        }
        else {
            sendmessage(message);
        }
    });
});

function isSame(ws1, ws2) {
    // -- compare object --
    return (ws1 === ws2);
}
console.log('websocket server start. port=' + port);