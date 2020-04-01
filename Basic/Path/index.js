const Path = {

  /**
   * 合成地址串
   * @param url
   * @param params
   * @returns {string}
   */
  combineUrl: (url, params) => {
    params = params || null;
    if (typeof url !== 'string' || url.length <= 0) {
      return '';
    }
    if (url === 'this') {
      url = location.pathname;
    }
    let paramsStr = '';
    if (params != null) {
      let key;
      for (key in params) {
        const pd = encodeURIComponent(typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key]);
        if (paramsStr === '') {
          paramsStr += `?${key}=${pd}`;
        } else {
          paramsStr += `&${key}=${pd}`;
        }
      }
    }
    return url + paramsStr;
  },
  /**
   * 跳转
   * @param location
   */
  locationTo: (location) => {
    if (location.indexOf('?') > 0) {
      location += '&_t=' + (new Date()).getTime();
    } else {
      location += '?_t=' + (new Date()).getTime();
    }
    window.location.href = location;
  },
  /**
   * 重转
   * @param location
   */
  replaceTo: (location) => {
    if (location.indexOf('?') > 0) {
      location += '&_t=' + (new Date()).getTime();
    } else {
      location += '?_t=' + (new Date()).getTime();
    }
    window.location.replace(location);
  },
  /**
   * 获取地址栏参数 _GET
   * search = this.props.location.search
   * 如果找不到 this.props.location.search 会自动读取 location.search
   */
  get: (search) => {
    if (search.length <= 0) {
      search = location.search.replace('/', '');
    }
    search = search.substr(1, search.length - 1);
    search = search.split('&');
    const params = {};
    search.forEach((s) => {
      const eq = s.split('=');
      if (eq.length === 2) {
        params[eq[0]] = decodeURIComponent(eq[1]);
      }
    });
    return params;
  },

};

export default Path;
