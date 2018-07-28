import Slide from '@material-ui/core/Slide';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import NoteAdd from '@material-ui/icons/NoteAdd';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import OldImporter from '../import/Importer';

class Importer extends Component {

  render() {
    return (
      <div style={{padding: 20}}>
        <input type='file' id='file_selector' multiple accept='image/*' style={{display: 'none'}} onChange={(e)=>{this.handleSelect(e.target.files)}}/>

        <Grid container direction='column' justify='flex-start' alignItems='center' spacing={40}>
          <Grid item xs={10} s={9} md={8} lg={7} xl={6}>
            <div style={{ width: '100vw', maxWidth: '100%', borderStyle: 'dashed', textAlign: 'center', paddingTop: 48, paddingBottom: 48}}>
              <Button variant='outlined' color='primary' component='label' htmlFor='file_selector'>
                select photos
              </Button>
            </div>
          </Grid>

          <Grid item xs={10} s={9} md={8} lg={7} xl={6}>
            <Card>
              <img src="/scanned.png" style={{width: 'auto', minWidth: '100%', maxWidth: '100%', maxHeight: '60vh'}}/>
              <CardActions>
                <Button color="primary">
                  Override Detection
                </Button>
                <Button color="primary">
                  Properties
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={10} s={9} md={8} lg={7} xl={6}>
            <Card>
              <img src="/landscape.jpg" style={{width: 'auto', minWidth: '100%', maxWidth: '100%', maxHeight: '60vh'}}/>
              <CardActions>
                <Button color="primary">
                  Override Detection
                </Button>
                <Button color="primary">
                  Properties
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={10} s={9} md={8} lg={7} xl={6}>
            <Card>
              <img src="/small.png" style={{width: 'auto', minWidth: '100%', maxWidth: '100%', maxHeight: '60vh'}}/>
              <CardActions>
                <Button color="primary">
                  Override Detection
                </Button>
                <Button color="primary">
                  Properties
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={10} s={9} md={8} lg={7} xl={6}>
            <Card>
              <OldImporter/>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }

  handleSelect(files) {
    console.log(files);
  }
}

export default Importer;
