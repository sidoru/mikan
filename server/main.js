import { Meteor } from 'meteor/meteor';
import Positions from '../imports/api/positions';

function insertLink(title, url) {
  Links.insert({ title, url, createdAt: new Date() });
}

Meteor.startup(() => {
  Positions.remove({});
});
