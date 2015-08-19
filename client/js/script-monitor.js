var socket = io();
var browserWidth = document.documentElement.clientWidth;


window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     ||  
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelRequestAnimFrame = ( function() {
	return window.cancelAnimationFrame          	||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     	||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
} )();

var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
		W = window.innerWidth,
		H = window.innerHeight,
		particles = [],//array of particles for collision ball/paddle
		ball = {},
		paddles = [2],
		mouse = {}, //mouse object for steering paddles
		points = 0,
		fps = 60,
		particlesCount = 20, //amount of particles to be emitted when ball collides with paddle
		flag = 0, //flag changes on collision
		particlePos = {}, //contains the position of collision
		multipler = 1, // controls direction of sparks
		startScreen = {},
		restartBtn = {},
		over = 0,//flags game over
		init, //initialize animation
		paddleHit;

//init collision sound
collision = document.getElementById("collide");

//set canvas to full screen
canvas.width = W;
canvas.height = H;

function paintCanvas() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, W, H);
}
//set paddle size and position
function Paddle(pos) {
	this.h = 25;
	this.w = 300;
	
	this.x = W/2 - this.w/2;
	this.y = (pos == "top") ? 0 : H - this.h;
	
}

//now push into paddle array
paddles.push(new Paddle("bottom"));
paddles.push(new Paddle("top"));

//set ball position, radius, color and speed
ball = {
	x: 50,
	y: 50, 
	r: 15,
	c: "green",
	vx: 4,
	vy: 8,

	//draw ball on canvas
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
	}
};

//set startscreen font, textalign, color, text and position
startScreen = {
	
	draw: function() {		
		ctx.font = "24px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "white";
		ctx.fillText("To start open http://tiny.cc/schnitty in your mobile phone browser.", W/2, H/2 );
		ctx.fillText("Prevent screen rotation for better handling, does not work with firefox and requires fast network connection.", W/2, H/2+150 );
		var img = document.getElementById('qr');
		ctx.drawImage(img, W/2-100, H/2-250);
	}
};

//set restartbutton font, textalign, color, text and position 
restartBtn = {
	w: 100,
	h: 50,
	x: W/2 - 50,
	y: H/2 - 50,
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "3";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		
		ctx.font = "24px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "white";
		ctx.fillText("Restart", W/2, H/2 - 25 );
	}
};

//create particles, set radius and randomize emission
function createParticles(x, y, m) {
	this.x = x || 0;
	this.y = y || 0;
	
	this.radius = 1.9;
	
	this.vx = -1.5 + Math.random()*3;
	this.vy = m * Math.random()*1.5;
}

//draw everything on canvas
function draw() {
	paintCanvas();
	for(var i = 0; i < paddles.length; i++) {
		p = paddles[i];
		
		ctx.fillStyle = "white";
		ctx.fillRect(p.x, p.y, p.w, p.h);
	}
	
	ball.draw();
	update();
}

//increase speed after for collisions to raise difficulty
function increaseSpd() {
	if(points % 4 == 0) {
		if(Math.abs(ball.vx) < 15) {
			ball.vx += (ball.vx < 0) ? -1 : 1;
			ball.vy += (ball.vy < 0) ? -2 : 2;
		}
	}
}

// variables to count latency to keep track of playability
var timer,
	timeNow,
	timeDiff,
	highLatCounter=0;

