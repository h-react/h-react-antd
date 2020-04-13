const Parse = {

  /**
   * 获取react，url搜索参数
   * @param props
   * @returns {{}}
   */
  urlSearch: (props) => {
    let search = props.location.search;
    if (!search) {
      return {};
    }
    search = search.split('?')[1];
    search = search.split('&');
    const params = {};
    search.forEach((v) => {
      v = v.split('=');
      const n = Number(v[1]);
      params[v[0]] = !isNaN(n) ? n : v[1];
    });
    return params;
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
    if (param == null) return '';
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

};

export default Parse;
