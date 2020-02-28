import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Schedules } from './collections.js';

Meteor.publish("schedules", () => Schedules.find({}));

Meteor.publish("schedule", id => Schedules.find({ _id: id }));