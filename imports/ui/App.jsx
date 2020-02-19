import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom';

import List from '@material-ui/core/List';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

import Main from './Main.jsx';
import ScheduleList from './ScheduleList.jsx';
import Hello from './Hello.jsx';
import ListItemLink from './ListItemLink.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';

class App extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <Router>
        <Main />
      </Router>
    );
  }
}

export default App;
