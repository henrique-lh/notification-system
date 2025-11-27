export const Env = {
  get(key) {
    if (process.env[key] !== undefined) {
      return process.env[key];
    }

    if (Meteor.settings && Meteor.settings[key] !== undefined) {
      return Meteor.settings[key];
    }

    return undefined;
  },

  getOrDefault(key, defaultValue) {
    const value = this.get(key);
    return value !== undefined ? value : defaultValue;
  }
};
