import React, { Component } from 'react';
import Importer from './import/Importer';
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#424242',
    },
    secondary: {
      main: '#b0bec5',
    },
  },
});

const fadeTimeout = 100;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: null,
      next: null,
      isTransitioning: false
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar>
          <Toolbar variant="dense">
            <Typography variant="title" color="inherit" style={{flexGrow: 1}}>
              Papier Libéré
            </Typography>
            <Button variant='outlined' style={{color: 'white', borderColor: 'white'}}>
              log in
            </Button>
          </Toolbar>
        </AppBar>
        <Fade in={!!this.state.next} timeout={fadeTimeout}>
          <div style={{marginTop: 48}}>
            {this.state.current}
          </div>
        </Fade>
      </MuiThemeProvider>
    );
  }

  setView(component) {
    this.setState({
      next: component,
      isTransitioning: true
    }).then(() => {
      if(!this.state.isTransitioning) {
        setTimeout(this.setState({
          current: this.state.next,
          next: null,
          isTransitioning: false
        }), fadeTimeout);
      }
    });
  }
}

export default App;
