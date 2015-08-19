var fs = require('fs');
var index = fs.readFileSync(__dirname + '/../client/index.html');
var handlers = {};

handlers.generic = function (req,res){

	var ua = req.headers['user-agent'];//used to detect mobile and monitor

	if(req.url === '/'){
		if (ua.indexOf("Mobile") > -1){
			req.url = 'client/index.html';
		} else {
		req.url = 'client/monitor.html';
		}
	}

	//determining correct content-type for response
	var ext = req.url.split('.')[1] || 'text',
		contentType;
	if (ext === 'js'){
		contentType = 'application/javascript';
	} else if (ext === 'html'){
		contentType = 'text/html';
	} else if (ext === 'png'){
		contentType = 'image/png';
	} else if (ext === 'gif'){
		contentType = 'image/gif';
	} else if (ext === 'mp3'){
		contentType = 'audio/mpeg';
	} else if (ext === 'ico'){
		contentType = 'image/x-icon';
	}

	fs.readFile(__dirname + req.url, function (err, data){
		if (err){
			fs.readFile(__dirname + "/../client/404.html", function (err, data){
				res.writeHead(404);
				res.write(data);
				res.end();
			});
		}
		else {
			res.writeHead(200, {'Content-Type' : contentType});
	    	res.write(fs.readFileSync(__dirname + req.url));
    		res.end();
		}
	});

};

module.exports = handlers;
