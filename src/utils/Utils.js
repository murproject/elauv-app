import dayjs from '/src/utils/Dates.js'

export default {
  dateStringAbsolute(date, multiline = false) {
    return date ? dayjs(date).format(`D MMMM${multiline ? '<br>' : ' YYYY, '}HH:mm`) : null;
  },

  dateStringRelative(date, multiline = false) {
    return date ? dayjs(date).format(`dddd${multiline ? '<br>' : ', '}`) + dayjs(date).fromNow() : null;
  },


  notNull(item, defaultValue = '') {
    return item ? item : defaultValue;
  },

  fillDefaults(incomingObject = {}, defaultObject = {}) {
    let result = Object(defaultObject);

    for (const key in incomingObject) {
      result[key] = incomingObject[key];
    }

    return result;
  },

  generateId() {
    return (+new Date()).toString(36) + Math.random().toString(36).substring(1);
  }
};