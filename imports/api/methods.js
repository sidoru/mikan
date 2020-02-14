import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Positions } from './collections.js';

Meteor.methods({
  'positions.insert'(executionDate, name) {
    position = {
      executionDate,
      name,
      updateAt: new Date(),
    };

    Positions.insert(position);
  },

  'positions.update'(id, executionDate, name) {
    position = {
      executionDate,
      name,
      updateAt: new Date(),
    };

    Positions.update(id, { $set: position });
  },

  'positions.updatePositions'(id, positions) {
    position = {
      positions,
      updateAt: new Date(),
    };

    Positions.update(id, { $set: position });
  },
})