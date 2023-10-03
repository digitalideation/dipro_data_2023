/* ~~~~~~~~~~~~export SVG
DDF 2019
1.
need to have p5.svg.js in project and in index.html
see -https://github.com/zenozeng/p5.js-svg
this will save an SVG file in your download folder
*/


let startAngle = 0;

function setup() {
  /* ~~~~~~~~~~~~ export SVG */
  //2. createCanvas mit dem Parameter SVG
  createCanvas(windowWidth, windowHeight, SVG);
  background(0);
  //set random color
  c = color(random(255), random(255), random(255));
  angleMode(DEGREES);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  for (var i = 20; i >= 0; i--) {
    //set the width of the rectangle
    let w = ((i+1) * height / 15)-frameCount%(21*height/15);
    //if width reaches 0, become the biggest
    if(w < 0){
      w += 21*height/15;
    }
      
    //set the color
    let tempc = lerpColor(color(255), c, w / (21*height/15));
    noFill();
    stroke(tempc);
    strokeWeight(4);
    //rotate
    rotate(startAngle + PI * 0.1);
    rect(-w / 2, -w / 2, w, w);
  }
  
  startAngle=((startAngle+0.1)%360);
}

function keyTyped() {
  if (key == 's') {
    let d=new Date();
    /* ~~~~~~~~~~~~ export SVG */
    save(d+".svg")
    noLoop();
  }
  
}