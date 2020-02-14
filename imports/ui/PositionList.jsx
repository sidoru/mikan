import React, { Component } from 'react';
import moment from 'moment';
import Moment from 'react-moment';
import { withTracker } from 'meteor/react-meteor-data';
import { Positions } from '../api/collections';

class PositionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      executionDate: new moment().format("YYYY-MM-DD"),
    };
  }

  render() {
    const positions = this.props.positions ? this.props.positions : [];

    console.log("render");
    console.log(positions);
    
    return (
      <div>
        <div>position list</div>
        <form onSubmit={e => this.handleAddPosition(e)}>
          <input type="date" onChange={e => this.setState({ executionDate: e.target.value })} value={this.state.executionDate} required />
          <input type="text" onChange={e => this.setState({ name: e.target.value })} value={this.state.name} required />
          <input type="submit" value="Add" />
        </form>
        <ul>
          {positions.map(this.renderPosition)}
        </ul>
      </div>
    );
  }

  renderPosition(position, index) {
    return (
      <li key={index}>
        <a href={`position/${position._id}`}><Moment format="YYYY/MM/DD">{position.executionDate}</Moment> {position.name}</a>
      </li>
    );
  }

  handleAddPosition(e) {
    e.preventDefault();

    const exeDate= new Date(this.state.executionDate);
    Meteor.call('positions.insert', exeDate, this.state.name);
  }
}

export default withTracker(() => {
  return {
    positions: Positions.find({}, { sort: [["executionDate", "desc"]] }).fetch(),
  };
})(PositionList);