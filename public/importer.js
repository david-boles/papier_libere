importScripts('https://unpkg.com/jimp@0.2.27/browser/lib/jimp.min.js');
importScripts('/jsQR.js');
importScripts('https://unpkg.com/perspective-transform@^1.1.3/dist/perspective-transform.min.js');



const roughPerspPPI = 100;
const finalPerspPPI = 400
const config = {
  0: {//Standard paper - '0 PAPER_SIZE ORIENTATION QR_SIZE'
    finalDimensions: {
      LTR: {//Letter (8.5x11")
        P: {//Portrait
          width: 8.5*finalPerspPPI,
          height: 11*finalPerspPPI
        },
        L: {//Landscape
          width: 11*finalPerspPPI,
          height: 8.5*finalPerspPPI
        }
      }
    }
  },
  1: {//Notebook - '1 PAGE_NUMBER'
    roughQRDimension: 0.75*roughPerspPPI,
    cornerSeedOffsets: [//Offsets for points at which to start the corner detection process, measured from the top left of the qr code (up is -y).
      {x: 0.75*roughPerspPPI, y: -0.625*roughPerspPPI},
      {x: -0.25*roughPerspPPI, y: -0.625*roughPerspPPI},
      {x: 0.75*roughPerspPPI, y: -1.625*roughPerspPPI},
    ],
    finalDimensions: {
      width: 7.125*finalPerspPPI,
      height: 10*finalPerspPPI
    },
    finalCorners: {
      tl: {x: 0.125*finalPerspPPI, y: 0.125*finalPerspPPI},
      tr: {x: 7*finalPerspPPI, y: 0.125*finalPerspPPI},
      bl: {x: 0.125*finalPerspPPI, y: 9.875*finalPerspPPI},
      br: {x: 7*finalPerspPPI, y: 8.5*finalPerspPPI}
    }
  }
}



onmessage = (e) => {
  if(e.data.length === 1) {//Processing a raw image buffer for the first time
    Jimp.read(e.data[0], (err, srcImage) => {
      if(err) {
        postMessage(['progress', 'error', 'An error occured while importing the image!']);
        console.log(err)

      }else {
        postMessage(['source_bitmap', srcImage.bitmap]);
        postMessage(['progress', 10, 'Reading QR code...']);
        const qr = readQR(srcImage);
        if(qr) {
          postMessage(['qr_data', qr.data]);
          postMessage(['progress', 45, 'Detecting corners...']);
          const corners = detectCorners(srcImage, qr);
          postMessage(['corners', corners]);
          continueProcessing(srcImage, qr.data, corners);
        }else {
          postMessage(['progress', 'error', 'No QR code was found.']);
        }
      }
      close();
    });

  }else {//Reprocessing (presumably using different corners or because the qr was not found)
    try{
      console.log('Starting a re-process, presumably something was overriden');
      srcImage = new Jimp(e.data[0].width, e.data[0].height);
      srcImage.bitmap = e.data[0];
      continueProcessing(srcImage, e.data[1], e.data[2]);
      close();
    }catch(e) {
      console.log(e);
    }
  }
}



function continueProcessing(srcImage, qrData, corners) {
  postMessage(['progress', 55, 'Correcting for perspective...']);
  const corrected = correctForPerspective(srcImage, qrData, corners);
  postMessage(['done', corrected.bitmap]);
}



function readQR(image) {
  var qr = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height, {retrieveColors: true});

  if(qr) {
    return qr;

  }else {
    console.log("QR code not found, trying a resize...");
    const resized = image.clone().resize(image.bitmap.width/3.5, Jimp.AUTO);
    qr = jsQR(resized.bitmap.data, resized.bitmap.width, resized.bitmap.height, {retrieveColors: true});

    if(qr) {
      for(var key in qr.location) {
        qr.location[key].x *= 3.5;
        qr.location[key].y *= 3.5;
      }

      return qr;
    }
  }
}



