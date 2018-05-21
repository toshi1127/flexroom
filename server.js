const app = require('express')();
var express = require('express');
const http = require('http').Server(app);
const path = require("path");
const ejs = require('ejs');
const io = require('socket.io')(http);

var index = require('./routes/index');

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

var port = '8080';
http.listen(process.env.PORT || port, () => {

});

var myObj3 = new Object();
var myObj5 = new Object();
var myObj6 = new Object();
var myObj7 = new Object();
var myObj2 = new Object();
var myObj4 = new Object();

var pear = null;
var pear2 = null;//追加
function getUniqueStr(myStrong) {
    var strong = 1000;
    if (myStrong) strong = myStrong;
    return new Date().getTime().toString(16) + Math.floor(strong * Math.random()).toString(16)
}
io.on('connection', function (ws) {//途中からアクセスした場合
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
            if (myObj7[myObj6[myObj5[Message.id]]] === Message.room) {
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
                for (var key in myObj3) {//グループから一人を摘出
                    if (myObj7[myObj6[key]] === ws.roomname) {
                        const message = JSON.stringify({
                            type: 'name',
                            text: myObj3[key],
                            fromid: key,
                        });
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
                    pear = myObj5[Message.id];//ここがanswe→offerになってそのまま。
                }
                else if (pear != null && pear2 === null) {//追加
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
        else if (Message.type === "logout") {
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