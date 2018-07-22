import React, { Component } from 'react';

class Selector extends Component {
  render() {
    return (
      <div id='selector'>
        <h1>Test Index 1</h1>
        <input type="file" id="uploader_input" multiple accept="image/*" style={{display: 'none'}} onChange={(e)=>{this.props.handleSelect(e.target.files)}}/>
        <label htmlFor="uploader_input">Select some files</label>
      </div>
    );
  }
}

export default Selector;
