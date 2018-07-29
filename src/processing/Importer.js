import Slide from '@material-ui/core/Slide';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import NoteAdd from '@material-ui/icons/NoteAdd';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import OldImporter from '../import/Importer';
import Check from '@material-ui/icons/Check';
import Warning from '@material-ui/icons/Warning';

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
      }*/]
    }
  }

  render() {
    return (
      <div style={{padding: 20}}>
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
                          <Button color="primary">
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

          {/* <Grid item xs={10} s={9} md={8} lg={7} xl={6}>
            <Card square={true}>
              <OldImporter/>
            </Card>
          </Grid> */}

          <Grid item xs={10} s={9} md={8} lg={7} xl={6}>
            <Button variant='raised' color='primary' disabled={this.state.importing.length === 0 /* && ... */}>
              export files
            </Button>
          </Grid>
        </Grid>
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
        worker: new Worker('importer.js')
      }) - 1;

      newImporting[index].worker.onmessage = e => {
        const importing = this.state.importing;

        switch(e.data[0]) {
          case 'source_bitmap':
            importing[index].sourceBitmap = e.data[1];
            this.setState({importing: importing});

            var canvas = document.getElementById(`display_canvas-${index}`);
            canvas.style.display = 'unset';
            canvas.width = e.data[1].width;
            canvas.height = e.data[1].height;
            canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(e.data[1].data), e.data[1].width, e.data[1].height), 0, 0);
            break;

          case 'progress':
            importing[index].progress = e.data[1];
            importing[index].progressTooltip = e.data[2];
            this.setState({importing: importing});
            break;

          default:
            console.error('unhandled message from worker', e.data);
        }
      };

      var reader = new FileReader();
      reader.onload = e => {
        newImporting[index].worker.postMessage([e.target.result]);
      }
      reader.readAsArrayBuffer(file);
    }

    this.setState({importing: newImporting});
  }

  componentWillUnmount() {
    this.state.importing.forEach(imgImport => {
      imgImport.worker.terminate();
    });
  }
}

// displayJIMPImage(image) {
//   var canvas = document.getElementById('display');
//   canvas.width = image.bitmap.width;also display unset
//   canvas.height = image.bitmap.height;
//   canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(image.bitmap.data), image.bitmap.width, image.bitmap.height), 0, 0);
// }

export default Importer;
