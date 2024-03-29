import App from '/src/App.js';
import Utils from './Utils.js';

export default {
  settings: {
    /* General */
    vibrateOnTap: true,
    enableVizAuv: true,
    extendedMath: false, // TODO: use extended math setting (setting is unimplemented)
    extendedTelemetry: false,
  },

  set(name, value) {
    this.settings[name] = value;
    this.save();
    this.onSettingsChanged();
  },

  get(name) {
    return this.settings[name];
  },

  save() {
    localStorage.settings = JSON.stringify(this.settings);
  },

  load() {
    try {
      const settings = JSON.parse(localStorage.settings);
      this.settings = Utils.fillDefaults(settings, this.settings);
    } catch (error) {

    }

    this.save();
  },

  onSettingsChanged() {},
};
