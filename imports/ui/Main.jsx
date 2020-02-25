import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

import Position from './Position.jsx';
import ScheduleList from './ScheduleList.jsx';
import Hello from './Hello.jsx';
import ListItemLink from './ListItemLink.jsx';
import Login from './Login.jsx';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      isAuthenticated: Meteor.userId() !== null,
    };

    this.redirectLogin();
  }

  componentDidUpdate(prevProps, prevState) {
    this.redirectLogin();
  }

  render() {
    const Menu = props =>
      <div className="menu-container">
        <List component="nav">
          <ListItemLink to="/" primary="ホーム" icon={<InboxIcon />} onClick={e => this.handleMenuItemClick(0)} selected={this.state.selectedIndex === 0} />
          <ListItemLink to="/hello" primary="hello" icon={<DraftsIcon />} onClick={e => this.handleMenuItemClick(1)} selected={this.state.selectedIndex === 1} />
          <ListItem button onClick={e => { this.logout(e); this.handleMenuItemClick(2); }} selected={this.state.selectedIndex === 2}>
            <ListItemIcon>
              <InboxIcon style={{ color: '#FFFFFF' }} />
            </ListItemIcon>
            <ListItemText style={{ color: '#FFFFFF' }} primary="ログアウト" />
          </ListItem>
        </List>
      </div>
      ;
    const Content = props =>
      <div className="content">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={ScheduleList} />
          <Route exact path="/schedules/:scheduleId/position" component={Position} />
          <Route exact path="/hello" component={Hello} />

          <Route exact component={ScheduleList} />
        </Switch>
      </div>
      ;

    if (Meteor.userId() !== null) {
      return (
        <div className="container">
          <Menu />
          <Content />
        </div>
      );
    } else {
      return (
        <div className="container">
          <Content />
        </div>
      );
    }
  }

  handleMenuItemClick = index => {
    this.setState({ ...this.state, selectedIndex: index })
  };

  logout(e) {
    e.preventDefault();
    Meteor.logout((err) => {
      if (err) {
        console.log(err.reason);
      } else {
        this.setState({ ...this.state, isAuthenticated: false })
        this.props.history.push('/login');
      }
    });
  }

  redirectLogin() {
    const pathname = this.props.history.location.pathname;
    if (Meteor.userId() === null && pathname != "/login") {
      this.props.history.push("/login", { referrer: pathname } );
    }
  }
}

export default withRouter(Main);
