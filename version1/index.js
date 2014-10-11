/**
 * index.js
 * @author LeeHey 
 * @email lcxfs1991@gmail.com
 * @description
 * This file is to setup the basic Node.js server and require necessary server module
 */

//express.js framework
var express = require('express');
var app = express();

//create an http object based on express.js
var http = require('http').Server(app);

//module manage folder path
var path = require('path');

//main processing file
var chat = require('./routes/chat');

//set /public as the folder to serve static files
app.use(express.static(path.join(__dirname, 'public')));

//route / to /public/index.html
app.get('/', function(req, res){
  res.sendFile('./public/index.html');
});


//initialize all http setting in chat object
chat.initialize(http);


//listen to port 2501
http.listen(2501, function(){
  console.log('listening on *:2501');
});