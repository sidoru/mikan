import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Positions, Schedules } from './collections.js';

Meteor.methods({
  'schedules.insert'(executionDate, name) {
    const row = {
      executionDate,
      name,
      updateAt: new Date(),
      positionId: null,
    };

    Schedules.insert(row);
  },

  'schedules.update'(id, executionDate, name) {
    const row = {
      executionDate,
      name,
      updateAt: new Date(),
    };

    Positions.update(id, { $set: row });
  },

  'schedules.getPosition'(scheduleId) {
    const schedule = Schedules.findOne({ _id: scheduleId });
    if(schedule.positionId != null){
      return Positions.find({ _id: schedule.positionId });
    }else{
      return null;
    }
  },

  'schedules.savePosition'(scheduleId, positions) {
    console.log("savePosition " + scheduleId);
    const schedule = Schedules.findOne({ _id: scheduleId });
    if (schedule != null) {
      const position = {
        positions,
        updateAt: new Date(),
      };

      const positionId = Positions.insert(position);
      Schedules.update(scheduleId, { $set: { positionId } });

      if (schedule.positionId != null) {
        Positions.remove({ _id: schedule.positionId })
      }
    } else {
      console.log("naiyanke");
    }
  },
})