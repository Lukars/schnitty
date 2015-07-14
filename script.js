var socket = io('localhost:3000');
var motionObj = [];

socket.on('ballMovement', function(movementObj){
	console.log(movementObj);
	sphere.style.top = movementObj.top + "px";
	sphere.style.left = movementObj.left + "px";
});

var  x = 0, y = 0,
    vx = 0, vy = 0,
		ax = 0, ay = 0;


if (window.DeviceMotionEvent != undefined) {
	window.ondevicemotion = function(e) {
		ax = event.accelerationIncludingGravity.x * 5;
		ay = event.accelerationIncludingGravity.y * 5;
		// motionObj.accelerationX = e.accelerationIncludingGravity.x;
		// motionObj.accelerationY = e.accelerationIncludingGravity.y;
		// motionObj.accelerationZ = e.accelerationIncludingGravity.z;

		// if ( e.rotationRate ) {
		// 	motionObj.rotationAlpha = e.rotationRate.alpha;
		// 	motionObj.rotationBeta = e.rotationRate.beta;
		// 	motionObj.rotationGamma = e.rotationRate.gamma;
		// }		
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
		
		motionObj.top = y;
		motionObj.left = x;
		socket.emit('motion', motionObj);
	}, 25);
} 

function boundingBoxCheck(){
	if (x<0) { x = 0; vx = -vx; }
	if (y<0) { y = 0; vy = -vy; }
	if (x>document.documentElement.clientWidth-20) { x = document.documentElement.clientWidth-20; vx = -vx; }
	if (y>document.documentElement.clientHeight-20) { y = document.documentElement.clientHeight-20; vy = -vy; }
	
}