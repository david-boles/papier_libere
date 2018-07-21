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
  }else {
    postMessage(['error', 'qr', 'No QR code was detected!']);
  }
}

// console.log('updated');
    // var reader = new FileReader();
    // reader.onload = e => {
    //   Jimp.read(arrayBufferToBuffer(e.target.result)).then(image => {
        
    //     image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    //       var dist = colorDistance(162, 157, 153, image.bitmap.data[ idx + 0 ], image.bitmap.data[ idx + 1 ], image.bitmap.data[ idx + 3 ]);
    //       image.bitmap.data[ idx + 0 ] = dist;
    //       image.bitmap.data[ idx + 1 ] = dist;
    //       image.bitmap.data[ idx + 2 ] = dist;
    //       image.bitmap.data[ idx + 3 ] = 255;
      
    //       if(x === image.bitmap.width-1 && y === image.bitmap.height-1) {
    //         this.displayJIMPImage(image);
    //       }
    //     });

    //     // this.displayJIMPImage(image);

    //     // var code = jsQR(new Uint8ClampedArray(image.bitmap.data), image.bitmap.width, image.bitmap.height);
    //     // console.log(code);  

    //   }).catch(function (err) {
    //     console.error(err);
    //     //TODO
    //   });
    // };
    // reader.readAsArrayBuffer(this.props.file);

    // function colorDistance(r1, g1, b1, r2, g2, b2) {
    //   var r = (r1 + r2)/2;
    //   var deltaR = r1-r2;
    //   var deltaG = g1-g2;
    //   var deltaB = b1-b2;
    //   return Math.sqrt( (2*(deltaR*deltaR)) + (4*(deltaG*deltaG)) + (3*(deltaB*deltaB)) + ((r * ((deltaR*deltaR) - (deltaB*deltaB)))/256) )/3;
    //   // return Math.sqrt((deltaR*deltaR) + (deltaG*deltaG) + (deltaB*deltaB));
    // }