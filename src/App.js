import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Fade from '@material-ui/core/Fade';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import firebase from 'firebase';
import LandingPage from './LandingPage';

const fbConfig = {
  apiKey: "AIzaSyBffehKyH0dD4IYmNF-oGbaXx3mjEKXC0g",
  authDomain: "papier-libere.firebaseapp.com",
  databaseURL: "https://papier-libere.firebaseio.com",
  projectId: "papier-libere",
  storageBucket: "papier-libere.appspot.com",
  messagingSenderId: "652682086267"
};
firebase.initializeApp(fbConfig);
const fbAuth = firebase.auth();
const fbFS = firebase.firestore();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive');

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

const fadeTimeout = 250;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: null,
      next: null,
      isTransitioning: false,
      auth: null
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
            {
              this.state.auth === false?
                <Button variant='outlined' style={{color: 'white', borderColor: 'white'}} onClick={()=>{this.initiateLogIn()}}>
                  log in
                </Button>
              : null
            }
            {
              this.state.auth?
                <Button variant='outlined' style={{color: 'white', borderColor: 'white'}} onClick={()=>{this.initiateLogOut()}}>
                  log out
                </Button>
              : null
            }  
          </Toolbar>
        </AppBar>
        <Fade in={!this.state.next} timeout={fadeTimeout}>
          <div style={{marginTop: 48}}>
            {this.state.current}
          </div>
        </Fade>
      </MuiThemeProvider>
    );
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({auth: user});
        console.log('Logged in!');
      } else {
        this.setState({auth: false});
        console.log('Logged out :(');
        this.setView(<LandingPage/>);
      }
    });
  }

  setView(component) {
    const wasTransitioning = this.state.isTransitioning;

    this.setState({
      next: component,
      isTransitioning: true
    });

    if(!wasTransitioning) {
      setTimeout(() => {
        this.setState({
        current: this.state.next,
        next: null,
        isTransitioning: false
      })}, fadeTimeout);
    }
  }

  initiateLogIn() {
    fbAuth.signInWithPopup(googleAuthProvider).then(result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  initiateLogOut() {
    firebase.auth().signOut();
  }
}

export default App;
export { firebase, fbAuth, fbFS };