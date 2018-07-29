importScripts('https://unpkg.com/jimp@0.2.27/browser/lib/jimp.min.js');
importScripts('/jsQR.js');
importScripts('https://unpkg.com/perspective-transform@^1.1.3/dist/perspective-transform.min.js');

onmessage = (e) => {
  if(e.data.length === 1) {//Processing a raw image buffer for the first time
    Jimp.read(e.data[0], (err, srcImage) => {
      if(err) {
        postMessage(['progress', 'error', 'An error occured while loading the image!']);
        console.log(err)

      }else {
        postMessage(['source_bitmap', srcImage.bitmap]);
        postMessage(['progress', 10, 'Reading QR code...']);
        const qr = readQR(srcImage);
        if(qr) {
          postMessage(['progress', 35, 'Detecting corners...']);
          //TODO
        }else {
          postMessage(['progress', 'error', 'No QR code was found.']);
        }
      }
    });

  }else {//Reprocessing (presumably using different corners or because the qr was not found)
    srcImage = new Jimp(e.data[0].width, e.data[0].height);
    srcImage.bitmap = e.data[0];
    continueProcessing(srcImage, e.data[1], e.data[2]);
  }
}

function continueProcessing(srcImage, qrInfo, corners) {

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