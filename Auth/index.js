import nanoid from 'nanoid';
import LocalStorage from './../Storage/LocalStorage';

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
    if (LocalStorage.get('cid') === null) {
      LocalStorage.set('cid', nanoid(42) + (new Date()).getTime().toString(36));
    }
    return LocalStorage.get('cid');
  },
  /**
   * 记住账号
   * @returns {*|string}
   */
  getAccount: () => {
    return LocalStorage.get(Auth.account);
  },
  setAccount: (val) => {
    LocalStorage.set(Auth.account, val)
  },
  /**
   * 是否记住账号
   * @returns {*|string}
   */
  getRemember: () => {
    return LocalStorage.get(Auth.remember) === 1;
  },
  setRemember: (val) => {
    LocalStorage.set(Auth.remember, val);
  },
  /**
   * 用户ID
   * @returns {*|string}
   */
  getUserId: () => {
    return LocalStorage.get(Auth.user_id);
  },
  setUserId: (val) => {
    LocalStorage.set(Auth.user_id, val);
  },
  clearUid: () => {
    LocalStorage.clear(Auth.user_id);
  },
  /**
   * 登录检验
   * @returns {boolean}
   */
  isOnline: () => {
    return Auth.getUserId() !== null;
  },
};

export default Auth;
