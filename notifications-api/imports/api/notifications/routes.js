import { WebApp } from "meteor/webapp";
import bodyParser from "body-parser";
import { NotificationsController } from "./controller.js";

// CORS middleware for the notifications API. Adjust the allowed origin if your
// frontend runs on a different host/port. We also handle OPTIONS preflight here.
WebApp.connectHandlers.use("/api/notifications", (req, res, next) => {
  // Use a specific origin in production; for local dev we allow the Vite origin
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Allow credentials if you need cookies/auth headers (adjust on both sides)
  // res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    // Preflight request — respond immediately
    res.writeHead(204);
    return res.end();
  }

  return next();
});

WebApp.connectHandlers.use("/api/notifications", bodyParser.json());

WebApp.connectHandlers.use("/api/notifications", (req, res, next) => {
  const { method, url } = req;

  if (method === "POST" && (url === "/" || url === "")) {
    return NotificationsController.create(req, res);
  }

  if (method === "GET" && url.startsWith("/user/")) {
    const userId = url.split("/")[2];
    req.params = { userId };
    return NotificationsController.list(req, res);
  }

  if (method === "PATCH" && url.endsWith("/read")) {
    const id = url.split("/")[1];
    req.params = { id };
    return NotificationsController.markAsRead(req, res);
  }

  if (method === "DELETE") {
    const id = url.split("/")[1];
    req.params = { id };
    return NotificationsController.remove(req, res);
  }

  return next();
});
