var socket = io();
var  x = 0, y = 0,
    vx = 0, vy = 0,
	ax = 0, ay = 0,
	browserWidth = 1024,
	os=getOS();

socket.on('width', function(width){
	browserWidth = width;
});

function getOS() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if( userAgent.match( /iPad/i ) 	|| 
	  userAgent.match( /iPhone/i ) 	|| 
  	  userAgent.match( /iPod/i ) ) 
  {
	  return 'iOS';
  } else if( 
  	  userAgent.match( /Android/i ) )  {
	  return 'Android';
  } else {
      return 'unknown';
  }
};

if (window.DeviceMotionEvent != undefined) {
	window.ondevicemotion = function(e) {
		ax = event.accelerationIncludingGravity.x * 35;
	};

	setInterval( function() {
		if ( os === 'Android') {
			vx = vx - ax;
		} else {
			vx = vx + ax;
		}
		vx = vx * 0.98;
		x = parseInt(x + vx / 50);
		
		boundingBoxCheck();
		motionX = x;
		socket.emit('motion', motionX);

	}, 50);
}; 

function boundingBoxCheck () {
	if (x<150) { x = 150; vx = 0; }
	if (x>browserWidth-150) { x = browserWidth-150; vx = 0; ax = 0; }
};

function hide(){
	var img = document.getElementById('howto');
	img.attr('display','none');
	var button = document.getElementById('startbutton');
	button.attr('display','none');
}