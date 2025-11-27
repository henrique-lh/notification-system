import "../../api/notifications/methods.js";
import "../../api/notifications/routes.js";
import "../../api/notifications/publications.js";

import { Env } from "/config/env.js";
import { WebApp } from "meteor/webapp";

WebApp.connectHandlers.use((req, res, next) => {
  const origin = req.headers.origin || '*'

  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  next()
})

Meteor.startup(() => {
  console.log("[Config] DEFAULT_PAGE_SIZE:", Env.getOrDefault("DEFAULT_PAGE_SIZE", 20));
  console.log("[Config] MAX_PAGE_SIZE:", Env.getOrDefault("MAX_PAGE_SIZE", 100));
  console.log("[Config] Notifications Enabled:", Env.getOrDefault("FEATURE_NOTIFICATIONS_ENABLED", "true"));
});
