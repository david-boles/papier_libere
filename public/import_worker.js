importScripts('https://unpkg.com/jimp@0.2.27/browser/lib/jimp.min.js');
importScripts('/lib/jsQR.js');
importScripts('https://unpkg.com/perspective-transform@^1.1.3/dist/perspective-transform.min.js');
importScripts('https://unpkg.com/bicubic-interpolate@^1.0.0/dist/min.js');
importScripts('/lib/qr-image.js');

const roughPerspPPI = 50;
const finalPerspPPI = 200;
const whiteBalRegionsPI = 2;
const whiteBalSamplesPI = 20;
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
    },
    whiteBalRegions: {
      LTR: {
        P: {
          x: Math.ceil(8.5*whiteBalRegionsPI),
          y: Math.ceil(11*whiteBalRegionsPI)
        },
        L: {
          x: Math.ceil(11*whiteBalRegionsPI),
          y: Math.ceil(8.5*whiteBalRegionsPI)
        }
      }
    },
    whiteBalScaleFactor: whiteBalSamplesPI/finalPerspPPI,
    qrOverlayRegion: {
      LTR: {
        P: {
          x: 7.25*finalPerspPPI,
          y: 9.75*finalPerspPPI,
          length: 1.25*finalPerspPPI,
          qrOffsetX: 0.25*finalPerspPPI,
          qrOffsetY: 0.25*finalPerspPPI,
          qrLength: 0.75*finalPerspPPI
        },
        L: {
          x: 9.75*finalPerspPPI,
          y: 7.25*finalPerspPPI,
          length: 1.25*finalPerspPPI,
          qrOffsetX: 0.25*finalPerspPPI,
          qrOffsetY: 0.25*finalPerspPPI,
          qrLength: 0.75*finalPerspPPI
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
      {x: 0.875*roughPerspPPI, y: 0.375*roughPerspPPI},
      {x: 0.875*roughPerspPPI, y: 0.875*roughPerspPPI}
    ],
    finalDimensions: {
      width: 7.125*finalPerspPPI,
      height: 10*finalPerspPPI
    },
    finalCorners: {
      tl: {x: 0.125*finalPerspPPI, y: 0.125*finalPerspPPI},
      tr: {x: 7*finalPerspPPI, y: 0.125*finalPerspPPI},
      bl: {x: 0.125*finalPerspPPI, y: 9.875*finalPerspPPI},
      br: {x: 7*finalPerspPPI, y: 9.875*finalPerspPPI}
    },
    whiteBalRegions: {
      x: Math.ceil(7.125*whiteBalRegionsPI),
      y: Math.ceil(10*whiteBalRegionsPI)
    },
    whiteBalScaleFactor: whiteBalSamplesPI/finalPerspPPI,
    actions: {
      first: {x: 3.458*finalPerspPPI, y: 8.833*finalPerspPPI},//Offset for the center of the top left icon in a grid, measured from the top left of the QR code (up is -y)
      radius: 0.1565*finalPerspPPI,
      gridWidth: 6,
      gridHeight: 3,
      spacing: 0.417*finalPerspPPI
    },
    qrOverlayRegion: {
      x: 5.75*finalPerspPPI,
      y: 8.625*finalPerspPPI,
      length: 1.25*finalPerspPPI,
      qrOffsetX: 0.25*finalPerspPPI,
      qrOffsetY: 0.25*finalPerspPPI,
      qrLength: 0.75*finalPerspPPI
    }
  },
  2: {//Uncropped notebook - '2 PAGE_NUMBER'
    roughQRDimension: 0.75*roughPerspPPI,
    cornerSeedOffsets: [//Offsets for points at which to start the corner detection process, measured from the top left of the qr code (up is -y).
      {x: 0.75*roughPerspPPI, y: -0.625*roughPerspPPI},
      {x: -0.25*roughPerspPPI, y: -0.625*roughPerspPPI},
      {x: 0.75*roughPerspPPI, y: -1.625*roughPerspPPI},
      {x: 0.875*roughPerspPPI, y: 0.375*roughPerspPPI},
      {x: 0.875*roughPerspPPI, y: 0.875*roughPerspPPI}
    ],
    finalDimensions: {
      width: 8.375*finalPerspPPI,
      height: 11*finalPerspPPI
    },
    finalCorners: {
      tl: {x: 0.375*finalPerspPPI, y: 0.375*finalPerspPPI},
      tr: {x: 8*finalPerspPPI, y: 0.375*finalPerspPPI},
      bl: {x: 0.375*finalPerspPPI, y: 10.625*finalPerspPPI},
      br: {x: 8*finalPerspPPI, y: 10.625*finalPerspPPI}
    },
    whiteBalRegions: {
      x: Math.ceil(8.375*whiteBalRegionsPI),
      y: Math.ceil(11*whiteBalRegionsPI)
    },
    whiteBalScaleFactor: whiteBalSamplesPI/finalPerspPPI,
    actions: {
      first: {x: 4.4585*finalPerspPPI, y: 9.5835*finalPerspPPI},//Offset for the center of the top left icon in a grid, measured from the top left of the QR code (up is -y)
      radius: 0.1565*finalPerspPPI,
      gridWidth: 6,
      gridHeight: 3,
      spacing: 0.417*finalPerspPPI
    },
    qrOverlayRegion: {
      x: 6.75*finalPerspPPI,
      y: 9.375*finalPerspPPI,
      length: 1.25*finalPerspPPI,
      qrOffsetX: 0.25*finalPerspPPI,
      qrOffsetY: 0.25*finalPerspPPI,
      qrLength: 0.75*finalPerspPPI
    }
  }
}



