import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/Delete';
import Warning from '@material-ui/icons/Warning';
import React, { Component } from 'react';
import actionIcons from '../actionIcons';
import Overrider from './Overrider';

class Exporter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exporting: []
    }
  }

  render() {
    return (
      <div style={{padding: 20, height: 'calc(100vh - 48px)', overflowY: 'auto'}}>
        <Grid container direction='column' justify='flex-start' alignItems='center' spacing={40}>

          {/* {this.state.importing.map((imgImport, index) => {
            if(imgImport) return (
              <Grid item xs={10} s={9} md={8} lg={7} xl={6} key={index}>
                <Card square={true}>

                  <canvas id={`display_canvas-${index}`} src="/scanned.png" style={{width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '500px', display: 'none'}}/>

                  <CardContent>
                    <TextField
                      id={`name_input-${index}`}
                      value={imgImport.name}
                      fullWidth={true} error={!imgImport.name}
                      onInput={e=>{
                        const importing = this.state.importing;
                        importing[index].name = e.target.value;
                        this.setState({importing: importing});
                      }}
                      InputProps={{endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={()=>{
                              const importing = this.state.importing;
                              importing[index].name = '';
                              this.setState({importing: importing})
                              document.getElementById(`name_input-${index}`).focus();
                            }}
                            style={{width: 32, height: 32}}
                          >
                            <Clear style={{width: 16, height: 16}}/>
                          </IconButton>
                        </InputAdornment>
                      )}}
                    />
                  </CardContent>

                  <div style={{paddingLeft: 16, paddingRight: 16}}>
                    <Grid container direction='column' alignItems='flex-start' spacing={8} style={{overflowX: 'auto', minWidth: 240, height: 132, alignContent: 'center'}}>
                      {
                        imgImport.actions.map((enabled, actionIndex) => {const actionIcon = actionIcons[actionIndex]; return (
                          <Grid item key={actionIndex}>
                            <IconButton style={{width: 32, height: 32, color: enabled? 'white' : 'rgba(0, 0, 0, 0.54)', backgroundColor: enabled? 'rgba(0, 0, 0, 0.54)' : 'unset'}} onClick={()=>{const importing = this.state.importing; importing[index].actions[actionIndex] = !importing[index].actions[actionIndex]; this.setState({importing: importing});}}>
                              {actionIcon}
                            </IconButton>
                          </Grid>
                        )})
                      }
                    </Grid>
                  </div>

                  <CardActions>
                    <div style={{flexGrow: 1}}>
                      <div style={{height: 36, padding: '6px 16px 6px 8px', verticalAlign: 'middle', display: 'inline-block'}}>
                        {
                          imgImport.progress === 'indeterminate' || typeof imgImport.progress === 'number'?
                            <Tooltip title={imgImport.progressTooltip}><CircularProgress variant={typeof imgImport.progress === 'number' ? 'static' : 'indeterminate'} value={typeof imgImport.progress === 'number' ? imgImport.progress : 0} size={24}/></Tooltip>
                          : null
                        }
                        {
                          imgImport.progress === 'done' ?
                            <Tooltip title={imgImport.progressTooltip}><Check/></Tooltip>
                          : null
                        }
                        {
                          imgImport.progress === 'error'?
                            <Tooltip title={imgImport.progressTooltip}><Warning/></Tooltip>
                          : null
                        }
                      </div>
                    </div>

                    <div>
                      {
                        imgImport.sourceBitmap?
                          <Button color="primary" style={{marginRight: 8}} onClick={()=>{this.setState({overriding: true, overrider: <Overrider import={imgImport} onClose={()=>{this.handleOverrideClose()}} onOverride={async (qrData, corners)=>{
                            this.handleOverrideClose();

                            const importing = this.state.importing;
                            importing[index].worker.terminate();

                            importing[index].progress = 'indeterminate';
                            importing[index].progressTooltip = 'Applying overrides...';
                            importing[index].worker = new Worker('/import_worker.js');
                            importing[index].worker.onmessage = this.getWorkerHandler(index);
                            importing[index].qrData = qrData;
                            importing[index].corners = corners;

                            const notebookOverlay = await this.notebookOverlay;
                            const notebookOverlayUncropped = await this.notebookOverlayUncropped;
                            this.setState({importing: importing}, ()=>{
                              importing[index].worker.postMessage([importing[index].sourceBitmap, qrData, corners, notebookOverlay, notebookOverlayUncropped]);
                            });
                          }}/>});}}>
                            override
                          </Button>
                        : null
                      }

                      <IconButton style={{width: 36, height: 36}} onClick={()=>{this.setState({deleting: index})}}>
                        <Delete/>
                      </IconButton>
                    </div>
                  </CardActions>
                </Card>
              </Grid>
            );
            else return null;
          })} */}

          {/* <Grid item xs={10} s={9} md={8} lg={7} xl={6}>
            <div style={{paddingBottom: 48}}>
              <Button variant='raised' color='primary' disabled={this.state.importing.length === 0  || (()=>{
                // var allDone = true;
                // this.state.importing.forEach(imgImport => {
                //   allDone &= imgImport.progress === 'done'
                // })
                // if(!allDone) return true;

                // const names = this.state.importing.map(imgImport => imgImport.name);
                // names.push('');//Also check for empty names
                // if(names.length !== new Set(names).size) return true;//Return false if duplicate names
                return false;
              })()}>
                
              </Button>
            </div>
          </Grid> */}
        </Grid>
      </div>
    );
  }

  componentWillUnmount() {
    this.state.exporting.forEach(imgExport => {
      imgExport.worker.terminate();
    });
  }

  displayBitmap(index, bitmap) {
    var canvas = document.getElementById(`display_canvas-${index}`);
    canvas.style.display = 'unset';
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(bitmap.data), bitmap.width, bitmap.height), 0, 0);
  }
}

export default Exporter;
