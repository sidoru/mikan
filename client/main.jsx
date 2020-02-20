import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/ui/App'

import moment from 'moment';
import 'moment/locale/ja'

moment.locale("ja");

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'));
});
