import React, { Component } from 'react';
import moment from 'moment';
import Moment from 'react-moment';
import { withTracker } from 'meteor/react-meteor-data';
import { Schedules } from '../api/collections';
import { Link } from 'react-router-dom';

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
        <div>position list</div>
        <form onSubmit={e => this.handleAddPosition(e)}>
          <input type="date" onChange={e => this.setState({ executionDate: e.target.value })} value={this.state.executionDate} required />
          <input type="text" onChange={e => this.setState({ name: e.target.value })} value={this.state.name} required />
          <input type="submit" value="Add" />
        </form>
        <ul>
          {schedules.map(this.renderSchedule)}
        </ul>
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