var express = require('express');
var app = express();
var socketIo = require('socket.io');

var chat = {};

chat.io = false;
chat.userName = {};
chat.usedName = [];
chat.userNum = 0;
chat.currentRoom = {};

chat.initialize = function(http) {
	this.io = socketIo(http);
	this.ioListen();
}

chat.ioListen = function() {
	
	var that = this;

	this.io.on('connection', function(socket){

		that.disconnect(socket);
		
		that.assignRoom(socket);

		socket.on('change room', function(msg){

			that.changeRoom(socket, msg);

		});

		socket.on('sys message', function(msg){
			that.sysMsg(socket, msg);
		});	

		socket.on('chat message', function(msg){
			that.userMsg(socket, msg);
		});

		that.assignGuestName(socket);

		that.changeName(socket);

	});
}

chat.userMsg = function(socket, msg) {

	this.io.to(this.currentRoom[socket.id]).emit('chat message', msg);
}

chat.sysMsg = function(socket, msg) {

	this.io.to(this.currentRoom[socket.id]).emit('sys message', msg);
	
}

chat.assignGuestName = function(socket) {

	this.userName[socket.id] = 'Guest' + this.userNum;
	this.usedName.push('Guest' + this.userNum);
	this.userNum++;

	var msg = this.userName[socket.id] + ' enter the room! Welcome!';

	this.io.emit('new user', msg);

}

chat.disconnect = function(socket) {

	var that = this;

	socket.on('disconnect', function(){
		var msg = that.userName[socket.id] + ' just left';

		that.io.emit('exit user', msg);

		var nameIndex = that.usedName.indexOf(that.userName[socket.id]);

		delete that.userName[socket.id];
		delete that.usedName[nameIndex];   

		socket.leave(that.currentRoom[socket.id]);

		delete that.currentRoom[socket.id]; 
	});

}

chat.changeName = function(socket) {

	var that = this;

	socket.on('change name', function(msg){
		if (that.usedName.indexOf(msg) == -1) {

			var nameIndex = that.usedName.indexOf(that.userName[socket.id]);
			that.userName[socket.id] = msg;
			that.usedName[nameIndex] = msg;
			that.io.emit('sys message', 'Your name has been changed as ' + msg);
		}
		else {
			that.io.emit('sys message', 'Your name has been used');
		}

	});
}

chat.assignRoom = function(socket) {
	
	var that = this;
	socket.join('Lobby', function(){
		that.currentRoom[socket.id] = 'Lobby';
	});
}

chat.changeRoom = function(socket, msg) {

	var that = this;

	var sysMsg = that.userName[socket.id] + ' left room ' + that.currentRoom[socket.id];

	this.io.to(this.currentRoom[socket.id]).emit('sys message', sysMsg);

	socket.leave(this.currentRoom[socket.id], function(){

		socket.join(msg);

		that.currentRoom[socket.id] = msg;

		sysMsg = that.userName[socket.id] + ' join room ' + that.currentRoom[socket.id];
		
		socket.emit('sys message', sysMsg);

		socket.emit('change room name', msg);

	});

	
}

module.exports = chat;


