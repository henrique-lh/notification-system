import { Notifications } from "/imports/api/notifications/collection.js";

export async function resetDatabase() {
  await Notifications.removeAsync({});
}
