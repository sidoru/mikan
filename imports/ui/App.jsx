import React, { Component } from 'react';
import Position from './Position.jsx';
import PositionList from './PositionList.jsx';
import Hello from './Hello.jsx';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';

class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
      <Switch>
        <Route exact path="/" component={PositionList}/>
        <Route exact path="/position/:id" component={Position}/>
        <Route exact path="/hello" component={Hello}/>
      </Switch>
    </Router>
    );
  }
}

export default App;
