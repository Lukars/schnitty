var socket = io();

socket.on('ballMovement', function(movementArr){
	console.log(movementArr);
	sphere.style.top = movementArr[0] + "px";
	sphere.style.left = movementArr[1] + "px";
});