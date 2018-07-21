//Webworker that processes images
importScripts('https://unpkg.com/jimp@0.2.27/browser/lib/jimp.min.js');
importScripts('/jsQR.js');

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
    //qrStage(image);
    edgeStage(image);

  }).catch((e) => {
    postMessage(['error', 'read', e]);
  });
}



function qrStage(image) {
  postMessage(['stage', 'qr']);
  var qr = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height);
  if(qr) {
    postMessage(['qr', qr]);
  }else {
    postMessage(['error', 'qr', 'No QR code was detected!']);
  }
}



const edgeKernelDimension = 3;//Must be an odd number. Dimension (width and height) for sobelish edge detecting kernels.
const edgeKernelFlrHalfDim = Math.floor(edgeKernelDimension/2);//The "radius" (not really at all) of the kernel

//Sobelish kernel for the x direction using an averaging matrix of [1, 2, 4, 2, 1] and a gradient matrix of [-2, -1, 0, 1, 2] (then normalized to give values between -1 and 1 for inputs between 0 and 255).
const vertEdgeKernel = (()=>{
  const flrHalfDim = Math.floor(edgeKernelDimension/2);//The "radius" (not really at all) of the kernel

  const averagingKernel = [];
  for(var i = 0; i < edgeKernelDimension; i++) {
    if(i === 0) {
      averagingKernel.push(1);
    }else if(i <= flrHalfDim) {
      averagingKernel.push(averagingKernel[i-1]*2);
    }else {
      averagingKernel.push(averagingKernel[(2*flrHalfDim) - i]);
    }
  }//Should result in [1] or [1, 2, 1] or [1, 2, 4, 2, 1] etc...

  const diffKernel = [];
  for(var i = 0; i < edgeKernelDimension; i++) {
    diffKernel.push(i - flrHalfDim);
  }//Should result in [0] or [-1, 0, 1] or [-2, -1, 0, 1, 2] etc...

  const kernel = [];
  for(var r = 0; r < edgeKernelDimension; r++) {
    for(var c = 0; c < edgeKernelDimension; c++) {
      kernel.push(averagingKernel[r] * diffKernel[c]);
    }
  }//Should return [0] or [-1, 0, -1, -2, 0, 2, -1, 0, 1] etc...

  var maxOutput = 0;
  kernel.forEach(scalar => maxOutput += Math.abs(scalar * 255));
  maxOutput = maxOutput/2;

  return kernel.map(scalar => scalar / maxOutput);
})();

//Same but for y direction
const horizEdgeKernel = (()=>{
  var kernel = [];
  for(var i = 0; i < Math.pow(edgeKernelDimension, 2); i++) {
    row = Math.floor(i/edgeKernelDimension);
    col = i % edgeKernelDimension;
    kernel.push(vertEdgeKernel[(col*edgeKernelDimension) + (edgeKernelDimension-1-row)]);
  }
  return kernel;
})()

function colorDistance(c1, c2) {
  var r = (c1[0] + c2[0])/2;
  var deltaR = c1[0]-c2[0];
  var deltaG = c1[1]-c2[1];
  var deltaB = c1[2]-c2[2];
  return Math.sqrt( (2*(deltaR*deltaR)) + (4*(deltaG*deltaG)) + (3*(deltaB*deltaB)) + ((r * ((deltaR*deltaR) - (deltaB*deltaB)))/256) )/3;
  // return Math.sqrt((deltaR*deltaR) + (deltaG*deltaG) + (deltaB*deltaB));
}

function edgeStage(image) {
  postMessage(['stage', 'edge']);
  const grayscale = [];
  for(i = 0; i < image.bitmap.data.length; i+=4) {
    grayscale.push(colorDistance(image.bitmap.data.slice(i, i+3), [255, 255, 255]));
  }

  console.log('done grayscaling');

  const horizConvoluted = grayscale.map((value, index) => {
    const x = index % image.bitmap.width;
    const y = Math.floor(index / image.bitmap.width);

    var val = 0;
    for(var kX = 0; kX < edgeKernelDimension; kX++) {
      for(var kY = 0; kY < edgeKernelDimension; kY++) {
        val += horizEdgeKernel[(kY*edgeKernelDimension) + kX] * grayscale[(((y + (kY-edgeKernelFlrHalfDim)) % image.bitmap.height) * image.bitmap.width) + ((x + (kX-edgeKernelFlrHalfDim)) % image.bitmap.width)]
      }
    }
    return val;
  });

  console.log('convoluted horiz');

  const vertConvoluted = grayscale.map((value, index) => {
    const x = index % image.bitmap.width;
    const y = Math.floor(index / image.bitmap.width);

    var val = 0;
    for(var kX = 0; kX < edgeKernelDimension; kX++) {
      for(var kY = 0; kY < edgeKernelDimension; kY++) {
        val += vertEdgeKernel[(kY*edgeKernelDimension) + kX] * grayscale[(((y + (kY-edgeKernelFlrHalfDim)) % image.bitmap.height) * image.bitmap.width) + ((x + (kX-edgeKernelFlrHalfDim)) % image.bitmap.width)]
      }
    }
    return val;
  });

  console.log('done convoluting');

  new Jimp(image.bitmap.width, image.bitmap.height, (err, outImage) => {//will need to use different dimensions
    outImage.scan(0, 0, outImage.bitmap.width, outImage.bitmap.height, (x, y, idx) => {
      var val = Math.sqrt(Math.pow(horizConvoluted[idx/4], 2) + Math.pow(vertConvoluted[idx/4], 2)) * 255;
      // var val = (vertConvoluted[idx/4] + 1) * 127.5;

      if(x === 0 && y % 100 === 0) console.log(val);

      outImage.bitmap.data[idx + 0] = val;
      outImage.bitmap.data[idx + 1] = val;
      outImage.bitmap.data[idx + 2] = val;
      outImage.bitmap.data[idx + 3] = 255;

      if(x === outImage.bitmap.width-1 && y === outImage.bitmap.height-1) {
        postMessage(['display', outImage]);
        postMessage(['stage', 'done']);
      }
    });

  });
}