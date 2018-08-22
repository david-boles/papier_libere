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
import Delete from '@material-ui/icons/Delete';
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import Overrider from './Overrider';
import RotateLeftOutlined from '@material-ui/icons/RotateLeftOutlined';
import RotateRightOutlined from '@material-ui/icons/RotateRightOutlined';
import NoteAddOutlined from '@material-ui/icons/NoteAddOutlined';
import EmailOutlined from '@material-ui/icons/EmailOutlined';
import FolderSpecialOutlined from '@material-ui/icons/FolderSpecialOutlined';
import CreateOutlined from '@material-ui/icons/CreateOutlined';
import PersonOutlined from '@material-ui/icons/PersonOutlined';
import ModeCommentOutlined from '@material-ui/icons/ModeCommentOutlined';
import KitchenOutlined from '@material-ui/icons/KitchenOutlined';
import ShowChartOutlined from '@material-ui/icons/ShowChartOutlined';
import StraightenOutlined from '@material-ui/icons/StraightenOutlined';
import BusinessCenterOutlined from '@material-ui/icons/BusinessCenterOutlined';
import CloudOutlined from '@material-ui/icons/CloudOutlined';
import BugReportOutlined from '@material-ui/icons/BugReportOutlined';
import WavesOutlined from '@material-ui/icons/WavesOutlined';
import DonutSmallOutlined from '@material-ui/icons/DonutSmallOutlined';
import AcUnitOutlined from '@material-ui/icons/AcUnitOutlined';
import PublicOutlined from '@material-ui/icons/PublicOutlined';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Clear from '@material-ui/icons/Clear';
import InputAdornment from '@material-ui/core/InputAdornment';

const actionIcons = [
  <RotateLeftOutlined/>,
  <RotateRightOutlined/>,
  <NoteAddOutlined/>,
  <EmailOutlined/>,
  <FolderSpecialOutlined/>,
  <CreateOutlined/>,
  <PersonOutlined/>,
  <ModeCommentOutlined/>,
  <KitchenOutlined/>,
  <ShowChartOutlined/>,
  <StraightenOutlined/>,
  <BusinessCenterOutlined/>,
  <CloudOutlined/>,
  <BugReportOutlined/>,
  <WavesOutlined/>,
  <DonutSmallOutlined/>,
  <AcUnitOutlined/>,
  <PublicOutlined/>,
];

class Importer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragEntered: false,
      importing: [],
      overriding: false,
      overrider: '',
      deleting: false
    }

    this.notebookOverlay = loadImageData('/assets/notebook_overlay.png');
    this.notebookOverlayUncropped = loadImageData('/assets/notebook_overlay-uncropped.png');
  }

  render() {
    return (
      <div style={{padding: 20, height: 'calc(100vh - 48px)', overflowY: 'auto'}}>
        <input type='file' id='file_selector' multiple accept='image/*' style={{display: 'none'}} onChange={(e)=>{this.handleSelect(e.target.files); e.target.value = ''}}/>

        <Grid container direction='column' justify='flex-start' alignItems='center' spacing={40}>
          <Grid item xs={10} s={9} md={8} lg={7} xl={6}>
            <div style={{ width: '100vw', maxWidth: '100%', borderStyle: this.state.dragEntered? 'solid' : 'dashed', textAlign: 'center', paddingTop: 48, paddingBottom: 48}} onDragEnter={e=>{e.stopPropagation();e.preventDefault();this.setState({dragEntered: true})}} onDragOver={e=>{e.stopPropagation();e.preventDefault();}} onDrop={e=>{e.stopPropagation();e.preventDefault();this.handleSelect(e.dataTransfer.files); this.setState({dragEntered: false})}} onDragLeave={e=>{this.setState({dragEntered: false})}} onDragEnd={e=>{this.setState({dragEntered: false})}}>
              <Button variant='outlined' color='primary' component='label' htmlFor='file_selector'>
                select photos
              </Button>
            </div>
          </Grid>

          {this.state.importing.map((imgImport, index) => {
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

                            importing[index].progress = 'indeterminate',
                            importing[index].progressTooltip = 'Applying overrides...',
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
          })}

          <Grid item xs={10} s={9} md={8} lg={7} xl={6}>
            <div style={{paddingBottom: 48}}>
              <Button variant='raised' color='primary' disabled={this.state.importing.length === 0  || (()=>{
                var allDone = true;
                this.state.importing.forEach(imgImport => {
                  allDone &= imgImport.progress === 'done'
                })
                if(!allDone) return true;

                const names = this.state.importing.map(imgImport => imgImport.name);
                names.push('');//Also check for empty names
                if(names.length !== new Set(names).size) return true;//Return false if duplicate names
                return false;
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

        <Dialog
          // disableBackdropClick
          // disableEscapeKeyDown
          maxWidth="xs"
          open={this.state.deleting !== false}
        >
          <DialogTitle>Are you sure you want to remove {this.state.deleting !== false? this.state.importing[this.state.deleting].name : ''}</DialogTitle>
          <DialogActions>
            <Button onClick={this.handleCancel} color='primary' onClick={()=>{this.setState({deleting: false})}}>
              cancel
            </Button>
            <Button onClick={this.handleOk} variant='raised' color='secondary' onClick={()=>{
              const importing = this.state.importing;
              importing[this.state.deleting].worker.terminate();
              importing[this.state.deleting] = false;
              this.setState({importing: importing, deleting: false});
            }}>
              remove
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  async handleSelect(files) {
    const newImporting = this.state.importing.slice();

    for(var i = 0; i < files.length; i++) {
      const file = files.item(i);

      const index = newImporting.push({
        fileName: file.name,
        name: file.name.split('.')[0],
        actions: (()=>{const out = []; for(var i = 0; i < 18; i++) out.push(false); return out;})(),
        progress: 'indeterminate',
        progressTooltip: 'Loading...',
        worker: new Worker('/import_worker.js')
      }) - 1;

      newImporting[index].worker.onmessage = this.getWorkerHandler(index);

      const notebookOverlay = await this.notebookOverlay;
      const notebookOverlayUncropped = await this.notebookOverlayUncropped;

      var reader = new FileReader();
      reader.onload = e => {
        newImporting[index].worker.postMessage([e.target.result, notebookOverlay, notebookOverlayUncropped]);
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

        case 'actions':
          console.log(e.data[1]);
          for(var i = 0; i < importing[index].actions.length; i++) {
            importing[index].actions[i] = importing[index].actions[i] || e.data[1][i];
          }
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

async function loadImageData(url) {
  const raw = await (await fetch(url)).blob();
  const bitmap = await createImageBitmap(raw);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

export default Importer;
