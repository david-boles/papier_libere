import Slide from '@material-ui/core/Slide';
import React, { Component } from 'react';
import Importer from './Importer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SaveIcon from '@material-ui/icons/Save';

const transitionTimeout = 250;

class Overrider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stage: 0,//0 for qr data, 1-4 for tl, tr, bl, and br
      firstStage: true,
      transitioningOut: false,
      direction: 'right',
      corners: {},
      pageType: 1,
      pageSize: 'LTR',
      pageOrientation: 'P',
      pageQRSize: 75,
      pageNumber: 1
    };
    
    if(props.import.qrData) {
      const split = props.import.qrData.split(' ');
      const type = Number(split[0]);
      switch(type) {
        case 0:
          this.state.pageType = type;
          this.state.paperSize = split[1]
          // this.state.pageOrientation = split[2]; TODO
          this.state.pageQRSize = Number(split[3]);
          break;
        case 1:
          this.state.pageType = type;
          this.state.pageNumber = Number(split[1]);
          break;
        default:
          console.warn('invalid type for overrider', type);
      }
      this.state.stage = 1;
    }
    if(props.import.corners) this.state.corners = Object.assign({}, props.import.corners);
  }

  render() {
    return (
      <div style={{display: 'flex', height: '100%', overflowX: 'hidden', overflowY: 'hidden'}}>
        <div style={{width: 48+(12*2), paddingLeft: 12, paddingRight: 12, background: 'white', zIndex: 2}}>
          <IconButton color="inherit" onClick={()=>{this.props.onClose()}} style={{marginTop: 12}} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <IconButton disabled={this.state.stage === 0} style={{marginTop: 'calc(50vh - 84px)'}} aria-label="Back" onClick={()=>{this.setStage(this.state.stage-1)}}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <div style={{flexGrow: 1, zIndex: 1}}>
          <Slide in={!this.state.transitioningOut} timeout={transitionTimeout} direction={this.state.direction} appear={!this.state.firstStage} key={this.state.stage}>
            <div style={{paddingTop: 12, paddingBottom: 12, width: 'calc(100vw - 144px)', height: 48+(12*2), display: 'flex', alignItems: 'center', overflowX: 'auto'}}>
              {this.state.stage === 0? (
                <React.Fragment>
                  <Typography variant="title" style={{whiteSpace: 'nowrap'}}>Select page info:</Typography>

                  <Select value={this.state.pageType} onChange={e=>{this.setState({pageType: e.target.value})}} style={{marginLeft: 12}}>
                    <MenuItem value={0}>Basic</MenuItem>
                    <MenuItem value={1}>Notebook</MenuItem>
                  </Select>

                  {
                    this.state.pageType === 0?
                      <React.Fragment>
                        <Select value={this.state.pageSize} onChange={e=>{this.setState({pageSize: e.target.value})}} style={{marginLeft: 12}}>
                          <MenuItem value={'LTR'}>Letter (8.5x11")</MenuItem>
                        </Select>

                        <Select value={this.state.pageOrientation} onChange={e=>{this.setState({pageOrientation: e.target.value})}} style={{marginLeft: 12}}>
                          <MenuItem value={'P'}>Portrait</MenuItem>
                          <MenuItem value={'L'}>Landscape</MenuItem>
                        </Select>

                        {/* QR size is only needed for automated corner detection <Select value={this.state.pageQRSize} onChange={e=>{this.setState({pageQRSize: e.target.value})}} style={{marginLeft: 12}}>
                          <MenuItem value={75}>0.75" QR code</MenuItem>
                        </Select> */}
                      </React.Fragment>
                    : null
                  }

                  {
                    this.state.pageType === 1?
                      <TextField value={this.state.pageNumber} error={this.state.pageNumber === ''} onInput={(e)=>{this.setState({pageNumber: (()=>{
                        const num = Math.round(e.target.valueAsNumber);
                        if(num < 1) return 1;
                        if(isNaN(num)) {
                          e.target.value = '';
                          return '';
                        }
                        return num;
                      })()})}} type="number" InputProps={{startAdornment: <InputAdornment position="start">pg</InputAdornment>}} inputProps={{min: 1}} style={{marginLeft: 12, width: 80}}/>
                    : null
                  }
                </React.Fragment>
              ) : null}
              {this.state.stage === 1? <Typography variant="title" style={{whiteSpace: 'nowrap'}}>Select the top left corner.</Typography> : null}
              {this.state.stage === 2? <Typography variant="title" style={{whiteSpace: 'nowrap'}}>Select the top right corner.</Typography> : null}
              {this.state.stage === 3? <Typography variant="title" style={{whiteSpace: 'nowrap'}}>Select the bottom left corner.</Typography> : null}
              {this.state.stage === 4? <Typography variant="title" style={{whiteSpace: 'nowrap'}}>Select the bottom right corner.</Typography> : null}
            </div>
          </Slide>
          <div style={{textAlign: 'center'}}>
            <canvas id='display_canvas-overrider' style={{width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: 'calc(100vh - 72px)'}}/>
          </div>
        </div>
        <div style={{width: 48+(12*2), paddingLeft: 12, paddingRight: 12}}>
          <IconButton disabled={(this.state.stage === 0 && this.state.pageNumber === '') || (()=>{
            const corners = [[1, 'tl'], [2, 'tr'], [3, 'bl'], [4, 'br']]
            for(var i = 0; i < corners.length; i++) {
              if(this.state.stage === corners[i][0] && !this.state.corners[corners[i][1]]) return true;
            };
            return false;
          })()} style={{marginTop: 'calc(50vh - 24px)'}} aria-label="Next" onClick={()=>{
            if(this.state.stage === 4) {
              var qrData = '';
              qrData += this.state.pageType;
              switch(this.state.pageType) {
                case 0:
                  qrData += ` ${this.state.pageSize} ${this.state.pageOrientation} ${this.state.pageQRSize}`;
                  break;
                case 1:
                  qrData += ` ${this.state.pageNumber}`;
                  break;
                default:
                  console.warn('no special attributes set for override complete');
              }
              this.props.onOverride(qrData, this.state.corners);
            }else {
              this.setStage(this.state.stage+1);
            }
          }}>
            {
              this.state.stage === 4?
                <SaveIcon/>
              :
                <ChevronRightIcon/>
            }
          </IconButton>
        </div>
      </div>
    );
  }

  setStage(stage) {
    const outDirection = stage > this.state.stage? 'right' : 'left';
    const inDirection = stage > this.state.stage? 'left' : 'right';
    this.setState({direction: outDirection, firstStage: false}, ()=>{
      this.setState({transitioningOut: true}, ()=>{
        setTimeout(()=>{
          this.setState({stage: stage, direction: inDirection}, ()=>{
            this.setState({transitioningOut: false});
          });
        }, transitionTimeout);
      });
    });
  }

  updateCanvas(first=false) {
    var canvas = document.getElementById('display_canvas-overrider');
    const ctx = canvas.getContext('2d');

    if(first) {
      canvas.onclick = e=>{
        const newCorner = {x: (e.pageX-canvas.getBoundingClientRect().left) * (canvas.width/canvas.offsetWidth), y: (e.pageY-canvas.getBoundingClientRect().top) * (canvas.height/canvas.offsetHeight)};
        const corners = this.state.corners;
        if(this.state.stage === 1) corners.tl = newCorner;
        if(this.state.stage === 2) corners.tr = newCorner;
        if(this.state.stage === 3) corners.bl = newCorner;
        if(this.state.stage === 4) corners.br = newCorner;
        this.setState({corners: corners}, ()=>{
          this.updateCanvas();
        });
      }
    }

    canvas.width = this.props.import.sourceBitmap.width;
    canvas.height = this.props.import.sourceBitmap.height;
    ctx.putImageData(new ImageData(new Uint8ClampedArray(this.props.import.sourceBitmap.data), this.props.import.sourceBitmap.width, this.props.import.sourceBitmap.height), 0, 0);

    ctx.lineWidth = 10;
    ctx.strokeStyle = '#607d8b';
    ctx.fillStyle = '#607d8b';
    const cs = this.state.corners;
    if(cs.tl && cs.tr) this.drawLine(ctx, cs.tl, cs.tr);
    if(cs.tr && cs.br) this.drawLine(ctx, cs.tr, cs.br);
    if(cs.br && cs.bl) this.drawLine(ctx, cs.br, cs.bl);
    if(cs.bl && cs.tl) this.drawLine(ctx, cs.bl, cs.tl);
    if(cs.tl) this.drawDot(ctx, cs.tl);
    if(cs.tr) this.drawDot(ctx, cs.tr);
    if(cs.bl) this.drawDot(ctx, cs.bl);
    if(cs.br) this.drawDot(ctx, cs.br);
  }

  drawLine(ctx, p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  drawDot(ctx, p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 20, 0, 2 * Math.PI, false);
    ctx.fill();
  }

  componentDidMount() {
    this.updateCanvas(true);
  }
}

export default Overrider;
