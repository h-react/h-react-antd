import nanoid from 'nanoid';

const Auth = {
  user_id: '_HU1359',
  account: '_IDT4425',
  remember: '_REB1873',
  loginPath: '/sign/in',
  apiUrl: null,
  /**
   * 设置登录路径
   * @returns {*|string}
   */
  setLoginUrl: (path) => {
    Auth.loginPath = path;
  },
  /**
   * 获取登录路径
   * @returns {*|string}
   */
  getLoginUrl: () => {
    return Auth.loginPath;
  },
  /**
   * 设置Api网址
   * @returns {*|string}
   */
  setApiUrl: (u) => {
    Auth.apiUrl = u;
  },
  /**
   * 获取Api网址
   * @returns {*|string}
   */
  getApiUrl: () => {
    return Auth.apiUrl;
  },
  /**
   * 获取客户端ID
   */
  getClientId: () => {
    if (localStorage.cid === undefined) {
      localStorage.cid = nanoid(42) + (new Date()).getTime().toString(36);
    }
    return localStorage.cid;
  },
  /**
   * 记住账号
   * @returns {*|string}
   */
  getAccount: () => {
    return localStorage[Auth.account];
  },
  setAccount: (val) => {
    localStorage[Auth.account] = val;
  },
  /**
   * 是否记住账号
   * @returns {*|string}
   */
  getRemember: () => {
    return localStorage[Auth.remember] === '1';
  },
  setRemember: (val) => {
    localStorage[Auth.remember] = val;
  },
  /**
   * 用户ID
   * @returns {*|string}
   */
  getUserId: () => {
    return localStorage[Auth.user_id];
  },
  setUserId: (val) => {
    localStorage[Auth.user_id] = val;
  },
  clearUid: () => {
    localStorage[Auth.user_id] = '';
  },
  /**
   * 登录检验
   * @returns {boolean}
   */
  isOnline: () => {
    let is = false;
    if (Auth.getUserId() && Auth.getUserId().length > 0) {
      is = true;
    }
    return is;
  },
};

export default Auth;
