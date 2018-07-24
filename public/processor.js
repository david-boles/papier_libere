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
    try {
      postMessage(['display', image]);
      qrStage(image);

    }catch(e) {
      postMessage(['error', 'root', e]);
    }
  }).catch((e) => {
    postMessage(['error', 'read', e]);
  });
}



function qrStage(image) {
  postMessage(['stage', 'qr']);
  var qr = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height, {retrieveColors: true});

  if(qr) {
    postMessage(['qr', qr]);
    qrPerspectiveStage(image, qr);

  }else {
    console.log("QR code not found, trying a resize...");
    const resized = image.clone().resize(image.bitmap.width/3.5, Jimp.AUTO);
    qr = jsQR(resized.bitmap.data, resized.bitmap.width, resized.bitmap.height, {retrieveColors: true});

    if(qr) {
      for(var key in qr.location) {
        qr.location[key].x *= 3.5;
        qr.location[key].y *= 3.5;
      }

      postMessage(['qr', qr]);
      qrPerspectiveStage(image, qr);

    }else {
      postMessage(['error', 'qr', 'No QR code was detected!']);
    }
  }
}



const qrPerpPPI = 50;
const qrPerspBorder = 250;

function qrPerspectiveStage(image, qr) {
  postMessage(['stage', 'qr_perspective']);
  const perspT = PerspT([qr.location.topLeftCorner.x, qr.location.topLeftCorner.y,
                         qr.location.topRightCorner.x, qr.location.topRightCorner.y,
                         qr.location.bottomLeftCorner.x, qr.location.bottomLeftCorner.y,
                         qr.location.bottomRightCorner.x,qr.location.bottomRightCorner.y],
                        [(7.5*qrPerpPPI) + qrPerspBorder, (10*qrPerpPPI) + qrPerspBorder,
                         (8.25*qrPerpPPI) + qrPerspBorder, (10*qrPerpPPI) + qrPerspBorder,
                         (7.5*qrPerpPPI) + qrPerspBorder, (10.75 * qrPerpPPI) + qrPerspBorder,
                         (8.25*qrPerpPPI) + qrPerspBorder, (10.75 * qrPerpPPI) + qrPerspBorder]);

  var output = new Jimp((8.5 * qrPerpPPI) + (qrPerspBorder * 2), (11 * qrPerpPPI) + (qrPerspBorder * 2));

  output.scan(0, 0, output.bitmap.width, output.bitmap.height, (x, y, idx) => {
    const inputPixel = perspT.transformInverse(x, y);
    const iidx = getJimpPixelIndex(inputPixel[0], inputPixel[1], image);

    output.bitmap.data[idx + 0] = image.bitmap.data[iidx + 0];
    output.bitmap.data[idx + 1] = image.bitmap.data[iidx + 1];
    output.bitmap.data[idx + 2] = image.bitmap.data[iidx + 2];
    output.bitmap.data[idx + 3] = image.bitmap.data[iidx + 3];
  }); 

  postMessage(['display', output]);
  cornersStage(image, qr, perspT, output);
}



