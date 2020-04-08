const len = 784;
const total_data = 1000;

let cats_data;
let trains_data;
let rainbows_data;
let moon_data;

let cats = {};
let trains = {};
let rainbows = {};
let moons = {};

let nn;

function preload() {
  cats_data = loadBytes("./datasets/cats1000.bin");
  trains_data = loadBytes("./datasets/trains1000.bin");
  rainbows_data = loadBytes("./datasets/rainbows1000.bin");
  moon_data = loadBytes("./datasets/moons1000.bin");
}

function prepareData(category, data, label) {
  category.training = [];
  category.testing = [];

  for (let i = 0; i < total_data; i++) {
    let offset = i * len;
    let threshold = floor(0.8 * total_data);
    if (i < threshold) {
      category.training[i] = data.bytes.subarray(offset, offset + len);
      category.training[i].label = label;
    } else {
      category.testing[i - threshold] = data.bytes.subarray(
        offset,
        offset + len
      );
      category.testing[i - threshold].label = label;
    }
  }
}

function trainEpoch(training) {
  shuffle(training, true);

  //train for one epoch
  // for (let i = 0; i < training.length; i++) {
  for (let i = 0; i < training.length; i++) {
    let data = training[i];
    let inputs = [];
    inputs = data.map((x) => x / 255);
    let label = training[i].label;
    // console.log(inputs);
    // console.log(label);

    let targets = [0, 0, 0, 0];
    targets[label] = 1;
    // console.log(targets);
    nn.train(inputs, targets);
  }
}

function testAll(testing) {
  let c = 0;
  let correct = 0;
  shuffle(testing, true);

  //train for one epoch
  for (let i = 0; i < testing.length; i++) {
    // for (let i = 0; i < 1; i++) {
    let data = testing[i];
    let inputs = [];
    inputs = Array.from(data).map((x) => x / 255);
    let label = testing[i].label;
    let guess = nn.feedforward(inputs);

    // console.log(guess);
    let classification = guess.indexOf(max(guess));
    // console.log(label);
    // console.log(classification);

    if (classification === label) {
      correct++;
    }
    c++;
  }
  let percentage = (100 * correct) / testing.length;
  return percentage;
}

function setup() {
  createCanvas(280, 280);
  background(255);
  //Preparing data
  prepareData(cats, cats_data, 0);
  prepareData(trains, trains_data, 1);
  prepareData(rainbows, rainbows_data, 2);
  prepareData(moons, moon_data, 3);
  //making the neural netowrk
  nn = new NeuralNetwork(784, 64, 4);

  //randomizing
  let training = [];
  training = training.concat(cats.training);
  training = training.concat(rainbows.training);
  training = training.concat(trains.training);
  training = training.concat(moons.training);
  // console.log(training);
  let testing = [];
  testing = testing.concat(cats.testing);
  testing = testing.concat(rainbows.testing);
  testing = testing.concat(trains.testing);
  testing = testing.concat(moons.testing);
  // console.log(testing);

  let trainButton = select("#train");
  let epochCounter = 0;
  trainButton.mousePressed(function () {
    let epoch = document.getElementById("epoch");

    trainEpoch(training);
    epochCounter++;
    console.log("EPOCH: " + epochCounter);
    epoch.innerHTML = epochCounter;
  });

  let testButton = select("#test");
  testButton.mousePressed(function () {
    let acc = document.getElementById("acc");

    let testPercent = testAll(testing);
    console.log("Percent: " + nf(testPercent, 2, 2) + "%");

    acc.innerHTML = nf(testPercent, 2, 2) + "%";
  });

  let guessButton = select("#guess");
  guessButton.mousePressed(function () {
    let inputs = [];
    let img = get();
    img.resize(28, 28);
    // console.log(img);
    img.loadPixels();
    for (let i = 0; i < len; i++) {
      let bright = img.pixels[i * 4];
      inputs[i] = (255 - bright) / 255;
    }
    // console.log(inputs);
    let cat_l = document.getElementById("cat_l");
    let rainbow_l = document.getElementById("rainbow_l");
    let train_l = document.getElementById("train_l");
    let moon_l = document.getElementById("moon_l");
    let ans = document.getElementById("ans");

    let guess = nn.feedforward(inputs);
    cat_l.innerHTML = nf(guess[0], 1, 2);
    rainbow_l.innerHTML = nf(guess[1], 1, 2);
    train_l.innerHTML = nf(guess[2], 1, 2);
    moon_l.innerHTML = nf(guess[3], 1, 2);
    let classification = guess.indexOf(max(guess));
    if (classification == 0) {
      console.log("cat");
      ans.innerHTML = "CAT";
    } else if (classification == 1) {
      console.log("rainbow");
      ans.innerHTML = "RAINBOW";
    } else if (classification == 2) {
      console.log("train");
      ans.innerHTML = "TRAIN";
    } else if (classification == 3) {
      console.log("moon");
      ans.innerHTML = "MOON";
    }
    // image(img, 0, 0);
  });

  let clearButton = select("#clr");
  clearButton.mousePressed(function () {
    background(255);
  });

  // for (let i = 0; i < 5; i++) {
  //   trainEpoch(training);
  //   console.log("EPOCH: " + i);

  //   let percentage = testAll(testing);
  //   console.log("% correct: " + percentage);
  // }
}

//---------display------
// let total = 100;
// for (let n = 0; n < total; n++) {
//   let img = createImage(28, 28);
//   img.loadPixels();
//   let offset = n * 784;
//   for (let i = 0; i < 784; i++) {
//     let val = 255 - cats.bytes[i + offset];
//     img.pixels[i * 4 + 0] = val;
//     img.pixels[i * 4 + 1] = val;
//     img.pixels[i * 4 + 2] = val;
//     img.pixels[i * 4 + 3] = 255;
//   }
//   img.updatePixels();

//   let x = 28 * (n % 10);
//   let y = floor(n / 10) * 28;
//   image(img, x, y);
// }
//-----end display-----------

function draw() {
  strokeWeight(8);
  stroke(0);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}
