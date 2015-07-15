var http = require ("http");
var handlers = require('./handlers.js');
var server = http.createServer(handler);
var io = require('socket.io')(server); 

io.on('connection', function(socket){
	
	socket.on('motion', function(motionArr){
		console.log(motionArr);
		io.emit('ballMovement', motionArr);
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