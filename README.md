# phaser-eric-testing-tiles

This is to try phaser on my own.
I want to get the following done:



TODO 1:
DONE - build cheap tile set with angles
DONE - build a simple level with Tiled
DONE   - create collisiosn in Tiled
DONE   - make spawn point in level with Tiled
DONE - import level into Phaser with collisions
DONE - create slime assets
DONE  - idle
DONE  - walking
DONE  - rising
DONE  - falling
DONE - Import slime into world
DONE  - use a box for collision (roughly the size of the actual slime)
DONE  - slime uses WASD for controls, with animation playing appropriately 
DONE - Camera
DONE  - make camera follow slime around
DONE  - make it so the camera doesn't go off tilemap


TODO 2:
- modify slime
DONE   - modify slime to have a compound body instead of simple body
   - modify slime to "fix" the ghost collision problem
   - modify slime to "fix" the sticky wall problem


TODO 3:
DONE - build a player class
DONE   - create state machine as you did in Unity
DONE   - use old sprite sheet for graphics
   

9/8/2020
 - I stopped working on this project on 9/8/2020 so I could look into arcade physics.
 I turns out that solving for the ghost collision problem is pretty difficult to do. You have to dive into the matter js engine to 
 do it (stop collisions on certain axises based on the tile). Also, as I've learned from the internet and doing it myself, turns
 out slopes can NOT be solved with a generic physics system + generic collision detection + generic response system. They had slopes
 back in NES days with mario 3 and M.C. Kids, and I've read about them in articles from programmers smarter than me. Turns out, they use
 math and scripts to control the characters (iow, its controlled through code. Not collision detection and response). So...after all this time,
 I thought that this problem was solved for. Well it turns out its not. We are STILL using code to allow slopes in platforming games...or
 atleast the ones like mario and super metroid and yoshi's island we are. Crazy!