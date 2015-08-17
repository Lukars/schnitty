var socket = io();
var  x = 0, y = 0,
    vx = 0, vy = 0,
	ax = 0, ay = 0,
	browserWidth = 1024;

socket.on('width', function(width){
	browserWidth = width;
});

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
		} else {
			vy = vy - ay;
			vx = vx + ax;
		}
		vx = vx * 0.98;
		vy = vy * 0.98;
		y = parseInt(y + vy / 50);
		x = parseInt(x + vx / 50);
		
		boundingBoxCheck();
		
		motionX = x;
		socket.emit('motion', motionX);
	}, 100);
}; 

function boundingBoxCheck(){
	if (x<0) { x = 0; vx = 0; }
	//if (y<0) { y = 0; vy = 0; }
	if (x>browserWidth-200) { x = browserWidth-200; vx = 0; ax = 0; }
	//if (y>browserHeight-200) { y = browserHeight-200; vy = 0; vy = 0; }
	
};
