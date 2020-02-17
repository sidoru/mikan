import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Positions, Schedules } from './collections.js';

Meteor.publish("schedules", () => Schedules.find({}));

Meteor.publish("schedulePosition", scheduleId => {
  console.log("schedulePosition kita " + scheduleId);
  const schedule = Schedules.findOne({ _id: scheduleId });
  let postion;
  if (schedule != null && schedule.positionId != null) {
    postion = Positions.find({ _id: schedule.positionId });
  }

  return postion;
});