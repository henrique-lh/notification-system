import "../imports/startup/server";
import { Meteor } from "meteor/meteor";
import "../imports/api/notifications/methods";
import "../imports/api/notifications/publications";


Meteor.startup(() => {
console.log("Server started.");
});