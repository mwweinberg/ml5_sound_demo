// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js

Available parts are:
0   nose
1	leftEye
2	rightEye
3	leftEar
4	rightEar
5	leftShoulder
6	rightShoulder
7	leftElbow
8	rightElbow
9	leftWrist
10	rightWrist
11	leftHip
12	rightHip
13	leftKnee
14	rightKnee
15	leftAnkle
16	rightAnkle
=== */

let video;
let poseNet;
let poses = [];

let nose;

let song;

//new
let img;
function preload() {
  img = loadImage('assets/flower0.jpg');
  // Load a sound file
  song = loadSound('assets/theme.mp3');
}


function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  pixelDensity(1);
  nose = createVector(0,0);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();

  image(img, 0, 0);

  // Loop the sound forever
  // (well, at least until stop() is called)
  song.loop();

}

function modelReady() {
  select('#status').html('Model Loaded');
}

function mousePressed(){
  console.log(JSON.stringify(poses[0].pose.keypoints[0].part))
}

function draw() {

  //image(video, 0, 0, width, height);
  image(img, 0, 0);

  if (poses.length > 0) {
    let pose = poses[0].pose;

    nose = pose['nose'];
  }

  loadPixels();
    for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Calculate the 1D location from a 2D grid
      let loc = (x + y * width) * 4;
      // Get the R,G,B values from image
      let r, g, b;
      r = pixels[loc];
      // Calculate an amount to change brightness based on proximity to the mouse
      let maxdist = 50; //this controls the size of the circle
      //flips (or re-flips) the x number so the circle follows your face from left to right (default is mirrored movement)
      let fixed_nose_x = map(nose.x, 0, width, width, 0);
      let d = dist(x, y, fixed_nose_x, nose.y);
      let adjustbrightness = (255 * (maxdist - d)) / maxdist;//the first number controls how bright/washed out the center is
      r += adjustbrightness;
      // Constrain RGB to make sure they are within 0-255 color range
      r = constrain(r, 0, 255);
      // Make a new color and set pixel in the window
      //color c = color(r, g, b);
      let pixloc = (y * width + x) * 4;
      pixels[pixloc] = r;
      pixels[pixloc + 1] = r;
      pixels[pixloc + 2] = r;
      pixels[pixloc + 3] = 255;
    }
  }
  updatePixels();

  //song part
  background(200);

  fixed_nose_x_out = map(nose.x, 0, width, width, 0);

  // Set the volume to a range between 0 and 1.0
  let volume = map(fixed_nose_x_out, 0, width, 0, 1);
  volume = constrain(volume, 0, 1);
  song.amp(volume);

  // Set the rate to a range between 0.1 and 4
  // Changing the rate alters the pitch
  let speed = map(nose.y, 0.1, height, 0, 2);
  speed = constrain(speed, 0.01, 4);
  song.rate(speed);

  // Draw some circles to show what is going on
  stroke(0);
  fill(51, 100);
  ellipse(fixed_nose_x_out, 100, 48, 48);
  stroke(0);
  fill(51, 100);
  ellipse(100, nose.y, 48, 48);
}
