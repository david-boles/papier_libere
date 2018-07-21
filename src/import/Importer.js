import React, { Component } from 'react';
import Selector from './Selector';
import Processor from './Processor';

class Importer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stage: 'select'//then 'process'
    }
  }

  render() {
    if(this.state.stage === 'select') return <Selector handleSelect={files=>{
      this.setState({
        stage: 'process',
        selected: files,
        processingIndex: 0
      });
    }}/>;

    else if(this.state.stage === 'process') return <Processor file={this.state.selected[this.state.processingIndex]}/>;

    else return 'An error occured, please refresh or report the bug if it persists.'
  }
}

export default Importer;
