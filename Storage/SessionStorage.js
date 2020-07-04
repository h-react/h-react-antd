/**
 * SessionStorage
 */
const SessionStorage = {
  set: (key, value) => {
    sessionStorage.setItem(key, JSON.stringify({v: value}));
  },
  get: (key) => {
    let item = sessionStorage.getItem(key)
    try {
      item = JSON.parse(item);
      return item.v;
    } catch (error) {
      // default value
    }
    return item;
  },
  clear: (key) => {
    sessionStorage.setItem(key, null);
  },
  clearAll: () => {
    sessionStorage.clear();
  },
};

export default SessionStorage;
