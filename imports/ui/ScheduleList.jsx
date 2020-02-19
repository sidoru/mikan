import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import moment from 'moment';
import Moment from 'react-moment';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/Inbox';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { Schedules } from '../api/collections';
import ListItemLink from './ListItemLink.jsx';

class ScheduleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      executionDate: new moment().format("YYYY-MM-DD"),
    };
  }

  render() {
    const schedules = this.props.schedules ? this.props.schedules : [];

    return (
      <div>
        <div>yotei</div>
        <form onSubmit={e => this.handleAddPosition(e)}>
          <input type="date" onChange={e => this.setState({ executionDate: e.target.value })} value={this.state.executionDate} required />
          <input type="text" onChange={e => this.setState({ name: e.target.value })} value={this.state.name} />
          <input type="submit" value="予定追加" />
        </form>
        <ul>
          {schedules.map(this.renderSchedule)}
        </ul>
        <List component="nav" style={{width:"70%"}}>
          {schedules.map((schedule, index) =>
            <ListItem key={index} alignItems="flex-start">
            <ListItemAvatar>
                  <ImageIcon />
            </ListItemAvatar>
            <ListItemText
              primary={<Moment format="MM月DD日">{schedule.executionDate}</Moment>} 
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    style={{display: "inline"}}
                    color="textPrimary"
                  >
                    {schedule.name}
                  </Typography>
                  
                  {' — Do you have Paris recommendations? Have you ever…'}
                  
                </React.Fragment>
              }
            />
            
                  <ListItemSecondaryAction>
        <IconButton aria-label="delete" size="small">
          <ArrowDownwardIcon fontSize="inherit" />
        </IconButton>
        </ListItemSecondaryAction>
          </ListItem>
          )}
        </List>
      </div>
    );
  }

  renderSchedule(schedule, index) {
    return (
      <li key={index}>
        <Link to={`/schedules/${schedule._id}/position`}><Moment format="MM月DD日">{schedule.executionDate}</Moment> {schedule.name}</Link>
      </li>
    );
  }

  handleAddPosition(e) {
    e.preventDefault();

    const exeDate = new Date(this.state.executionDate);
    Meteor.call('schedules.insert', exeDate, this.state.name);
  }
}

export default withTracker(() => {
  let schedules;
  if (Meteor.subscribe('schedules').ready()) {
    schedules = Schedules.find({}, { sort: [["executionDate", "desc"], ["updateAt", "desc"]] }).fetch();
  }

  return { schedules };
})(ScheduleList);