import React, { Component } from 'react';
import Position from './Position.jsx';
import ScheduleList from './ScheduleList.jsx';
import Hello from './Hello.jsx';
import ListItemLink from './ListItemLink.jsx';
import { BrowserRouter as Router, Route, Link, Switch, } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }

  render() {
    return (
      <Router>
        <div className="container">
          <div className="menu-container">
          <List component="nav">
            <ListItemLink to="/" primary="ホーム" icon={<InboxIcon />} onClick={e => this.handleMenuItemClick(0)} selected={this.state.selectedIndex === 0} />
            <ListItemLink to="/hello" primary="hello" icon={<DraftsIcon />} onClick={e => this.handleMenuItemClick(1)} selected={this.state.selectedIndex === 1} />
          </List>
          </div>

          <div className="content">
            <Switch>
              <Route exact path="/" component={ScheduleList} />
              <Route exact path="/schedules/:scheduleId/position" component={Position} />
              <Route exact path="/hello" component={Hello} />
              <Route exact component={ScheduleList} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }

  handleMenuItemClick = index => {
    this.setState({ selectedIndex: index })
  };
}

export default App;
