import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Main from './Main.jsx';

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