onmessage = (e) => {
  if(e.data.length === 3) {//Processing a raw image buffer for the first time
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
          continueProcessing(srcImage, qr.data, corners, e.data[1], e.data[2]);
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
      continueProcessing(srcImage, e.data[1], e.data[2], e.data[3], e.data[4]);
      close();
    }catch(e) {
      console.log(e);
    }
  }
}



function continueProcessing(srcImage, qrData, corners, notebookOverlay, notebookOverlayUncropped) {
  postMessage(['progress', 55, 'Correcting for perspective...']);
  var image = correctForPerspective(srcImage, qrData, corners);
  debugDisplay(image);

  postMessage(['progress', 65, 'Correcting white balance...']);
  image = correctWhiteBalance(image, qrData);

  if(qrData.indexOf('1 ') === 0 || qrData.indexOf('2 ') === 0) {
    postMessage(['progress', 90, 'Detecting actions...']);
    postMessage(['actions', detectActions(image, qrData)]);
  }

  postMessage(['progress', 95, 'Applying overlays...']);
  image = applyOverlays(image, qrData, notebookOverlay, notebookOverlayUncropped);

  postMessage(['done', image.bitmap]);
}



function readQR(image) {
  const resized = image.clone().resize(image.bitmap.width/3.5, Jimp.AUTO);
  const qr = jsQR(resized.bitmap.data, resized.bitmap.width, resized.bitmap.height, {retrieveColors: true});

  if(qr) {
    for(var key in qr.location) {
      qr.location[key].x *= 3.5;
      qr.location[key].y *= 3.5;
    }
    return qr;

  }else {
    console.log('not found with resized, trying original');
    return jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height, {retrieveColors: true});
  }
}



