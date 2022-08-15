import App from "/src/App.js";
import Utils from "./Utils.js";

export default {
  settings: {
    /* General */
    extendedMath: false,  // TODO: unimplemented
    vibrateOnTap: true,   // TODO: unimplemented
    enableVizAuv: true,   // TODO: unimplemented
    extendedTelemetry: false, // TODO: unimplemented

    /* Special */
    interpreterContextInterval: 100,    // TODO: unimplemented
    interpreterHighlightInterval: 100,  // TODO: unimplemented
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
      let settings = JSON.parse(localStorage.settings)
      this.settings = Utils.fillDefaults(settings, this.settings);
    } catch (error) {

    }

    this.save();
  },

  onSettingsChanged() {
    // TODO //
  }
}