import { Meteor } from 'meteor/meteor';
import { Positions } from '../imports/api/collections';
import '../imports/api/methods';

Meteor.startup(() => {
  Positions.remove({});
});
