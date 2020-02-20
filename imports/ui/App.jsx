import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import Main from './Main.jsx';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Router>
          <Main />
        </Router>
      </MuiPickersUtilsProvider>
    );
  }
}

export default App;
