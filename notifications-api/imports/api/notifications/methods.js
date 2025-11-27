import { Meteor } from "meteor/meteor";
import {
  createNotificationController,
  listNotificationsController,
  getNotificationController,
  deleteNotificationController,
} from "./controller.js";

Meteor.methods({
  "notifications.create"(payload) {
    return createNotificationController(payload);
  },

  "notifications.list"() {
    return listNotificationsController();
  },

  "notifications.get"(id) {
    return getNotificationController(id);
  },

  "notifications.delete"(id) {
    return deleteNotificationController(id);
  },
});
