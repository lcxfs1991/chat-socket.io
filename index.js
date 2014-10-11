var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var chat = require('./routes/chat');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile('./public/index.html');
});

chat.initialize(http);

http.listen(2501, function(){
  console.log('listening on *:2501');
});