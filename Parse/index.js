const ParseCache = {};

const Parse = {

  /**
   * 获取pathname
   * @returns {{}}
   */
  urlDispatch: (location) => {
    location = location || window.location.href;
    const url = location.replace(window.location.protocol + '//' + window.location.host, '').replace('/#', '');
    const dispatch = url.split('?')
    let pathname = dispatch[0];
    const searchStr = dispatch[1] || '';
    const search = {};
    if (searchStr !== '') {
      let searchArr = searchStr.split('&');
      searchArr.forEach((v) => {
        v = decodeURIComponent(v)
        v = v.split('=');
        const n = Number(v[1]);
        search[v[0]] = !isNaN(n) ? n : v[1];
      });
    }
    return {
      url: url,
      pathname: pathname,
      search: search,
    };
  },

  /**
   * 获取url pathName
   * @returns string
   */
  urlPathName: () => {
    return Parse.urlDispatch().pathname;
  },

  /**
   * 获取url搜索参数
   * @returns {{}}
   */
  urlSearch: () => {
    return Parse.urlDispatch().search;
  },

  /**
   * 参数转url
   * @param param
   * @param key
   * @param encode
   * @param paramStr
   * @returns {string}
   */
  urlEncode: (param, key = null, encode = null, paramStr = '') => {
    if (!param) return paramStr;
    let t = typeof (param);
    if (t === 'string' || t === 'number' || t === 'boolean') {
      paramStr += paramStr === '' ? '?' : '&';
      paramStr += (key ? key : '') + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
      for (let i in param) {
        const k = !key ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
        paramStr = Parse.urlEncode(param[i], k, encode, paramStr);
      }
    }
    return paramStr;
  },

  cleanHTML: (txt) => {
    return txt.replace(/\s/g, "")
      .replace('\t', "")
      .replace('\n', "")
      .replace('\r', "")
      .replace(/(<([^>]+)>)/ig, "")
      .replace(/&.*?;/ig, "");
  },

  limitStr: (txt, len) => {
    let strLen = 0;
    let s = "";
    for (let i = 0; i < txt.length; i++) {
      if (txt.charCodeAt(i) > 128) {
        strLen += 2;
      } else {
        strLen++;
      }
      s += txt.charAt(i);
      if (strLen >= len) {
        return s + "...";
      }
    }
    return s;
  },

  /**
   * antd mapping value转文本
   * @param map
   * @param value
   * @param cacheKey 缓存key，效率增加
   * @returns {string|*}
   */
  mapLabel: (map, value, cacheKey = null) => {
    if (!map || !value) {
      return '';
    }
    if (cacheKey) {
      if (ParseCache[cacheKey]) {
        if (ParseCache[cacheKey][value]) {
          return ParseCache[cacheKey][value];
        }
      } else {
        ParseCache[cacheKey] = {};
      }
    }
    let res = '';
    for (const k in map) {
      if (cacheKey) ParseCache[cacheKey][map[k].value] = map[k].label;
      if (map[k].value === value) {
        res = map[k].label;
        if (!cacheKey) break;
      }
    }
    return res;
  },

  /**
   * antd mapping label转value
   * @param map
   * @param label
   * @param cacheKey 缓存key，效率增加
   * @returns {string}
   */
  mapValue: (map, label, cacheKey = null) => {
    if (!map || !label) {
      return '';
    }
    if (cacheKey) {
      if (ParseCache[cacheKey]) {
        if (ParseCache[cacheKey][label]) {
          return ParseCache[cacheKey][label];
        }
      } else {
        ParseCache[cacheKey] = {};
      }
    }
    let res = '';
    for (const k in map) {
      if (cacheKey) ParseCache[cacheKey][map[k].label] = map[k].value;
      if (map[k].label === label) {
        res = map[k].value;
        if (!cacheKey) break;
      }
    }
    return res;
  },

  /**
   * 隐藏字符串
   * str 目标串
   * head 开头显示几位
   * tail 结尾显示几位
   */
  hideString: (str, head, tail) => {
    if (!str) {
      return '*****';
    }
    if (str.length < 5) {
      return str.substr(0, 1) + '****';
    }
    if (head + tail >= str.length) {
      head = tail = Math.floor(str.length / 2 - 1);
    }
    const midLen = str.length - head - tail;
    let res = str.substr(0, head);
    for (let i = 0; i < midLen; i += 1) {
      res += '*';
    }
    res += str.substr(-tail, tail);
    return res;
  },

  /**
   * 比较两个值的大小
   * data1 > data2返回 1
   * data1 < data2返回 -1
   * data1 = data2返回 0
   * @param data1
   * @param data2
   */
  isBigger: (data1, data2) => {
    // 处理undefined/null 设为 0
    if (data1 === undefined || data1 === null) data1 = 0;
    if (data2 === undefined || data2 === null) data2 = 0;
    // 处理布尔 true -> 1 false -> 0
    if (typeof data1 === 'boolean') data1 = data1 ? 1 : 0;
    if (typeof data2 === 'boolean') data2 = data2 ? 1 : 0;
    // 数字间比较
    if (typeof data1 === 'number' && typeof data2 === 'number') {
      if (parseFloat(data1) > parseFloat(data2)) {
        return 1;
      } else if (parseFloat(data1) < parseFloat(data2)) {
        return -1;
      }
      return 0;
    }
    // 有一方为对象，认为对象较大，都为对象则相等
    if (typeof data1 === 'object' && typeof data2 === 'object') {
      return 0;
    } else if (typeof data1 === 'object' && typeof data2 !== 'object') {
      return 1;
    } else if (typeof data1 !== 'object' && typeof data2 === 'object') {
      return -1;
    }
    // 有一方为函数，认为函数较大，都为函数则相等
    if (typeof data1 === 'function' && typeof data2 === 'function') {
      return 0;
    } else if (typeof data1 === 'function' && typeof data2 !== 'function') {
      return 1;
    } else if (typeof data1 !== 'function' && typeof data2 === 'function') {
      return -1;
    }
    // 有一方为字符串，两个值都以ascii码对比
    if (typeof data1 === 'string' || typeof data2 === 'string') {
      data1 = data1.toString();
      data2 = data2.toString();
      let i = 0;
      let result = 0;
      while (i < data1.length && i < data1.length && result === 0) {
        const char1 = data1.charCodeAt(i);
        const char2 = data2.charCodeAt(i);
        if (char1 > char2) {
          result = 1;
        } else if (char1 < char2) {
          result = -1;
        }
        i += 1;
      }
      return result;
    }
  },

  /**
   * json decode
   * @param data
   * @returns {object}
   */
  jsonDecode: (data) => {
    return JSON.parse(data);
  },
  /**
   * json encode
   * @param json
   * @returns {string}
   */
  jsonEncode: (json) => {
    return JSON.stringify(json);
  },

  /**
   * 多位数四舍五入
   * @param num
   * @param v
   * @returns {number}
   */
  decimal: (num, v) => {
    const vv = Math.pow(10, v);
    const result = Math.round(num * vv) / vv;
    return isNaN(result) ? 0 : parseFloat(result.toFixed(v));
  },

  /**
   * 随机整数
   * @param min
   * @param max
   * @returns {number}
   */
  randInt: (min, max) => {
    return parseInt(Math.random() * (max - min + 1) + min, 10);
  },

  /**
   * 数组洗牌
   * @returns {Parse}
   */
  shuffle: function (a) {
    const arr = JSON.parse(JSON.stringify(a));
    let m = arr.length, i;
    while (m) {
      i = (Math.random() * m--) >>> 0;
      [arr[m], arr[i]] = [arr[i], arr[m]]
    }
    return arr;
  },

  /**
   * 生成序列
   * @param start 开始数字
   * @param end 结束数字
   * @param step 间隔数值
   * @returns []
   */
  sequence: function (start, end, step = 1) {
    const arr = [];
    while (start <= end) {
      arr.push(start);
      start += step;
    }
    return arr;
  },

  objGet: (obj, key, sep = '.', callValue) => {
    const kArr = key.split(sep);
    let tar = obj;
    let res = null;
    for (const k in kArr) {
      if (tar[kArr[k]] === undefined) {
        res = null;
        break;
      } else {
        res = tar[kArr[k]];
        tar = tar[kArr[k]];
      }
    }
    if (res === null && typeof callValue === 'function') {
      res = callValue();
    }
    return res;
  },

  /**
   * 删除表前缀
   * @param obj
   * @param tableName
   * @returns {null|*}
   */
  removeTable: (obj, tableName) => {
    if (!obj || !tableName) {
      return obj;
    }
    let res = null;
    if (Array.isArray(obj)) {
      res = [];
      obj.forEach((v) => {
        let r = {};
        for (let i in v) {
          r[i.replace(tableName, '')] = v[i];
        }
        res.push(r);
      });
    } else if (typeof obj === 'object') {
      res = {};
      for (let i in obj) {
        res[i.replace(tableName, '')] = obj[i];
      }
    }
    return res;
  }

};

export default Parse;