function detectCorners(image, qr) {
  //Figure out how big the QR code should be for the rough transformation and where page corner detection should start
  const qrDataSplit = qr.data.split(' ');

  var roughQRDimension, cornerSeedOffsets;
  switch(Number(qrDataSplit[0])) {
    case 0: 
      roughQRDimension = (qrDataSplit[3]/100)*roughPerspPPI;
      cornerSeedOffsets = [
        {x: -roughQRDimension/6, y: -roughQRDimension/6},//top left
        {x: roughQRDimension/2, y: -roughQRDimension/6},//top mid
        {x: roughQRDimension+(roughQRDimension/6), y: -roughQRDimension/6},//top right
        {x: roughQRDimension+(roughQRDimension/6), y: roughQRDimension/2},//right mid
        {x: roughQRDimension+(roughQRDimension/6), y: roughQRDimension+(roughQRDimension/6)},//bottom right
        {x: roughQRDimension/2, y: roughQRDimension+(roughQRDimension/6)},//bottom mid
        {x: -roughQRDimension/6, y: roughQRDimension+(roughQRDimension/6)},//bottom left
        {x: -roughQRDimension/6, y: roughQRDimension/2},//left mid
      ];
      break;
    case 1:
      roughQRDimension = config[1].roughQRDimension;
      cornerSeedOffsets = config[1].cornerSeedOffsets;
      break;
    default:
      throw 'invalid page type for corners';
  }



  //Figure out what the size of the rough transformation image needs to be to fit all four corners of the source image
  const qrTrans = PerspT([qr.location.topLeftCorner.x, qr.location.topLeftCorner.y,
                                   qr.location.topRightCorner.x, qr.location.topRightCorner.y,
                                   qr.location.bottomLeftCorner.x, qr.location.bottomLeftCorner.y,
                                   qr.location.bottomRightCorner.x,qr.location.bottomRightCorner.y],
                                  [0, 0,
                                   roughQRDimension, 0,
                                   0, roughQRDimension,
                                   roughQRDimension, roughQRDimension]);

  var mostLeft = roughQRDimension;
  var mostRight = 0;
  var mostUp = roughQRDimension;
  var mostDown = 0;

  [[0, 0], [image.bitmap.width, 0], [0, image.bitmap.height], [image.bitmap.width, image.bitmap.height]].forEach(sourceCorner => {
    const srcInQR = qrTrans.transform(sourceCorner[0], sourceCorner[1]);
    if(srcInQR[0] < mostLeft) mostLeft = Math.floor(srcInQR[0]);
    if(srcInQR[0] > mostRight) mostRight = Math.ceil(srcInQR[0]);
    if(srcInQR[1] < mostUp) mostUp = Math.floor(srcInQR[1]);
    if(srcInQR[1] > mostDown) mostDown = Math.ceil(srcInQR[1]);
  });



  //Create rough perspective correction transform based on the QR code
  const roughTrans = PerspT([qr.location.topLeftCorner.x, qr.location.topLeftCorner.y,
                               qr.location.topRightCorner.x, qr.location.topRightCorner.y,
                               qr.location.bottomLeftCorner.x, qr.location.bottomLeftCorner.y,
                               qr.location.bottomRightCorner.x,qr.location.bottomRightCorner.y],
                              [0-mostLeft, 0-mostUp,
                               roughQRDimension-mostLeft, 0-mostUp,
                               0-mostLeft, roughQRDimension-mostUp,
                               roughQRDimension-mostLeft, roughQRDimension-mostUp]);


  
      
  //Create downsampled, rough perspective corrected image
  var roughTransImage = new Jimp(mostRight-mostLeft, mostDown-mostUp);
  roughTransImage.scan(0, 0, roughTransImage.bitmap.width, roughTransImage.bitmap.height, (x, y, idx) => {
    const inputPixel = roughTrans.transformInverse(x, y);
    const iidx = getJimpPixelIndex(inputPixel[0], inputPixel[1], image);

    roughTransImage.bitmap.data[idx + 0] = image.bitmap.data[iidx + 0];
    roughTransImage.bitmap.data[idx + 1] = image.bitmap.data[iidx + 1];
    roughTransImage.bitmap.data[idx + 2] = image.bitmap.data[iidx + 2];
    roughTransImage.bitmap.data[idx + 3] = image.bitmap.data[iidx + 3];
  });

  debugDisplay(roughTransImage);



  //Find the difference of the color of each pixel to the QR's background
  roughTransImage.scan(0, 0, roughTransImage.bitmap.width, roughTransImage.bitmap.height, (x, y, idx) => {
    const background = qr.colors.background
    const dist = colorDistance(roughTransImage.bitmap.data.slice(idx, idx+3), [background.r, background.g, background.b]);
    roughTransImage.bitmap.data[idx + 0] = dist;
    roughTransImage.bitmap.data[idx + 1] = 0;
    roughTransImage.bitmap.data[idx + 2] = 0;
    roughTransImage.bitmap.data[idx + 3] = 255;
  });

  debugDisplay(roughTransImage);


  
  //Starting from the corner detection seed points, flood fill the page, checking whether a point is a corner
  const queue = [];
  const tryQueuing = (x, y) => {
    const idx = getJimpPixelIndex(x, y, roughTransImage);
    if(roughTransImage.bitmap.data[idx] < 75 && !roughTransImage.bitmap.data[idx+1]) {
      roughTransImage.bitmap.data[idx+1] = 255;
      queue.push({x: x, y: y});
      return true;
    }
    return false;
  }
  cornerSeedOffsets.forEach(offset => {
    const x = Math.round(offset.x-mostLeft);
    const y = Math.round(offset.y-mostUp);
    if(tryQueuing(x, y)) {//This just helps with debugging
      roughTransImage.bitmap.data[getJimpPixelIndex(x, y, roughTransImage) + 2] = 255;
    }
  });

  var tl = {val: roughTransImage.bitmap.width + roughTransImage.bitmap.height, loc: {x: roughTransImage.bitmap.width, y: roughTransImage.bitmap.height}};//Minimize x+y
  var tr = {val: -roughTransImage.bitmap.height, loc: {x: 0, y: roughTransImage.bitmap.height}};//Maximize x-y
  var bl = {val: roughTransImage.bitmap.width, loc: {x: roughTransImage.bitmap.width, y: 0}};//Minimize x-y
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

  debugDisplay(roughTransImage);
  


  //Return corners
  const corners = {
    tl: tl.loc,
    tr: tr.loc,
    bl: bl.loc,
    br: br.loc
  }
  for(var key in corners) {
    var sourceLoc = roughTrans.transformInverse(corners[key].x, corners[key].y);
    corners[key] = {x: sourceLoc[0], y: sourceLoc[1]};
  }

  return corners;
}



