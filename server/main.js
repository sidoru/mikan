import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

import { Positions } from '../imports/api/collections';
import '../imports/api/methods';
import '../imports/api/publishes';

Meteor.startup(() => {
  if(Meteor.users.find().count() == 0){
    let username = process.env.AUTH_USERNAME;
    let password = process.env.AUTH_PASSWORD;
    if (username === undefined) {
      username = "user";
      password = "pass";
    }
  
    const id = Accounts.createUser({username, password});
    console.log("id = " + id);
  }

  //Meteor.users.remove({});  
  //Positions.remove({});
});
