var fs = require('fs');
var index = fs.readFileSync(__dirname + '/index.html');
var handlers = {};



//route handler for any request
handlers.generic = function (req,res){

	if(req.url === '/'){

		var ua = req.headers['user-agent'],
	    	$ = {};
	    console.log(ua);
	    
		if (/mobile/i.test(ua)){
			$.Mobile = true;
			req.url = '/index.html';

		}
		// if (/like Mac OS X/.test(ua)) {
		//     $.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
		//     $.iPhone = /iPhone/.test(ua);
		//     $.iPad = /iPad/.test(ua);
		// }

		// if (/Android/.test(ua))
		//     $.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];

		req.url = '/monitor.html';
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
