const len = 784;
const total_data = 1000;

let cats_data;
let trains_data;
let rainbows_data;

let cats = {};
let trains = {};
let rainbows = {};

function preload() {
  cats_data = loadBytes("./datasets/cats1000.bin");
  trains_data = loadBytes("./datasets/trains1000.bin");
  rainbows_data = loadBytes("./datasets/rainbows1000.bin");
}

function prepareData(category, data) {
  category.training = [];
  category.testing = [];

  for (let i = 0; i < total_data; i++) {
    let offset = i * len;
    let threshold = floor(0.8 * total_data);
    if (i < threshold) {
      category.training[i] = data.bytes.subarray(offset, offset + len);
    } else {
      category.testing[i - 800] = data.bytes.subarray(offset, offset + len);
    }
  }
}

function setup() {
  createCanvas(280, 280);
  background(0);

  prepareData(cats, cats_data);
  prepareData(trains, trains_data);
  prepareData(rainbows, rainbows_data);
}

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

function draw() {}