function detectCorners(image, qr) {
  //Figure out how big the QR code should be for the rough transformation and where page corner detection should start
  const qrDataSplit = qr.data.split(' ');
  const type = Number(qrDataSplit[0]);

  var roughQRDimension, cornerSeedOffsets;
  switch(type) {
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
    case 2:
      roughQRDimension = config[type].roughQRDimension;
      cornerSeedOffsets = config[type].cornerSeedOffsets;
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
  const tryQueuing = (x, y, comparisonVal, force=false) => {
    const idx = getJimpPixelIndex(x, y, roughTransImage);
    if(force || (Math.abs(roughTransImage.bitmap.data[idx]-comparisonVal) < 5 && !roughTransImage.bitmap.data[idx+1])) {
      roughTransImage.bitmap.data[idx+1] = 255;
      queue.push({x: x, y: y});
      return true;
    }
    return false;
  }
  cornerSeedOffsets.forEach(offset => {
    const x = Math.round(offset.x-mostLeft);
    const y = Math.round(offset.y-mostUp);
    if(tryQueuing(x, y, 0, true)) {//This just helps with debugging
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
    const val = roughTransImage.bitmap.data[getJimpPixelIndex(loc.x, loc.y, roughTransImage)];
    tryQueuing(loc.x+1, loc.y, val);
    tryQueuing(loc.x-1, loc.y, val);
    tryQueuing(loc.x, loc.y+1, val);
    tryQueuing(loc.x, loc.y-1, val);
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
  const type = Number(qrDataSplit[0]);

  var finalDimensions, finalCorners;
  switch(type) {
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
    case 2:
      finalDimensions = config[type].finalDimensions;
      finalCorners = config[type].finalCorners;
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



function correctWhiteBalance(image, qrData) {
  //Find the number of regions in the x and y direcitons based on the type of scan
  const qrDataSplit = qrData.split(' ');
  const type = Number(qrDataSplit[0]);

  var numRegions, scaleFactor;
  switch(type) {
    case 0: 
      numRegions = config[0].whiteBalRegions[qrDataSplit[1]]['P'/* TODO qrDataSplit[2]*/];
      scaleFactor = config[0].whiteBalScaleFactor;
      break;
    case 1:
    case 2:
      numRegions = config[type].whiteBalRegions;
      scaleFactor = config[type].whiteBalScaleFactor;
      break;
    default:
      throw 'invalid page type for white balance';
  }

  const resized = image.clone().resize(image.bitmap.width*scaleFactor, Jimp.AUTO);
  debugDisplay(resized);

  //Find the size of the regions
  const fullRegionSize = {
    width: image.bitmap.width/numRegions.x,
    height: image.bitmap.height/numRegions.y
  }
  const resizedRegionSize = {
    width: resized.bitmap.width/numRegions.x,
    height: resized.bitmap.height/numRegions.y
  }

  //Populate a 2D array for the whitest pixels in each region
  const whitestPixels = [];
  for(var regCol = 0; regCol < numRegions.x; regCol++) {
    whitestPixels.push([]);
    for(var regRow = 0; regRow < numRegions.y; regRow++) {
      whitestPixels[regCol].push({
        whiteDist: 256,
        color: [-1, -1, -1],
        x: -1,
        y: -1
      });
    }
  }

  // //Sample pixels in the resized image, remembering the whitest ones in each region
  resized.scan(0, 0, resized.bitmap.width, resized.bitmap.height, (x, y, idx) => {
    const regCol = Math.floor(x/resizedRegionSize.width);
    const regRow = Math.floor(y/resizedRegionSize.height);
    const color = [resized.bitmap.data[idx], resized.bitmap.data[idx+1], resized.bitmap.data[idx+2]];
    const whiteDist = colorDistance([255, 255, 255], color);
    if(whiteDist < whitestPixels[regCol][regRow].whiteDist) {
      whitestPixels[regCol][regRow] = {
        whiteDist: whiteDist,
        color: color,
        x: x,
        y: y
      }
    }
  });

  //Define a function to correct for white balance
  const regionWhites = whitestPixels.map(col => col.map(pix => pix.color));
  const interpolator = bicubic.createMultiGridInterpolator(regionWhites, {
    extrapolate: true,
    scaleX: 1 / fullRegionSize.width,
    scaleY: 1 / fullRegionSize.height,
    translateX: -0.5,
    translateY: -0.5
  });
  const whiteBal = (x, y, color) => {
    const whiteColor = interpolator(x, y);
    return color.map((val, index) => {
      return clamp(val * (255/(whiteColor[index])), 0, 255);
    });
  };

  //Correct for white balance on all the pixels
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const color = [image.bitmap.data[idx], image.bitmap.data[idx+1], image.bitmap.data[idx+2]];
    const corrected = whiteBal(x, y, color);
    image.bitmap.data[idx+0] = corrected[0];
    image.bitmap.data[idx+1] = corrected[1];
    image.bitmap.data[idx+2] = corrected[2];
  });

  return image;
}



function detectActions(image, qrData) {
  //Find the locations and size of the icons
  const qrDataSplit = qrData.split(' ');
  const type = Number(qrDataSplit[0]);
  
  var gridConfig;
  switch(type) {
    case 1:
    case 2:
      gridConfig = config[type].actions;
      break;
    default:
      throw 'invalid page type for detecting actions';
  }

  const output = [];

  for(var iX = 0; iX < gridConfig.gridWidth; iX++) {
    for(var iY = 0; iY < gridConfig.gridHeight; iY++) {
      const center = Object.assign({}, gridConfig.first);
      center.x += iX * gridConfig.spacing;
      center.y += iY * gridConfig.spacing;

      var pxCounter = 0;
      var distSum = 0;

      for(var x = center.x-gridConfig.radius; x < center.x+gridConfig.radius; x++) {
        var yLimit = Math.sqrt((gridConfig.radius*gridConfig.radius)-((x-center.x)*(x-center.x)));

        for(var y = center.y-yLimit; y < center.y+yLimit; y++) {
          const idx = getJimpPixelIndex(x, y, image);
          distSum += colorDistance(image.bitmap.data.slice(idx, idx+3), [255, 255, 255]);
          pxCounter++;
        }
      }

      if(distSum/pxCounter > 25) output.push(true);
      else output.push(false);
    }
  }

  return output;
}



function applyOverlays(image, qrData, notebookOverlay, notebookOverlayUncropped) {
  //Apply the icon and edge overlay for notebooks
  function applyOverlay(overlay) {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
      if(overlay.data[idx+3]) {
        image.bitmap.data[idx] = overlay.data[idx];
        image.bitmap.data[idx+1] = overlay.data[idx+1];
        image.bitmap.data[idx+2] = overlay.data[idx+2];
      }
    });
  }

  if(qrData.indexOf('1 ') === 0) applyOverlay(notebookOverlay);
  if(qrData.indexOf('2 ') === 0) applyOverlay(notebookOverlayUncropped);

  //Figure out position and size of the qr region and the qr itself
  const qrDataSplit = qrData.split(' ');
  const type = Number(qrDataSplit[0]);

  var qrRegion;
  switch(type) {
    case 0: 
      qrRegion = config[0].qrOverlayRegion[qrDataSplit[1]]['P'/* TODO qrDataSplit[2]*/];//TODO calculate based on QR size
      break;
    case 1:
    case 2:
      qrRegion = config[type].qrOverlayRegion;
      break;
    default:
      throw 'invalid page type for overlays';
  }

  const qrMatrix = qr.matrix(qrData, 'H');
  console.log(qr.matrix);

  for(var x = qrRegion.x; x < qrRegion.x + qrRegion.length; x++) {
    for(var y = qrRegion.y; y < qrRegion.y + qrRegion.length; y++) {
      const idx = getJimpPixelIndex(x, y, image);

      if(x < qrRegion.x + qrRegion.qrOffsetX || y < qrRegion.y + qrRegion.qrOffsetX || x > qrRegion.x + qrRegion.qrOffsetX + qrRegion.qrLength || y > qrRegion.y + qrRegion.qrOffsetX + qrRegion.qrLength) {
        image.bitmap.data[idx] = 255;
        image.bitmap.data[idx+1] = 255;
        image.bitmap.data[idx+2] = 255;
      }else {
        const qrX = clamp(Math.floor((x - qrRegion.x - qrRegion.qrOffsetX)*(qrMatrix.length/qrRegion.qrLength)), 0, qrMatrix.length-1);
        const qrY = clamp(Math.floor((y - qrRegion.y - qrRegion.qrOffsetY)*(qrMatrix.length/qrRegion.qrLength)), 0, qrMatrix.length-1);

        if(qrMatrix[qrY][qrX]) {
          image.bitmap.data[idx] = 0;
          image.bitmap.data[idx+1] = 0;
          image.bitmap.data[idx+2] = 0;
        }else {
          image.bitmap.data[idx] = 255;
          image.bitmap.data[idx+1] = 255;
          image.bitmap.data[idx+2] = 255;
        }
      }
    }
  }

  return image;
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