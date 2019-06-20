let capture;
let classifier;
let isModelLoaded = false;
let myCanvas;
let curWidth = 400;
let curHeight = 240;
let isCaptureMode = false;
let dim;

async function setup() {
//  dim = (windowHeight < windowWidth) ? windowHeight : windowWidth;
  dim = (displayHeight < displayWidth) ? displayHeight : displayWidth;

  myCanvas = createCanvas(dim, dim);
  background(0);

  capture = createCapture({
    audio: false,
    video: {
      facingMode: "environment"
    }
  });

window.myCanvas = myCanvas;
window.capture = capture;

  capture.size(dim, dim);

  isCaptureMode = true;
  myCanvas.hide();
  capture.show();

  classifier = ml5.imageClassifier("MobileNet", () => {
    isCaptureMode = true;
    isModelLoaded = true;

    alert("MobileNet Classifier Loaded!");
    console.log("MobileNet Classifier Loaded!");
  });
}

let currentCapture;

let handleClick = function() {
  if(isCaptureMode === true) {
    isCaptureMode = false;
    capture.hide();
    myCanvas.show();
  }
  else {
    isCaptureMode = true;
    myCanvas.hide();
    capture.show();
  }

  clear();
  background(0);

  if(isCaptureMode === false) {
    capture.loadPixels();
    image(capture, 0, 0, dim, dim);

    let img = createImg(myCanvas.canvas.toDataURL(), () => {

      if(isModelLoaded === true) {
        classifier.predict(img, (err, results) => {
console.log("classifier.predict", results);

          if(err) { console.error(err); }
          else {
            fill(255);
            stroke(0);
            strokeWeight(4);
            textSize(24);
            text(results[0].label, 10, height - 100, width - 10, height - 200);
            results.forEach( result => console.log(`${result.label}:`, result.confidence) );
          }
          img.remove();
        });
        img.hide();
      }
    });
  }
};

function mouseReleased() {
  handleClick();

  return false;
}

function touchEnded() {
  handleClick();

  return false;
}

function draw() {

}
