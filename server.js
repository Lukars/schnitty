var http = require ("http");
var handlers = require('./handlers.js');
var server = http.createServer(handler);
var io = require('socket.io')(server); 

io.on('connection', function(socket){
	
	socket.on('motion', function(motionX){
		console.log(motionX);
		io.emit('motion', motionX);
	});

	socket.on('start', function (msg){
		console.log("start game button pressed", msg);
		io.emit('startgame', 'true');
	});

	socket.on('restart', function (){
		io.emit('restartgame', 'true');
		console.log("restart game button pressed");
	});
	socket.on('width', function (msg){
		io.emit('width', msg);
	});

});

server.listen(process.env.PORT || 3000);

function handler (req, res){
	var route = req.method + " " + req.url;
	if(route.match(/[?]/g)){
		route = route.split('?')[0];
	}
	var handlerVar = handlers[route];
	if (handlerVar){
		handlerVar(req,res);
	}
	else {
		handlers.generic(req, res);
	}
}

module.exports = handler;