var socket = io();
var  x = 0, y = 0,
    vx = 0, vy = 0,
	ax = 0, ay = 0,
	browserWidth = 1024,
	secondPlayer=false,
	os=getOS();

socket.on('width', function(width){
	browserWidth = width;
});

function getOS() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
  {
    return 'iOS';
  }
  else if( userAgent.match( /Android/i ) )
  {
    return 'Android';
  }
  else
  {
    return 'unknown';
  }
}

if (window.DeviceMotionEvent != undefined) {
	window.ondevicemotion = function(e) {
		ax = event.accelerationIncludingGravity.x * 75;
		ay = event.accelerationIncludingGravity.y * 35;	
	}

	setInterval( function() {
		var landscapeOrientation = window.innerWidth/window.innerHeight > 1;
		if ( landscapeOrientation) {
			vx = vx + ay;
			vy = vy + ax;
		} else if (os = 'Android'){
			vx = vx + ay;
		} else {
			vy = vy - ay;
			vx = vx + ax;
		}
		vx = vx * 0.98;
		vy = vy * 0.98;
		y = parseInt(y + vy / 50);
		x = parseInt(x + vx / 50);
		
		boundingBoxCheck();
		socket.emit('motion', x);

	}, 100);
}; 

function boundingBoxCheck () {
	if (x<150) { x = 150; vx = 0; }
	//if (y<0) { y = 0; vy = 0; }
	if (x>browserWidth-150) { x = browserWidth-150; vx = 0; ax = 0; }
	//if (y>browserHeight-200) { y = browserHeight-200; vy = 0; vy = 0; }
};