import { NotificationsService } from "./service.js";

export const NotificationsController = {
  async create(req, res) {
    const { userId, title, message } = req.body;

    if (!userId || !title || !message) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Missing fields" }));
    }

    const result = await NotificationsService.create({ userId, title, message });

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  },

  async list(req, res) {
    const userId = req.params.userId;
    const page = parseInt(req.query.page || "1");
    const pageSize = parseInt(req.query.pageSize || "20");

    const result = await NotificationsService.listByUser(userId, page, pageSize);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  },

  async markAsRead(req, res) {
    const result = await NotificationsService.markAsRead(req.params.id);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  },

  async remove(req, res) {
    const result = await NotificationsService.remove(req.params.id);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  }
};
