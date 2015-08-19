var socket = io();
//set variables for movement, gamewidth detection and os detection
var  x = 0, y = 0,
    vx = 0, vy = 0,
	ax = 0, ay = 0,
	browserWidth = 1024,
	os=getOS();

//width of game arrives and is being set
socket.on('width', function(width){
	browserWidth = width;
});

//evaluating OS of mobile
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

//if you move mobile send movement data
if (window.DeviceMotionEvent != undefined) {
	window.ondevicemotion = function(e) {
		ax = event.accelerationIncludingGravity.x * 35;
	};

	//android movement is negative value compared to iOS and others
	setInterval( function() {
		if ( os === 'Android') {
			vx = vx - ax;
		} else {
			vx = vx + ax;
		}
		vx = vx * 0.98;
		x = parseInt(x + vx / 50);
		
		wallStopsPaddle();//check if paddle hits wall
		motionX = x;
		socket.emit('motion', motionX);//send movement data

	}, 50);//send every 50 ms
}; 

//stop increasing x-movement if wall of game is reached
function wallStopsPaddle () {
	if (x<150) { x = 150; vx = 0; ax = 0;}
	if (x>browserWidth-150) { x = browserWidth-150; vx = 0; ax = 0;}
};

//swap buttons after start
function hide(){
	document.getElementById('startbutton').setAttribute('style','display:none;');
	document.getElementById('restartbutton').setAttribute('style','height:150px;width:100%;font-size:30px;display:block;');
}