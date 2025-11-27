export const NotificationErrors = {
  FeatureDisabled: class extends Error {
    constructor() {
      super("Notifications feature is disabled");
      this.status = 503;
    }
  },

  UserLimitExceeded: class extends Error {
    constructor(limit) {
      super(`User has reached the maximum number of notifications (${limit})`);
      this.status = 429;
    }
  },
};
