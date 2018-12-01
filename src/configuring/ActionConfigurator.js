import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import React, { Component } from 'react';

class ActionConfigurator extends Component {
  render() {
    const action = this.props.app.state.actions[this.props.actionIndex];
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Select value={action.type} onChange={e=>{this.updateAction({type: e.target.value, location: action.location? action.location : ''})}}>
          <MenuItem value={'none'}>None</MenuItem>
          <MenuItem value={'google_drive'}>Google Drive</MenuItem>
        </Select>

        {
          action.type === 'google_drive'?
            <TextField placeholder='folder ID or blank for prompt' value={action.location} onChange={e=>{this.updateAction({type: action.type, location: e.target.value})}} style={{marginLeft: 12, width: 204}}/>
          :
            null
        }
      </div>
    );
  }
  
  updateAction(action) {
    const actions = this.props.app.state.actions;
    actions[this.props.actionIndex] = action;
    this.props.app.setState({actions: actions});
  }
}

export default ActionConfigurator;