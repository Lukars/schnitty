var fs = require('fs');
var index = fs.readFileSync(__dirname + '/index.html');
var handlers = {};



//route handler for any request
handlers.generic = function (req,res){

	var ua = req.headers['user-agent'];

	if(req.url === '/'){
		if (ua.indexOf("Mobile") > -1){
			req.url = '/index.html';
		} else {
		req.url = '/monitor.html';
		}
	}

	var ext = req.url.split('.')[1] || 'text';
	fs.readFile(__dirname + req.url, function (err, data){
		if (err){
			fs.readFile(__dirname + "/404.html", function (err, data){
				res.writeHead(404);
				res.write(data);
				res.end();
			});
		}
		else {
			res.writeHead(200, {'Content-Type' : 'text/' + ext});
	    	res.write(fs.readFileSync(__dirname + req.url));
	    		res.end();
		}
	});

};

module.exports = handlers;