function cornersStage(image, qr, imgToQRTrans, qrPerspImage) {
  postMessage(['stage', 'corners']);

  var cornersImage = qrPerspImage.clone();
  cornersImage.scan(0, 0, cornersImage.bitmap.width, cornersImage.bitmap.height, (x, y, idx) => {
    const background = qr.colors.background
    const dist = colorDistance(cornersImage.bitmap.data.slice(idx, idx+3), [background.r, background.g, background.b]);
    cornersImage.bitmap.data[idx + 0] = dist;
    cornersImage.bitmap.data[idx + 1] = 0;
    cornersImage.bitmap.data[idx + 2] = 0;
    cornersImage.bitmap.data[idx + 3] = 255;
  });

  postMessage(['display', cornersImage]);
  
  const queue = [];
  const tryQueuing = (x, y) => {
    const idx = getJimpPixelIndex(x, y, cornersImage);
    if(cornersImage.bitmap.data[idx] < 75 && !cornersImage.bitmap.data[idx+1]) {
      cornersImage.bitmap.data[idx+1] = 255;
      queue.push({x: x, y: y});
    }
  }
  tryQueuing(Math.round((8.375*qrPerpPPI) + qrPerspBorder), Math.round((10.875 * qrPerpPPI) + qrPerspBorder));

  var tl = {val: cornersImage.bitmap.width + cornersImage.bitmap.height, loc: {x: cornersImage.bitmap.width, y: cornersImage.bitmap.height}};//Minimize x+y
  var tr = {val: -cornersImage.bitmap.height, loc: {x: 0, y: cornersImage.bitmap.height}};//Maximize x-y
  var bl = {val: cornersImage.bitmap.width, loc: {x: cornersImage.bitmap.width, y: 0}};//Minimize x-y
  var br = {val: 0, loc: {x:0, y:0}};//Maximize x+y

  const updateMaxima = loc => {
    pVal = loc.x + loc.y;
    mVal = loc.x - loc.y;
    if(pVal < tl.val) tl = {val: pVal, loc: loc};
    if(mVal > tr.val) tr = {val: mVal, loc: loc};
    if(mVal < bl.val) bl = {val: mVal, loc: loc};
    if(pVal > br.val) br = {val: pVal, loc: loc};
  }

  while(queue.length != 0) {
    var loc = queue.shift();
    updateMaxima(loc);
    tryQueuing(loc.x+1, loc.y);
    tryQueuing(loc.x-1, loc.y);
    tryQueuing(loc.x, loc.y+1);
    tryQueuing(loc.x, loc.y-1);
  }

  const corners = {
    tl: tl.loc,
    tr: tr.loc,
    bl: bl.loc,
    br: br.loc
  }
  for(var key in corners) {
    var sourceLoc = imgToQRTrans.transformInverse(corners[key].x, corners[key].y);
    corners[key] = {x: sourceLoc[0], y: sourceLoc[1]};
  }

  postMessage(['display', cornersImage]);
  finalPerspectiveStage(image, qr, corners)
}



const finalPerspPPI = 400;

function finalPerspectiveStage(image, qr, corners) {
  postMessage(['stage', 'final_perspective']);

  const redBal = 200 / qr.colors.background.r;
  const greenBal = 200 / qr.colors.background.g;//TODO maybe find brightest pixel on scaled down version?
  const blueBal = 200 / qr.colors.background.b;

  const perspT = PerspT([corners.tl.x, corners.tl.y,
                         corners.tr.x, corners.tr.y,
                         corners.bl.x, corners.bl.y,
                         corners.br.x, corners.br.y],
                        [0, 0,
                         8.5*finalPerspPPI, 0,
                         0, 11*finalPerspPPI,
                         8.5*finalPerspPPI, 11*finalPerspPPI]);

  var output = new Jimp((8.5 * finalPerspPPI), (11 * finalPerspPPI));

  output.scan(0, 0, output.bitmap.width, output.bitmap.height, (x, y, idx) => {
    const inputPixel = perspT.transformInverse(x, y);
    const iidx = getJimpPixelIndex(inputPixel[0], inputPixel[1], image);

    output.bitmap.data[idx + 0] = clamp(image.bitmap.data[iidx + 0] * redBal, 0, 255);
    output.bitmap.data[idx + 1] = clamp(image.bitmap.data[iidx + 1] * greenBal, 0, 255);
    output.bitmap.data[idx + 2] = clamp(image.bitmap.data[iidx + 2] * blueBal, 0, 255);
    output.bitmap.data[idx + 3] = 255;
  }); 

  postMessage(['stage', 'done', output]);
}



//UTILS
function colorDistance(c1, c2) {
  var r = (c1[0] + c2[0])/2;
  var deltaR = c1[0]-c2[0];
  var deltaG = c1[1]-c2[1];
  var deltaB = c1[2]-c2[2];
  return Math.sqrt( (2*(deltaR*deltaR)) + (4*(deltaG*deltaG)) + (3*(deltaB*deltaB)) + ((r * ((deltaR*deltaR) - (deltaB*deltaB)))/256) )/3;
  // return Math.sqrt((deltaR*deltaR) + (deltaG*deltaG) + (deltaB*deltaB));
}

function clamp(val, lower, upper) {
  if(val < lower) return lower;
  else if(val > upper) return upper;
  else return val;
}

function getPixelIndex(x, y, width, height, elmtsPerPix = 4, clampXY = true) {
  x = Math.round(x);
  y = Math.round(y);
  if(clampXY) {
    x = clamp(x, 0, width);
    y = clamp(y, 0, height);
  }
  x = x % width;
  y = y % height;
  return ((y * width) + x) * elmtsPerPix;
}

function getJimpPixelIndex(x, y, image, clampXY = true) {
  return getPixelIndex(x, y, image.bitmap.width, image.bitmap.height, 4, clampXY);
}