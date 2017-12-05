"use strict";
var myObj = new Object();
var myObj2 = new Object();
var myObj3 = new Object();
var myObj4 =new Object();
var myObj5 = new Object();
var myObj6= new Object();
const WebSocketServer = require('ws').Server;
const port = 3001;
const wsServer = new WebSocketServer({ port: port });
var pear=null;
var pear2=null;//追加
function getUniqueStr(myStrong){
    var strong = 1000;
    if (myStrong) strong = myStrong;
    return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
}
wsServer.on('connection', function(ws) {//途中からアクセスした場合
    console.log('-- websocket connected --');
    ws.on('message', function(message) {
        var Message=JSON.parse(message);
        if(Message.type==="join"){
            console.log("create list");
            console.log(Message.id+"さんです。")
            if(Message.id in myObj){
                console.log("重複しています");
                const errormessage=JSON.stringify({ 
                        type: 'error',
                        text: Message.id+"は登録されています",
                });
                ws.send(errormessage);//ここにきたらStart()から出るか、カメラの許可をするダイアログが出ないようにする。
            }
            else if((Message.id).length===0){
                const errormessage=JSON.stringify({ 
                        type: 'error',
                        text: "名前を入力してください",
                });
                ws.send(errormessage);
            }
            else{
                var ID=getUniqueStr(Message.id);
                myObj3[ID]=Message.id;
                myObj4[ws]=ID;
                myObj[Message.id]=ws;
                myObj2[ws]=Message.id;//多分wsじゃなくてclientが正しい。
                myObj5[Message.id]=ID;
                //myObj6[client]=Message.id;
                wsServer.clients.forEach(function each(client) {
                    for(var key in myObj3){
                        //console.log("登録ユーザ: "+myObj2[key]);
                        const message=JSON.stringify({ 
                            type: 'name',
                            text: myObj3[key],
                            fromid:key,
                        });
                        //console.log("登録ユーザ(送り先): "+myObj6[client]);//ブラウザの数だけ送るのでおk
                        if(!isSame(ws,client)){//ログインした際に自分以外にデータを送る。
                             client.send(message);//IDの発行されているユーザーにのみデータを送る。
                        }
                        if(isSame(ws,client)){//自分に情報を送る。これはできている。
                            ws.send(message);
                        }
                    }
                    if(isSame(ws,client)){//自分にデータを送る。
                        const sendid=JSON.stringify({
                            type: 'userid',
                            text: myObj4[client],
                        });
                        client.send(sendid);
                    }
                });
            }
        }
        else if(Message.type==="close"){
            pear=null;
            pear2=null;
            wsServer.clients.forEach(function each(client) {
                if (isSame(ws, client)) {
                    console.log('- skip sender -');
                    //client.close();
                }
                else{
                    client.send(message);
                }
            });
        }
        //ここまではID化できてる。pearをID使ってできたらいいね。
        else if(Message.type==="connectperson"&&(pear===null||pear2===null)){
            //ここで接続先の名前からIDを求める
                if(Message.id in myObj){
                    if(pear===null&&pear2===null){//追加
                        console.log("offer answer="+Message.id);
                         pear=myObj5[Message.id];//ここがanswe→offerになってそのまま。
                    }
                    else if(pear!=null&&pear2===null){//追加
                        console.log("answer offer="+Message.id);
                         pear2=myObj5[Message.id];//ここがanswe→offerになってそのまま。追加
                        //pear2にはtoshiが入ってる！！
                    }
                }
                else{
                    console.log("接続できません")//こっちに入っている。
                }
            }
        else if(Message.type==="connectperson"&&pear!=null&&pear2!=null){
            //通話者を3人にします。
            wsServer.clients.forEach(function each(client) {
                if (isSame(ws, client)) {
                    console.log('- skip sender -');
                    //client.close();
                }
                else{
                    client.send(message);
                }
            });
        }
        else if(Message.type==="logout"){//自分以外の全員に送っている。普段も同じ
            //wsに関する情報を全て削除する。
            delete myObj2[myObj[Message.id]];
            delete myObj3[myObj4[myObj[Message.id]]];
            delete myObj4[myObj[Message.id]];
            delete myObj[Message.id];
            delete myObj5[Message.id];
            wsServer.clients.forEach(function each(client) {
                if (isSame(ws, client)) {
                    console.log('- skip sender -');
                    //client.close();
                }
                else{
                    client.send(message);
                }
            });
            //ws.close();
        }
        else if(Message.type==="message"||Message.type==="file"||Message.type==="call"){
            wsServer.clients.forEach(function each(client) {
                if (isSame(ws, client)) {
                    console.log('- skip sender -');
                    //client.close();
                }
                else{
                    client.send(message);
                }
            });
        }
		else if(Message.type==='candidate'){
			wsServer.clients.forEach(function each(client) {
				if (isSame(ws, client)) {
                    console.log('- skip sender -');
                    //client.close();
                }
                else{
                    client.send(message);
                }
			});
		}
        else{
        wsServer.clients.forEach(function each(client) {
            if (isSame(ws, client)) {
                console.log('- skip sender -'+myObj2[client]);
            }
            else if(pear!=null){//offer→answerしかできていない。else if(JSON.parse(message).type==="connectperson"よりも先に呼ばれてしまっている。
                if(!isSame(ws, client)){
                    console.log("接続先にデータを送ります")
                    if(pear2===null){
                        console.log("1送り先"+myObj3[pear]);
                        myObj[myObj3[pear]].send(message);
                    }
                    else if(myObj4[ws]===pear){
                        console.log("2送り先"+myObj3[pear2]);
                        client.send(message);//追加 myObj[pear2]
                    }
                    else if(myObj4[ws]===pear2){
                        console.log("3送り先"+myObj3[pear]);
                        client.send(message);//追加 myObj[pear2]
                    }
                    else if(myObj4[ws]!=pear){
                        console.log("4送り先"+myObj2[client])
                        client.send(message);
                    }
                    else if(myObj4[ws]!=pear2){
                        console.log("5送り先"+myObj2[client])
                       client.send(message);   
                    }
                }
            }
        });
        }
    });
});

function isSame(ws1, ws2) {
    // -- compare object --
    return (ws1 === ws2);
}
console.log('websocket server start. port=' + port);
