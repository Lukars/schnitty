window.addEventListener("devicemotion", function(event) {
    console.log(Process);
    console.log(event.acceleration.x);
    console.log(event.acceleration.y);
    console.log(event.acceleration.z);
    console.log(event.accelerationIncludingGravity.x);
    console.log(event.accelerationIncludingGravity.y);
    console.log(event.accelerationIncludingGravity.z);
    console.log(event.rotationRate.alpha);
    console.log(event.rotationRate.beta);
    console.log(event.rotationRate.gamma);
    console.log(event.interval);
}, true);

var elem = document.getElementById("content");
 
window.ondevicemotion = function(event) {
    elem.style.transform =
    "rotateY(" + ( -event.rotationRate.gamma ) + "deg)" +
    "rotateX(" + event.rotationRate.beta + "deg) " +
    "rotateZ(" + - ( event.rotationRate.alpha - 180 ) + "deg) ";
}

window.ondevicemotion = function(event) {
    // console.log(event.acceleration.x);
    // console.log(event.acceleration.y);
    // console.log(event.acceleration.z);
    // console.log(event.accelerationIncludingGravity.x);
    // console.log(event.accelerationIncludingGravity.y);
    // console.log(event.accelerationIncludingGravity.z);
    // console.log(event.rotationRate.alpha);
    // console.log(event.rotationRate.beta);
    // console.log(event.rotationRate.gamma);
    // console.log(event.interval);
}