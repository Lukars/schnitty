# Schnitty

Schnitty is Pong. Schnitty is being controlled via your mobile phone. Schnitty is being played on your computer. Schnitty is using real-time gyrosensor data to give you some good fun. Schnitty will have multiplayer.

[To see Schnitty in action, please navigate to tiny.cc/schnitty .](http://www.tiny.cc/schnitty)

## Notes:
- does not work with Firefox, for some reason Firefox does not provide gyrosensor data
- requires fast network connection, as steering is being transmitted via socket
- prevent your mobile screen from rotating to play without interruption
- multiplayer will be implemented after it has been showcased
- the paddles sometimes look a bit laggy because the game is being rendered with 60fps, but steering data is only transmitted every 50ms(in case of low latency!)
- has not been tested with blackberry or windows phone, feedback appreciated
