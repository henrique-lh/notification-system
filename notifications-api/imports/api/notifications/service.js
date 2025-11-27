import { NotificationsRepository } from "./repository.js";
import { Env } from "/config/env.js";

export const NotificationsService = {
  async create(data) {
    return await NotificationsRepository.create(data);
  },

  async listByUser(userId, page, pageSize) {
    const defaultPageSize = parseInt(Env.getOrDefault("DEFAULT_PAGE_SIZE", 20));
    const maxPageSize = parseInt(Env.getOrDefault("MAX_PAGE_SIZE", 100));
    const size = Math.min(pageSize || defaultPageSize, maxPageSize);

    const [data, total] = await Promise.all([
      NotificationsRepository.listByUser(userId, page, size),
      NotificationsRepository.countByUser(userId)
    ]);

    return { data, total, page, pageSize: size };
  },

  async markAsRead(id) {
    return await NotificationsRepository.markAsRead(id);
  },

  async remove(id) {
    return await NotificationsRepository.remove(id);
  }
};
