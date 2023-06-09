
function setupCSS() {
  const style = document.createElement('style');
  style.innerHTML = `
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
}

setupCSS(); // Call the setupCSS function to apply the CSS
// Original code by The Wizard Bear

const string = "ART BASE .digital"; //words to be displayed
const baseSize = 120; //font base size
const fontFile = "Muli-Black.ttf";
const showText = true; //whether or not to have an overlay of the original text (in the background color)
const textAlpha = 100; //the alpha of the text if displayed (low value will make it slowly fade in)
const backgroundColor = 237; //kinda self-explanatory
const strokeAlpha = 10; //the alpha of the lines (lower numbers are more transparent)
const strokeColor = 0; //the line color

const fontSampleFactor = 0.6; //How many points there are: the higher the number, the closer together they are (more detail)

const noiseZoom = 0.006; //how zoomed in the perlin noise is
const noiseOctaves = 4; //The number of octaves for the noise
const noiseFalloff = 0.5; //The falloff for the noise layers

const zOffsetChange = 0; //How much the noise field changes in the z direction each frame
const individualZOffset = 0; //how far away the points/lines are from each other in the z noise axies (the bigger the number, the more chaotic)

const lineSpeed = 1; //the maximum amount each point can move each frame

const newPointsCount = 9; //the number of new points added when the mouse is dragged

var font;
var points = [];
var startingPoints;

function preload() {
  font = loadFont(fontFile);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(backgroundColor);
  textFont(font);
  textSize(calculateFontSize()); // Update the font size
  fill(backgroundColor, textAlpha);
  stroke(strokeColor, strokeAlpha);
  noiseDetail(noiseOctaves, noiseFalloff);
  updateStartingPoints();
}

function draw() {
  if (showText) {
    noStroke();
    stroke(strokeColor, strokeAlpha);
  }
  for (let pt = 0; pt < points.length; pt++) {
    let p = points[pt];
    let noiseX = p.x * noiseZoom;
    let noiseY = p.y * noiseZoom;
    let noiseZ = frameCount * zOffsetChange + p.zOffset * individualZOffset;
    let newPX = p.x + map(noise(noiseX, noiseY, noiseZ), 0, 1, -lineSpeed, lineSpeed);
    let newPY = p.y + map(noise(noiseX, noiseY, noiseZ + 214), 0, 1, -lineSpeed, lineSpeed);
    line(p.x, p.y, newPX, newPY);
    p.x = newPX;
    p.y = newPY;
  }
  textSize(calculateFontSize()); // Update the font size
  text(string, width / 2 - textWidth(string) / 2, height / 2);
}

function keyPressed() {
  if (key == 's') {
    save();
  }
}

function mouseDragged() {
  for (let i = 0; i < newPointsCount; i++) {
    let angle = random(TAU);
    let magnitude = randomGaussian() * ((newPointsCount - 1) ** 0.5 * 3);
       let newPoint = {
      "x": mouseX + magnitude * cos(angle),
      "y": mouseY + magnitude * sin(angle),
      "zOffset": random()
    };
    points[points.length] = newPoint;
    startingPoints[startingPoints.length] = newPoint;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  textSize(calculateFontSize()); // Update the font size
  updateStartingPoints();
}

function updateStartingPoints() {
  startingPoints = font.textToPoints(string, width / 2 - textWidth(string) / 2, height / 2, calculateFontSize(), { "sampleFactor": fontSampleFactor });

  points = [];
  for (let p = 0; p < startingPoints.length; p++) {
    points[p] = startingPoints[p];
    points[p].zOffset = random();
  }
}

function calculateFontSize() {
  // Calculate font size based on screen dimensions
  return baseSize * min(windowWidth / 1200, windowHeight / 800);
}

