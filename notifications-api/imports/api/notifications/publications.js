import { Meteor } from "meteor/meteor";
import { Notifications } from "./collection.js";

Meteor.publish("notifications.all", function () {
  if (!this.userId) {
    return this.ready();
  }

  return Notifications.find(
    { userId: this.userId, deletedAt: null },
    {
      sort: { createdAt: -1 },
      limit: 50,
      fields: {
        userId: 1,
        title: 1,
        body: 1,
        readAt: 1,
        createdAt: 1,
      },
    }
  );
});
