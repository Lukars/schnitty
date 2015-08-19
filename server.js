var http = require ("http");
var handlers = require('./server/handlers.js');
var server = http.createServer(handler);
var io = require('socket.io')(server); 

//socket exchange of info between client and monitor
io.on('connection', function(socket){
	
	socket.on('motion', function(motionX){
		io.emit('motion', motionX);
	});

	socket.on('start', function (msg){
		io.emit('startgame', 'true');
	});

	socket.on('restart', function (){
		io.emit('restartgame', 'true');
	});

	socket.on('width', function (msg){
		io.emit('width', msg);
	});

});

// port 3000 for running on localhost
server.listen(process.env.PORT || 3000);

function handler (req, res){
	var route = req.method + " " + req.url;
	var handlerVar = handlers[route];//at the moment only generic handler in use

	if (handlerVar){
		handlerVar(req,res);
	}
	else {
		handlers.generic(req, res);
	}
}

module.exports = handler;