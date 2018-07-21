import React, { Component } from 'react';
import Jimp from 'jimp';
import arrayBufferToBuffer from 'arraybuffer-to-buffer';
import jsQR from 'jsqr';

class Processor extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      stage: 'read',//then 'qr'
      message: 'Importing image...'
    };

    this.processorWorker = new Worker('processor.js');
    this.processorWorker.onmessage = (e) => {
      switch (e.data[0]) {
        case 'stage':
          this.setState({stage: e.data[1]});
          if(e.data[1] === 'qr') {
            this.setMessage('Reading QR code...');
          }
          break;
        case 'error':
          console.error(e.data[1], e.data[2]);
          this.setMessage(`An error occured! Stage: ${e.data[1]} - Message: ${e.data[2]}`);
          break;
        case 'display':
          this.displayJIMPImage(e.data[1]);
          break;
        case 'qr':
          this.setMessage(`QR code found: ${e.data[1].data} @ ${JSON.stringify(e.data[1].location.topRightCorner)}`);
        default:
          console.error(e.data);
          //TODO?
      }
    }
  }

  render() {
    return (
      <div id='processor'>
        <h1>Processing {this.props.file.name}... {this.state.stage}</h1>
        {this.state.message? <h2>{this.state.message}</h2> : null}
        <canvas id='display' width={100} height={100} style={{maxWidth: '100%', maxHeight: '75vh', width: 'auto', height: 'auto'}}/>

      </div>
    );
  }

  componentDidMount() {
    //Read file and send buffer to service worker
    var reader = new FileReader();
    reader.onload = e => {
      this.processorWorker.postMessage(['start', e.target.result]);
    }
    reader.readAsArrayBuffer(this.props.file);
  }

  displayJIMPImage(image) {
    var canvas = document.getElementById('display');
    canvas.width = image.bitmap.width;
    canvas.height = image.bitmap.height;
    canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(image.bitmap.data), image.bitmap.width, image.bitmap.height), 0, 0);
  }

  setMessage(message) {
    this.setState({message: message});
  }
}

export default Processor;