function update() {
	
	updateScore(); 
	// movement arrives via socket
	socket.on('motion', function(motionX){
		mouse.x = motionX;
		timeNow = Date.now();
		timeDiff = timeNow - timer; //calculate latency and console log if lat is high
		highLatCounter = (timeDiff > 100 ? highLatCounter++ : highLatCounter--);
		if (highLatCounter > 20){
			console.log("latency is higher than 100ms!");
		}
		timer = timeNow;
	});
	
	// if movement exists assign it to paddles
	if(mouse.x) {
		// for(var i = 1; i < paddles.length; i++) { //both paddles move alike
		// 	p = paddles[i];
		// 	p.x = mouse.x - p.w/2;
		// }
		paddles[1].x = mouse.x - paddles[1].w/2; //paddles are inverted to increase difficulty
		paddles[2].x = browserWidth - (mouse.x - paddles[2].w/2) - 300;		
	}
	
	//actual ball movement by adding speed value to coordinates
	ball.x += ball.vx;
	ball.y += ball.vy;
	
	//collision ball with paddles
	p1 = paddles[1];
	p2 = paddles[2];


	if(collides(ball, p1)) {
		collideAction(ball, p1);
	}
	
	
	else if(collides(ball, p2)) {
		collideAction(ball, p2);
	} 
	
	else {
		//if ball hits floor game is over
		if(ball.y + ball.r > H) {
			ball.y = H - ball.r;
			gameOver();
		} 
		
		else if(ball.y < 0) {
			ball.y = ball.r;
			gameOver();
		}
		// if ball hits walls invert the x-vector
		if(ball.x + ball.r > W) {
			ball.vx = -ball.vx;
			ball.x = W - ball.r;
		}
		
		else if(ball.x -ball.r < 0) {
			ball.vx = -ball.vx;
			ball.x = ball.r;
		}
	}
	
	//if flag is set emit particles
	if(flag == 1) { 
		for(var k = 0; k < particlesCount; k++) {
			particles.push(new createParticles(particlePos.x, particlePos.y, multiplier));
		}
	}	
	
	emitParticles();
	
	flag = 0;
}

//check collision paddles/ball
function collides(b, p) {
	if(b.x + ball.r >= p.x && b.x - ball.r <=p.x + p.w) {
		if(b.y >= (p.y - p.h) && p.y > 0){
			paddleHit = 1;
			return true;
		}
		
		else if(b.y <= p.h && p.y == 0) {
			paddleHit = 2;
			return true;
		}
		
		else return false;
	}
}

//on collision set ball and particle coordinates and direction
function collideAction(ball, p) {
	ball.vy = -ball.vy;
	
	if(paddleHit == 1) {
		ball.y = p.y - p.h;
		particlePos.y = ball.y + ball.r;
		multiplier = -1;	
	}
	
	else if(paddleHit == 2) {
		ball.y = p.h + ball.r;
		particlePos.y = ball.y - ball.r;
		multiplier = 1;	
	}
	
	points++;
	increaseSpd();
	
	if(collision) {
		if(points > 0) 
			collision.pause();
		
		collision.currentTime = 0;
		collision.play();
	}
	
	particlePos.x = ball.x;
	flag = 1;
}

function emitParticles() { 
	for(var j = 0; j < particles.length; j++) {
		par = particles[j];
		
		ctx.beginPath(); 
		ctx.fillStyle = "white";
		if (par.radius > 0) {
			ctx.arc(par.x, par.y, par.radius, 0, Math.PI*2, false);
		}
		ctx.fill();	 
		
		par.x += par.vx; 
		par.y += par.vy; 
		
		//particles die after certain distance
		par.radius = Math.max(par.radius - 0.05, 0.0); 
		
	} 
}

function updateScore() {
	ctx.fillStlye = "white";
	ctx.font = "26px Arial, sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + points, 20, 20 );
}

function gameOver() {
	ctx.fillStlye = "white";
	ctx.font = "30px Arial, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game Over - You scored "+points+" points!", W/2, H/2 + 25 );
	
	//stop animation
	cancelRequestAnimFrame(init);
	
	over = 1;
	
	//show restart button
	restartBtn.draw();
}

//running all the animation
function animloop() {
	init = requestAnimFrame(animloop);
	draw();
}

function initStartScreen() {
	draw();
	startScreen.draw();
}

//startbutton was pressed on mobile to run game	
socket.on('startgame', function (){
	socket.emit('width', browserWidth);
	animloop();
	console.log('starting game');
	startScreen = {};
} );
	
		
//restartbutton was pressed on mobile, start over		
socket.on('restartgame', function (){
	if(over == 1) {
	console.log('restarting game');
		ball.x = 20;
		ball.y = 20;
		points = 0;
		ball.vx = 2;
		ball.vy = 2;
		animloop();
		
		over = 0;
	}
});

initStartScreen();