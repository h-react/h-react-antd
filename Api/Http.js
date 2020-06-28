import {message} from 'antd';
import axios from 'axios';
import {Auth, Path, Parse, I18n} from 'h-react';
import Crypto from './Crypto';

const ApiSave = (key, res) => {
  try {
    localStorage[key] = Parse.jsonEncode(res);
    localStorage[`${key}#EX`] = (new Date()).getTime() + 6e4;
  } catch (e) {
    localStorage.clear();
  }
};
const ApiLoad = (key) => {
  if (localStorage[`${key}#EX`] === undefined || localStorage[`${key}#EX`] < (new Date()).getTime()) {
    localStorage[key] = null;
  }
  return localStorage[key] ? Parse.jsonDecode(localStorage[key]) : null;
};

/**
 * api 请求
 * @param scope
 * @param params
 * @param then
 * @param refresh
 * @constructor
 */
const Http = {
  CacheKeyLimit: 3000,
  PathLogin: null,
  cache: (conf) => {
    if (typeof conf.scope === 'string') {
      Http.run(conf, false);
    } else {
      message.error(I18n('SCOPE_ERROR'));
    }
  },
  real: (conf) => {
    if (typeof conf.scope === 'string') {
      Http.run(conf, true);
    } else {
      message.error(I18n('SCOPE_ERROR'));
    }
  },
  run: (conf, refresh) => {
    const host = conf.host || null;
    const scope = conf.scope || null;
    const params = conf.params || {};
    const then = conf.then || function () {
    };
    const crypto = conf.crypto || null;
    const header = conf.header || {};
    const queryType = conf.queryType || 'post';
    refresh = typeof refresh === 'boolean' ? refresh : false;
    params.auth_user_id = Auth.getUserId();
    const key = scope + Parse.jsonEncode(params);
    if (refresh === false && key.length < Http.CacheKeyLimit && ApiLoad(key) !== null) {
      then(ApiLoad(key));
      return;
    }
    let axiosData = null;
    let axiosParams = null;
    if (queryType === 'get') {
      axiosParams = {client_id: Auth.getClientId(), scope: scope, ...params};
    } else {
      axiosData = Crypto.encode({client_id: Auth.getClientId(), scope: scope, ...params}, crypto);
    }
    axios({
      method: queryType,
      url: host,
      data: axiosData,
      params: axiosParams,
      config: header
    })
      .then((response) => {
        if (Crypto.is(crypto)) {
          response.data = Crypto.decode(response.data, crypto);
        }
        if (typeof response.data === 'object') {
          if (typeof response.data.code === 'number' && response.data.code === 403) {
            if (Auth.getUserId() !== undefined) {
              message.error(I18n('LOGIN_TIMEOUT'), 2.00, () => {
                Path.locationTo(Http.PathLogin);
              });
            }
            then({code: 500, msg: I18n('LIMITED_OPERATION'), data: null});
            return;
          }
          if (response.data.msg && response.data.msg !== '') {
            response.data.msg = I18n(response.data.msg)
          }
          then(response.data);
          if (refresh === false && typeof response.data.code === 'number' && response.data.code === 200 && key.length < Http.CacheKeyLimit) {
            ApiSave(key, response.data);
          }
        } else {
          then({code: 500, msg: I18n('API_ERROR'), data: null});
        }
      })
      .catch((error) => {
        const status = (error.response && error.response.status) ? error.response.status : -1;
        switch (status) {
          case 400:
            error.message = I18n('API_ERROR_QUERY');
            break;
          case 401:
            error.message = I18n('API_ERROR_NOT_AUTH');
            break;
          case 403:
            error.message = I18n('API_ERROR_REJECT');
            break;
          case 404:
            error.message = I18n('API_ERROR_ABORT');
            break;
          case 408:
            error.message = I18n('API_ERROR_TIMEOUT');
            break;
          case 500:
            error.message = I18n('API_ERROR_SERVER');
            break;
          case 501:
            error.message = I18n('API_ERROR_NOT_SERVICE');
            break;
          case 502:
            error.message = I18n('API_ERROR_NET');
            break;
          case 503:
            error.message = I18n('API_ERROR_SERVICE_DISABLE');
            break;
          case 504:
            error.message = I18n('API_ERROR_NET_TIMEOUT');
            break;
          case 505:
            error.message = I18n('API_ERROR_NOT_SUPPORT_HTTP');
            break;
          default:
            console.error(error.message);
            error.message = I18n('API_ERROR_DEFAULT') + `(${status}):` + error.message;
        }
        then({code: status, msg: error.message, data: null});
      });
  },
};

export default Http;
