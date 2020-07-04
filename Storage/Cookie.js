/**
 * cookie
 * @type {{set: Cookie.set, get: Cookie.get, clear: Cookie.clear}}
 */
const Cookie = {
  set: (key, value, expireDays) => {
    const date = new Date();
    expireDays = expireDays || 0;
    date.setDate(date.getDate() + expireDays);
    document.cookie = `${key}=${encodeURIComponent(value)}${expireDays > 0 ? ';expires=' + date.toGMTString() : ''};path=/`;
  },
  get: (key) => {
    const reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
    const arr = document.cookie.match(reg);
    if (arr) {
      return decodeURIComponent(arr[2]);
    }
    return '';
  },
  clear: (key) => {
    Cookie.set(key, '', -1);
  },
};

export default Cookie;
