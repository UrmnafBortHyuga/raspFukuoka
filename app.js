var fs = require("fs");

var server = require("http").createServer(function(req, res) {

     switch(req.url) {
       case '/':
       fs.readFile('./index.html', 'UTF-8',
       function (err, data) {
         res.writeHead(200, {'Content-Type': 'text/html'});
         res.write(data);
         res.end();
       });
       break;

       case '/images/led-off.png':
       fs.readFile('./images/led-off.png', 'binary',
       function (err, data) {
         res.writeHead(200, {'Content-Type': 'image/png'});
         res.write(data, 'binary');
         res.end();
       });
       break;

       case '/images/led-on.png':
       fs.readFile('./images/led-on.png', 'binary',
       function (err, data) {
         res.writeHead(200, {'Content-Type': 'image/png'});
         res.write(data, 'binary');
         res.end();
       });
       break;
     }

}).listen(8080);
var io = require("socket.io").listen(server);

// ユーザ管理ハッシュ
var userHash = {};

var rpio = require('rpio');
rpio.open(7, rpio.OUTPUT, rpio.LOW);

// 2.イベントの定義
io.sockets.on("connection", function (socket) {
  // 接続開始カスタムイベント(接続元ユーザを保存し、他ユーザへ通知)
  socket.on("connected", function (name) {
    var msg = name + "が入室しました";
    userHash[socket.id] = name;
    io.sockets.emit("publish", {value: msg});
  });

  socket.on('event', function(data) {   // クライアントからのイベント受信
      console.log('socket id: [' + socket.id + '] data: ' + data.onoff);
      if (data.onoff == 'on') {
        rpio.write(7, rpio.HIGH);
        io.sockets.emit('event', { onoff: 'on' });  // 全てのクライアントへ送信
      }
      if (data.onoff == 'off') {
        rpio.write(7, rpio.LOW);
        io.sockets.emit('event', { onoff: 'off' }); // 全てのクライアントへ送信
      }
    });

    socket.on('disconnect', function() {  // 切断
      console.log('disconnect id: [' + socket.id + ']');
    });

});

rpio.open(40, rpio.INPUT, rpio.PULL_DOWN);
rpio.open(33, rpio.INPUT, rpio.PULL_DOWN);

function pollcb(cbpin)
{
  var state
  if (cbpin == 40) {
    state = rpio.read(cbpin) ? 'on' : 'off';
    console.log('Button event on P%d (button currently %s)', cbpin, state);
    io.sockets.emit('areyouthere', { value: state });
  }
  if (cbpin == 33) {
      state = rpio.read(cbpin) ? 'pressed' : 'released';
      console.log('Button event on P%d (button currently %s)', cbpin, state);
      io.sockets.emit('publish', { value: state });
  }
}
rpio.poll(40, pollcb);
rpio.poll(33, pollcb);