function correctForPerspective(image, qrData, corners) {
  //Figure out how big the image should be for the final transformation and where page corners should go.
  const qrDataSplit = qrData.split(' ');

  var finalDimensions, finalCorners;
  switch(Number(qrDataSplit[0])) {
    case 0: 
      finalDimensions = config[0].finalDimensions[qrDataSplit[1]]['P'/* TODO qrDataSplit[2]*/];
      finalCorners = {
        tl: {x: 0, y: 0},
        tr: {x: finalDimensions.width-1, y: 0},
        bl: {x: 0, y: finalDimensions.height-1},
        br: {x: finalDimensions.width-1, y: finalDimensions.height-1},
      };
      break;
    case 1:
      finalDimensions = config[1].finalDimensions;
      finalCorners = config[1].finalCorners;
      break;
    default:
      throw 'invalid page type for final transformation';
  }



  //Generate the final perspective transformed image.
  const perspT = PerspT([corners.tl.x, corners.tl.y,
                         corners.tr.x, corners.tr.y,
                         corners.bl.x, corners.bl.y,
                         corners.br.x, corners.br.y],
                        [finalCorners.tl.x, finalCorners.tl.y,
                         finalCorners.tr.x, finalCorners.tr.y,
                         finalCorners.bl.x, finalCorners.bl.y,
                         finalCorners.br.x, finalCorners.br.y]);

  var output = new Jimp(finalDimensions.width, finalDimensions.height);

  output.scan(0, 0, output.bitmap.width, output.bitmap.height, (x, y, idx) => {
    const inputPixel = perspT.transformInverse(x, y);
    const iidx = getJimpPixelIndex(inputPixel[0], inputPixel[1], image);

    output.bitmap.data[idx + 0] = image.bitmap.data[iidx + 0];
    output.bitmap.data[idx + 1] = image.bitmap.data[iidx + 1];
    output.bitmap.data[idx + 2] = image.bitmap.data[iidx + 2];
    output.bitmap.data[idx + 3] = 255;
  }); 

  return output;
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

function debugDisplay(image) {
  if(false) {
    this.postMessage(['debug', image.bitmap]);
  }
}