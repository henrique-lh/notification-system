import { Notifications } from "./collection.js";

export const NotificationsRepository = {
  async create(data) {
    const id = await Notifications.insertAsync({
      ...data,
      read: false,
      deleted: false,
      createdAt: new Date(),
    });
    return Notifications.findOneAsync(id);
  },

  async listByUser(userId, page, pageSize) {
    const skip = (page - 1) * pageSize;

    const cursor = Notifications.find(
      { userId, deleted: false },
      { skip, limit: pageSize, sort: { createdAt: -1 } }
    );

    return cursor.fetch();
  },

  async countByUser(userId) {
    return Notifications.find({ userId, deleted: false }).countAsync();
  },

  async markAsRead(id) {
    await Notifications.updateAsync(id, { $set: { read: true } });
    return Notifications.findOneAsync(id);
  },

  async remove(id) {
    await Notifications.updateAsync(id, { $set: { deleted: true } });
    return { success: true };
  }
};
