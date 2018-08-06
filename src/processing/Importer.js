import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Check from '@material-ui/icons/Check';
import Warning from '@material-ui/icons/Warning';
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import Overrider from './Overrider';

class Importer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragEntered: false,
      importing: [/*{
        fileName: 'hi',
        name: 'hi',
        progress: 'error',
        progressTooltip: 'This is a test.'
      }*/],
      overriding: false,
      overrider: ''
    }
  }

  render() {
    return (
      <div style={{padding: 20, height: 'calc(100vh - 48px)', overflowY: 'auto'}}>
        <input type='file' id='file_selector' multiple accept='image/*' style={{display: 'none'}} onChange={(e)=>{this.handleSelect(e.target.files)}}/>

        <Grid container direction='column' justify='flex-start' alignItems='center' spacing={40}>
          <Grid item xs={10} s={9} md={8} lg={7} xl={6}>
            <div style={{ width: '100vw', maxWidth: '100%', borderStyle: this.state.dragEntered? 'solid' : 'dashed', textAlign: 'center', paddingTop: 48, paddingBottom: 48}} onDragEnter={e=>{e.stopPropagation();e.preventDefault();this.setState({dragEntered: true})}} onDragOver={e=>{e.stopPropagation();e.preventDefault();}} onDrop={e=>{e.stopPropagation();e.preventDefault();this.handleSelect(e.dataTransfer.files);this.setState({dragEntered: false})}} onDragLeave={e=>{this.setState({dragEntered: false})}} onDragEnd={e=>{this.setState({dragEntered: false})}}>
              <Button variant='outlined' color='primary' component='label' htmlFor='file_selector'>
                select photos
              </Button>
            </div>
          </Grid>

          {this.state.importing.map((imgImport, index) => {
            return (
              <Grid item xs={10} s={9} md={8} lg={7} xl={6} key={index}>
                <Card square={true}>

                  <canvas id={`display_canvas-${index}`} src="/scanned.png" style={{width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '500px', display: 'none'}}/>

                  <CardContent>
                    <TextField defaultValue={imgImport.name} fullWidth={true} onInput={e=>{const importing = this.state.importing; importing[index].name = e.target.value; this.setState({importing: importing})}}/>
                  </CardContent>

                  <CardActions>
                    <div style={{flexGrow: 1}}>
                      {
                        imgImport.sourceBitmap?
                          <Button color="primary" onClick={()=>{this.setState({overriding: true, overrider: <Overrider import={imgImport} onClose={()=>{this.handleOverrideClose()}} onOverride={(qrData, corners)=>{
                            this.handleOverrideClose();

                            const importing = this.state.importing;
                            importing[index].worker.terminate();

                            importing[index].progress = 'indeterminate',
                            importing[index].progressTooltip = 'Applying overrides...',
                            importing[index].worker = new Worker('/import_worker.js');
                            importing[index].worker.onmessage = this.getWorkerHandler(index);
                            importing[index].qrData = qrData;
                            importing[index].corners = corners;
                            this.setState({importing: importing}, ()=>{
                              importing[index].worker.postMessage([importing[index].sourceBitmap, qrData, corners]);
                            });
                          }}/>});}}>
                            override
                          </Button>
                        : null
                      }
                    </div>

                    <div style={{marginLeft: 20, marginRight: 16}}>
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
                  </CardActions>
                </Card>
              </Grid>
            );
          })}

          <Grid item xs={10} s={9} md={8} lg={7} xl={6}>
            <div style={{paddingBottom: 48}}>
              <Button variant='raised' color='primary' disabled={this.state.importing.length === 0  || (()=>{
                var allDone = true;
                this.state.importing.forEach(imgImport => {
                  allDone &= imgImport.progress === 'done'
                })
                return !allDone;
              })()}>
                export files
              </Button>
            </div>
          </Grid>
        </Grid>

        <Dialog
          fullScreen
          open={this.state.overriding}
          onClose={()=>{this.handleOverrideClose()}}
          TransitionComponent={Slide}
          TransitionProps={{direction: 'up'}}
        >
          {this.state.overrider}
        </Dialog>
      </div>
    );
  }

  handleSelect(files) {
    const newImporting = this.state.importing.slice();

    for(var i = 0; i < files.length; i++) {
      const file = files.item(i);

      const index = newImporting.push({
        fileName: file.name,
        name: file.name.split('.')[0],
        progress: 'indeterminate',
        progressTooltip: 'Loading...',
        worker: new Worker('/import_worker.js')
      }) - 1;

      newImporting[index].worker.onmessage = this.getWorkerHandler(index);

      var reader = new FileReader();
      reader.onload = e => {
        newImporting[index].worker.postMessage([e.target.result]);
      }
      reader.readAsArrayBuffer(file);
    }

    this.setState({importing: newImporting});
  }

  getWorkerHandler(index) {
    return e => {
      const importing = this.state.importing;

      switch(e.data[0]) {
        case 'progress':
          importing[index].progress = e.data[1];
          importing[index].progressTooltip = e.data[2];
          this.setState({importing: importing});
          break;

        case 'source_bitmap':
          importing[index].sourceBitmap = e.data[1];
          this.setState({importing: importing});
          this.displayBitmap(index, e.data[1]);
          break;

        case 'qr_data':
          importing[index].qrData = e.data[1];
          this.setState({importing: importing});
          console.log(e.data[1])
          break;

          case 'corners':
            importing[index].corners = e.data[1];
            this.setState({importing: importing});
            console.log(e.data[1])
            break;

        case 'done':
          importing[index].finalBitmap = e.data[1];
          importing[index].progress = 'done';
          importing[index].progressTooltip = 'Importing complete!';
          this.setState({importing: importing});
          this.displayBitmap(index, e.data[1]);
          break;

        case 'debug':
          this.displayBitmap(index, e.data[1]);
          break;

        default:
          console.error('unhandled message from worker', e.data);
      }
    };
  }

  handleOverrideClose() {
    this.setState({overriding: false});
  }

  componentWillUnmount() {
    this.state.importing.forEach(imgImport => {
      imgImport.worker.terminate();
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

export default Importer;
