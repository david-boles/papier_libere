import React, { Component } from 'react';
import jsQR from "jsqr";
import * as fx from 'glfx-es6'

class Scanner extends Component {
  render() {
    return (
      <div>
        <h1>Test Version 4</h1>
        <p id='output'/>
        <div id='display_container'/>
      </div>
    );
  }

  componentDidMount() {
    var video = document.createElement("video");
    var output = document.getElementById("output");
    var displayContainer = document.getElementById("display_container");

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.play();
      requestAnimationFrame(tick);
    });

    var canvas = fx.canvas();//TODO will error if no webgl
    displayContainer.appendChild(canvas);
    var texture;

    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        if(!texture) {
          texture = canvas.texture(video);
        }else {
          texture.loadContentsOf(video);
        }

        canvas.draw(texture);

        //Do modifications
        canvas.denoise(40);

        var code = jsQR(canvas.getPixelArray(), canvas.width, canvas.height);
        if(code) {
          output.innerText = code.data;
        }else {
          output.innerText = "QR code not found!"
        }

        canvas.update();
        // console.log(Object.keys(canvas));

      }
      requestAnimationFrame(tick);
    }

  }

}

export default Scanner;
