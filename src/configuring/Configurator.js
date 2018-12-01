import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Close from '@material-ui/icons/Close';
import React, { Component } from 'react';
import actionIcons from '../actionIcons';
import ActionConfigurator from './ActionConfigurator';

class Configurator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: 0,
    }
  }

  render() {
    return (
      <div style={{display: 'flex', height: '100%', overflowX: 'hidden', overflowY: 'hidden'}}>
        <div style={{width: 48+(12*2), paddingLeft: 12, paddingRight: 12, background: 'white', zIndex: 2}}>
          <IconButton color="inherit" onClick={()=>{this.props.onClose()}} style={{marginTop: 12}} aria-label="Close">
            <Close />
          </IconButton>
        </div>

        <div style={{flexGrow: 1, paddingTop: 12}}>
          <Typography variant="display1" style={{display: 'inline'}}>Actions</Typography>

          <Grid container direction='column' alignItems='flex-start' spacing={8} style={{overflowX: 'auto', width: 240, height: 132, alignContent: 'center', marginTop: 12}}>
            {
              this.props.app.state.actions.map((action, actionIndex) => {const actionIcon = actionIcons[actionIndex]; return (
                <Grid item key={actionIndex}>
                  <IconButton style={{width: 32, height: 32, color: this.state.action === actionIndex? 'white' : 'rgba(0, 0, 0, 0.54)', backgroundColor: this.state.action === actionIndex? 'rgba(0, 0, 0, 0.54)' : 'unset'}} onClick={()=>{this.setState({action: actionIndex})}}>
                    {actionIcon}
                  </IconButton>
                </Grid>
              )})
            }
          </Grid>

          <ActionConfigurator app={this.props.app} actionIndex={this.state.action}/>
        </div>
      </div>
    );
  }
  
}

export default Configurator;