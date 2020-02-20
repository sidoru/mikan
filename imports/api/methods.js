import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Schedules } from './collections.js';
import moment from 'moment';

Meteor.methods({
  'schedules.insert'(executionDate, description) {
    const schedule = {
      executionDate: new Date(executionDate),
      description,
      createAt: new Date(),
      updateAt: new Date(),
      positions: null,
    };

    Schedules.insert(schedule);
  },

  'schedules.update'(id, executionDate, description) {
    const row = {
      executionDate: new Date(executionDate),
      description,
      updateAt: new Date(),
    };

    Schedules.update(id, { $set: row });
  },

  'schedules.updatePosition'(scheduleId, positions) {
    const schedule = {
      positions,
      updateAt: new Date(),
    };

    Schedules.update(scheduleId, { $set: schedule });
  },
})