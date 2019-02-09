import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import { Route, Switch, Link } from 'react-router-dom';

import LandingPage from './components/landing-page';
import Recognize from './components/recognize';
import Register from './components/register';



class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  render() {

    const { classes, theme } = this.props;

    return (
          <Switch>
            <Route exact path='/' render={(props) => <LandingPage {...props} />} />
            <Route path='/recognize' render={(props) => <Recognize {...props} />} />
            <Route path='/register' render={(props) => <Register {...props} />} />
            <Route path='**' render={(props) => <LandingPage {...props} />} />
          </Switch>
    );
  }
}

export default App;
