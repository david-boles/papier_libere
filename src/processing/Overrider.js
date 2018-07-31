import Slide from '@material-ui/core/Slide';
import React, { Component } from 'react';
import Importer from './Importer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Fade from '@material-ui/core/Fade';

const transitionTimeout = 250;

class Overrider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 'qr',
      slideTransitioningOut: false,
      fadeTransitioningOut: false,
      firstStage: true,
      corners: {}
    };
    if(props.import.qrData) {
      this.state.qrData = props.import.qrData;
      this.state.stage = 'tl';
    }
    if(props.import.corners) this.state.corners = props.import.corners;
  }

  render() {
    return (
      <div style={{display: 'flex', height: '100%'}}>
        <div style={{width: 48+(12*2), paddingLeft: 12, paddingRight: 12}}>
          <IconButton color="inherit" onClick={()=>{this.props.onClose()}} style={{marginTop: 12}} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <IconButton disabled={true} style={{marginTop: 'calc(50vh - 84px)'}} aria-label="Back">
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <div style={{flexGrow: 1}}>
          
          {
            this.state.stage==='qr'?
              <Slide in={this.state.stage==='qr' && !this.state.slideTransitioningOut} timeout={transitionTimeout} direction='right' appear={!this.state.firstStage}>
                <div>
                  <p>Set qr data</p>
                </div>
              </Slide>
            : null
          }

          {
            this.state.stage!=='qr'?
              <Slide in={this.state.stage!=='qr' && !this.state.slideTransitioningOut} timeout={transitionTimeout} direction='left' appear={!this.state.firstStage}>
                <div>
                  {
                    ['tl', 'tr', 'bl', 'br'].map(corner => (
                      this.state.stage === corner?
                        <Fade in={this.state.stage===corner && !this.state.fadeTransitioningOut} timeout={transitionTimeout} appear={!this.state.firstStage} key={corner}>
                          <div>{corner}</div>
                        </Fade>
                      : null
                    ))
                  }

                </div>
              </Slide>
            : null
          }

        </div>
        <div style={{width: 48+(12*2), paddingLeft: 12, paddingRight: 12}}>
          <IconButton style={{marginTop: 'calc(50vh - 24px)'}} aria-label="Back">
            <ChevronRightIcon />
          </IconButton>
        </div>
      </div>
    );
  }

  setStage(stage) {
    const sliding = stage === 'qr' || this.state.stage === 'qr';
    this.setState({slideTransitioningOut: sliding, fadeTransitioningOut: !sliding, firstStage: false}, ()=>{
      setTimeout(()=>{
        this.setState({stage: stage, slideTransitioningOut: false, fadeTransitioningOut: false});
      }, transitionTimeout);
    });
  }

  componentDidMount() {
    setTimeout(()=>{this.setStage('tl');}, 5000);
    setTimeout(()=>{this.setStage('tr');}, 10000);
    setTimeout(()=>{this.setStage('qr');}, 15000);
  }
}

export default Overrider;
