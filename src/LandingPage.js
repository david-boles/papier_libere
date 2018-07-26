import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Fade from '@material-ui/core/Fade';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import firebase from 'firebase';



class LandingPage extends Component {

  render() {
    return (
      <Grid container direction='row' justify='center' alignItems='center' style={{height: 'calc(100vh - 48px)'}}>
        <Grid item>
          <Typography variant='display1' align='center' style={{padding: 24}}>Welcome to Papier Libéré, an open source smart paper ecosystem. Please log in above.</Typography>
        </Grid>
      </Grid>
    );
  }
  
}

export default LandingPage;