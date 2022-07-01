import dayjs from '/src/utils/Dates.js'

export default {
  dateStringAbsolute(date) {
    return date ? dayjs(date).format('D MMMM<br>HH:mm') : null;
  },

  dateStringRelative(date) {
    return date ? dayjs(date).format('dddd<br>') + dayjs(date).fromNow() : null;
  },


  notNull(item, value, defaultValue = '') {
    if (value) {
      return item ? value : defaultValue;
    } else {
      return item ? item : defaultValue;
    }
  },

  fillDefaults(incomingObject = {}, defaultObject = {}) {
    let result = Object(defaultObject);

    for (const key in incomingObject) {
      result[key] = incomingObject[key];
    }

    return result;
  },
};