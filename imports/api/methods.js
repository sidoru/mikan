import { Meteor } from 'meteor/meteor';
import { Schedules } from './collections.js';

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
    console.log(schedule);
  },

  'schedules.delete'(id) {
    Schedules.remove(id);
  },
})