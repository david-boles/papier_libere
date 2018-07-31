import Slide from '@material-ui/core/Slide';
import React, { Component } from 'react';
import Importer from './Importer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const slideTimeout = 250;

class Overrider extends Component {
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
      // <React.Fragment>
      //   {/* It seems dumb to do it this way but I had to to trick react into making separate Slides so that the directions actually worked. */
      //     this.state.direction === 'left'?
      //       <Slide in={this.state.in} timeout={slideTimeout} direction='left' appear={true}>
      //         {this.state.view}
      //       </Slide>
      //     :
      //       null
      //   }
      //   {
      //     this.state.direction === 'right'?
      //       <Slide in={this.state.in} timeout={slideTimeout} direction='right' appear={false}>
      //         {this.state.view}
      //       </Slide>
      //     :
      //       null
      //   }
      // </React.Fragment>
      
      // <Grid container>
      //   <IconButton color="inherit" onClick={()=>{this.props.onClose()}} aria-label="Close">
      //     <CloseIcon />
      //   </IconButton>
      //   {this.props.import.name}
      // </Grid>
      <div style={{display: 'flex', height: '100%'}}>
        <div style={{width: 48+(12*2), paddingLeft: 12, paddingRight: 12}}>
          <IconButton color="inherit" onClick={()=>{this.props.onClose()}} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <IconButton disabled={true} style={{marginTop: 'calc(50vh - 72px)'}} aria-label="Back">
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <div style={{flexGrow: 1}}>
          Stuff!
        </div>
        <div style={{width: 48+(12*2), paddingLeft: 12, paddingRight: 12}}>
          <IconButton style={{marginTop: 'calc(50vh - 24px)'}} aria-label="Back">
            <ChevronRightIcon />
          </IconButton>
        </div>
      </div>
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

export default Overrider;
