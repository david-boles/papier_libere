//Webworker that processes images
importScripts('https://unpkg.com/jimp@0.2.27/browser/lib/jimp.min.js');
importScripts('/jsQR.js');
importScripts('https://unpkg.com/perspective-transform@^1.1.3/dist/perspective-transform.min.js');

onmessage = (e) => {
  switch (e.data[0]) {
    case 'start':
      start(e.data[1]);
      break;
  }
}

function start(buffer) {
  Jimp.read(buffer).then(image => {
    postMessage(['display', image]);
    qrStage(image);

  }).catch((e) => {
    postMessage(['error', 'read', e]);
  });
}



function qrStage(image) {
  postMessage(['stage', 'qr']);
  var qr = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height);

  if(qr) {
    postMessage(['qr', qr]);
    perspectiveStage(image, qr);

  }else {
    console.log("QR code not found, trying a resize...");
    const resized = image.clone().resize(image.bitmap.width/3.5, Jimp.AUTO);
    qr = jsQR(resized.bitmap.data, resized.bitmap.width, resized.bitmap.height);

    for(var key in qr.location) {
      qr.location[key].x *= 3.5;
      qr.location[key].y *= 3.5;
    }

    if(qr) {
      postMessage(['qr', qr]);
      perspectiveStage(image, qr);
    }else {
      postMessage(['error', 'qr', 'No QR code was detected!']);
    }
  }
}

const ppi = 100;
const border = 50;
function perspectiveStage(image, qr) {
  postMessage(['stage', 'perspective']);
  const perspT = PerspT([qr.location.topLeftCorner.x, qr.location.topLeftCorner.y,
                       qr.location.topRightCorner.x, qr.location.topRightCorner.y,
                       qr.location.bottomLeftCorner.x, qr.location.bottomLeftCorner.y,
                       qr.location.bottomRightCorner.x,qr.location.bottomRightCorner.y],
                      [(7.5*ppi) + border, (10*ppi) + border,
                       (8.25*ppi) + border, (10*ppi) + border,
                       (7.5*ppi) + border, (10.75 * ppi) + border,
                       (8.25*ppi) + border, (10.75 * ppi) + border]);
  console.log('created transform');
  console.log(perspT);

  var output = new Jimp((8.5 * ppi) + (border * 2), (11 * ppi) + (border * 2));
  console.log('created output image');
  output.scan(0, 0, output.bitmap.width, output.bitmap.height, function (x, y, idx) {
    const inputPixel = perspT.transformInverse(x, y);
    const iidx = image.getPixelIndex(Math.round(inputPixel[0]), Math.round(inputPixel[1]), Jimp.EDGE_WRAP);

    if(x===(7.5*ppi) + border && y === (10*ppi) + border) console.log({output: [x, y], input: inputPixel});

    output.bitmap.data[idx + 0] = image.bitmap.data[iidx + 0];
    output.bitmap.data[idx + 1] = image.bitmap.data[iidx + 1];
    output.bitmap.data[idx + 2] = image.bitmap.data[iidx + 2];
    output.bitmap.data[idx + 3] = image.bitmap.data[iidx + 3];
  });
  console.log('done')

  postMessage(['display', output]);
  postMessage(['stage', 'done']);
}