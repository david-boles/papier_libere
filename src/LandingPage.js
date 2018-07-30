import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';



class LandingPage extends Component {

  render() {
    return (
      <Grid container direction='row' justify='center' alignItems='center' style={{height: 'calc(100vh - 48px)'}}>
        <Grid item>
          <Typography variant='display1' align='center' style={{padding: 24}}>Welcome to Papier Libéré, an open source smart paper ecosystem currently in alpha. Please log in above to continue.</Typography>
        </Grid>
      </Grid>
    );
  }
  
}

export default LandingPage;