import React, { Component } from 'react';
import jsQR from "jsqr";

class Scanner extends Component {
  render() {
    return (
      <div>
        <h1>Test Version 0</h1>
        <canvas id='display'></canvas>
        <p id='output'/>
      </div>
    );
  }

  componentDidMount() {
    var video = document.createElement("video");
    var canvasElement = document.getElementById("display");
    var canvas = canvasElement.getContext("2d");
    var output = document.getElementById("output");

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.play();
      requestAnimationFrame(tick);
    });

    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height);
        if(code) {
          output.innerText = code.data;
        }else {
          output.innerText = "QR code not found!"
        }
      }
      requestAnimationFrame(tick);
    }
  }
}

export default Scanner;
