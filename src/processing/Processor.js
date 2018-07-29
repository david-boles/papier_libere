import Slide from '@material-ui/core/Slide';
import React, { Component } from 'react';
import Importer from './Importer';

const slideTimeout = 250;

class Processor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: <Importer/>,
      direction: 'right',
      in: true
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* It seems dumb to do it this way but I had to to trick react into making separate Slides so that the directions actually worked. */
          this.state.direction === 'left'?
            <Slide in={this.state.in} timeout={slideTimeout} direction='left' appear={true}>
              {this.state.view}
            </Slide>
          :
            null
        }
        {
          this.state.direction === 'right'?
            <Slide in={this.state.in} timeout={slideTimeout} direction='right' appear={false}>
              {this.state.view}
            </Slide>
          :
            null
        }
      </React.Fragment>
    );
  }

  setView(component) {
    this.setState({
      in: false
    }, ()=>{
      setTimeout(() => {
        this.setState({
          view: component,
          direction: 'left',
          in: true
        }, () => {
          setTimeout(() => {
            this.setState({
              direction: 'right'
            });
          }, slideTimeout);
        });
      }, slideTimeout);
    });
  }
}

export default Processor;
