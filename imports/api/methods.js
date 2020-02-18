import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Schedules } from './collections.js';

Meteor.methods({
  'schedules.insert'(executionDate, name) {
    const schedule = {
      executionDate,
      name,
      updateAt: new Date(),
      positions: null,
    };

    Schedules.insert(schedule);
  },

  'schedules.update'(id, executionDate, name) {
    const row = {
      executionDate,
      name,
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