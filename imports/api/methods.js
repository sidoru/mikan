import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Schedules } from './collections.js';

Meteor.methods({
  'user.login'(userName, password) {
    // basicちゃうけどな
    let authUserName = process.env.BASIC_AUTH_USERNAME;
    let authPassword = process.env.BASIC_AUTH_PASSWORD;
    if (authUserName === null) {
      authUserName = "user";
      authPassword = "pass";
    }

    return userName === authUserName && password === authPassword;
  },

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