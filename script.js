var socket = io();
var motionArr = {};
var  x = 0, y = 0,
    vx = 0, vy = 0,
		ax = 0, ay = 0;

if (window.DeviceMotionEvent != undefined) {
	window.ondevicemotion = function(e) {
		ax = event.accelerationIncludingGravity.x * 5;
		ay = event.accelerationIncludingGravity.y * 5;	
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
	if (x<0) { x = 0; vx = -vx; }
	if (y<0) { y = 0; vy = -vy; }
	if (x>document.documentElement.clientWidth-20) { x = document.documentElement.clientWidth-20; vx = -vx; }
	if (y>document.documentElement.clientHeight-20) { y = document.documentElement.clientHeight-20; vy = -vy; }
	
};

// motionArr.accelerationX = e.accelerationIncludingGravity.x;
// motionArr.accelerationY = e.accelerationIncludingGravity.y;
// motionArr.accelerationZ = e.accelerationIncludingGravity.z;

// if ( e.rotationRate ) {
// 	motionArr.rotationAlpha = e.rotationRate.alpha;
// 	motionArr.rotationBeta = e.rotationRate.beta;
// 	motionArr.rotationGamma = e.rotationRate.gamma;
// }	