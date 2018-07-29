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
      importing: [{
        fileName: 'IMG_BLAHBLAHBLAH.jpg',
        name: 'IMG_BLAHBLAHBLAH',
        progress: 80,
        progressTooltip: 'Loading...',
        display: false
      }]
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

                  <canvas id={`display_canvas-${index}`} src="/scanned.png" style={{width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '500px', display: imgImport.display ? 'unset' : 'none'}}/>

                  <CardContent>
                    <TextField defaultValue={imgImport.name} fullWidth={true} onInput={e=>{const importing = this.state.importing; importing[index].name = e.target.value; this.setState({importing: importing})}}/>

                    {/* // <Typography component="p">
                    //   Loading...
                    // </Typography> */}
                  </CardContent>

                  <CardActions>
                    <div style={{flexGrow: 1}}>
                      {
                        imgImport.progress !== 'indeterminate'?
                          <Button color="primary">
                            Override Detection
                          </Button>
                        : null
                      }
                    </div>

                    <div style={{marginLeft: 0, marginRight: 16}}>
                      <Tooltip title={imgImport.progressTooltip}>
                        {
                          imgImport.progress === 'indeterminate' || typeof imgImport.progress === 'number'?
                            <CircularProgress variant={typeof imgImport.progress === 'number' ? 'static' : 'indeterminate'} value={typeof imgImport.progress === 'number' ? imgImport.progress : 0} size={24}/>
                          :
                            imgImport.progress === 'done' ?
                              <Check/>
                            :
                              <Warning/>
                        }
                      </Tooltip>
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
      console.log(file);
      newImporting.push({
        fileName: file.name,
        name: file.name.split('.')[0],
        progress: 'indeterminate',
        progressTooltip: 'Loading...',
        display: false
      });
    }

    this.setState({importing: newImporting}, ()=>{console.log(this.state.importing)});
  }
}

export default Importer;
