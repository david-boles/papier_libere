import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab'
import React, { Component } from 'react';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

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

          <Grid container direction='column' alignItems='flex-start' spacing={8} style={{overflowX: 'auto', width: 336, height: 180, alignContent: 'center', marginTop: 12}}>
            {
              this.props.app.state.actions.map((action, actionIndex) => {const actionIcon = actionIcons[actionIndex]; return (
                <Grid item key={actionIndex}>
                  <IconButton style={{color: this.state.action === actionIndex? 'white' : 'rgba(0, 0, 0, 0.54)', backgroundColor: this.state.action === actionIndex? 'rgba(0, 0, 0, 0.54)' : 'unset'}} onClick={()=>{this.setState({action: actionIndex})}}>
                    {actionIcon}
                  </IconButton>
                </Grid>
              )})
            }
          </Grid>
        </div>
      </div>
    );
  }
  
}

export default Configurator;