import Slide from '@material-ui/core/Slide';
import React, { Component } from 'react';
import Importer from './Importer';

const slideTimeout = 250;

class Processor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: <Importer/>,
      next: null,
      currentSlideIn: true,
      nextSlideIn: false
    }
  }

  render() {//<div style={{position: 'absolute', top: 48, width: '100vw', height: 'calc(100vh - 48px)'}}>
    return (
      <React.Fragment>
        <Slide in={this.state.currentSlideIn} timeout={slideTimeout} direction='right' appear={false}>
          <div style={{position: 'absolute', top: 48, width: '100vw', height: 'calc(100vh - 48px)', overflowY: 'auto'}}>
            {this.state.current}
          </div>
        </Slide>
        <Slide in={this.state.nextSlideIn} timeout={slideTimeout} direction={'left'}>
          <div style={{position: 'absolute', top: 48, width: this.state.nextSlideIn ? '100vw' : 0, height: 'calc(100vh - 48px)', overflowY: 'auto'}}>
            {this.state.next}
          </div>
        </Slide>
      </React.Fragment>
    );
  }

  setView(component) {
    const wasTransitioning = !!this.state.next;
    this.setState({
      next: component,
      currentSlideIn: wasTransitioning ? this.state.currentSlideIn : false
    }, ()=>{
      if(!wasTransitioning) {
        console.log('wasn\'t transitioning')
        setTimeout(() => {
          this.setState({
            current: null,
            currentSlideIn: true,
            nextSlideIn: true
          }, () => {
            setTimeout(()=>{
              this.setState({
                current: this.state.next,
                next: null,
                nextSlideIn: false
              });
            }, slideTimeout);
          });
        }, slideTimeout);
      }
    });
  }
}

export default Processor;
