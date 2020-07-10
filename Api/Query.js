import {Auth, I18n, Parse, Path} from 'h-react';
import Crypto from "./Crypto";
import axios from "axios";
import {message} from "antd";


const ApiSocket = { /* host: obj */};
const Socket = {
  stack: {},
  stackIndex: 0,
  stackLimit: 1000,
  queue: [],
  state: {
    CONNECTING: 0, // 连接尚未建立
    OPEN: 1, // 链接已经建立
    CLOSING: 2, // 连接正在关闭
    CLOSED: 3, // 连接已经关闭或不可用
  },
  build: (conf) => {
    const host = conf.host;
    if (typeof ApiSocket[host] !== 'undefined') {
      ApiSocket[host].onopen = null;
      ApiSocket[host].onerror = null;
      ApiSocket[host].onclose = null;
      ApiSocket[host].onmessage = null;
      ApiSocket[host].close();
      ApiSocket[host] = null;
    }
    ApiSocket[host] = new WebSocket(host);
    ApiSocket[host].onopen = () => {
      console.log('connection');
      console.log((new Date()).getMinutes() + ':' + (new Date()).getSeconds());
      message.destroy();
      message.info(I18n('CONNECT_SERVER_SUCCESS'));
      if (Socket.queue.length > 0) {
        let q = Socket.queue.shift();
        while (q !== undefined) {
          ApiSocket[host].send(Crypto.encode(q, conf.crypto));
          q = Socket.queue.shift();
        }
      }
    };
    ApiSocket[host].onmessage = (msg) => {
      const result = Crypto.is(conf.crypto) ? Crypto.decode(msg.data, conf.crypto) : Parse.jsonDecode(msg.data);
      let stack = result.stack || null;
      if (stack === null) {
        message.error(I18n('STACK_ERROR'));
        return;
      }
      stack = stack.split('#STACK#');
      const stackIndex = stack[0];
      const stackKey = stack[1];
      if (typeof Socket.stack[stackIndex].then !== 'function') {
        message.error(I18n("STACK_THEN_ERROR"));
        return;
      }
      Socket.stack[stackIndex].apis[stackKey] = result;
      let totalFinish = true;
      let hasNotAuth = false;
      let response = [];
      Object.entries(Socket.stack[stackIndex].apis)
        .forEach(([key, finish]) => {
          if (finish === false) {
            totalFinish = false;
          } else {
            const res = Socket.stack[stackIndex].apis[key];
            if (typeof res === 'object') {
              if (res.msg && res.msg !== '') {
                res.msg = I18n(res.msg)
              }
              response.push(res);
              if (typeof res.code === 'number' && res.code === 403) {
                hasNotAuth = true;
              }
            } else {
              response.push({code: 500, msg: I18n('API_ERROR'), data: null});
            }
          }
        });
      if (totalFinish === true) {
        if (hasNotAuth === true) {
          if (Auth.getUserId() !== undefined) {
            message.error(I18n('LOGIN_TIMEOUT_OR_NOT_PERMISSION'), 2.00, () => {
              location.href = conf.loginUrl;
            });
          } else {
            message.warning(I18n('OPERATION_NOT_PERMISSION'));
          }
        } else {
          const then = Socket.stack[stackIndex].then;
          if (response.length === 1) {
            response = response[0];
          }
          then(response);
        }
      }
    };
    ApiSocket[host].onerror = () => {
      console.log('error');
      Socket.build(conf);
    };
    ApiSocket[host].onclose = () => {
      console.log('close');
      Socket.build(conf);
    };
  },
  send: (conf, params) => {
    const host = conf.host;
    if (ApiSocket[host] === undefined || ApiSocket[host] === null) {
      Socket.build(conf);
    }
    if (ApiSocket[host] !== null) {
      if (ApiSocket[host].readyState === Socket.state.OPEN) {
        ApiSocket[host].send(Crypto.encode(params, conf.crypto));
      } else if (ApiSocket[host].readyState === Socket.state.CONNECTING) {
        message.loading(I18n('CONNECT_SERVER_TRYING'));
        Socket.queue.push(params);
      } else if (ApiSocket[host].readyState === Socket.state.CLOSING) {
        message.warning(I18n('CONNECT_SERVER_CLOSING'));
        Socket.queue.push(params);
      } else if (ApiSocket[host].readyState === Socket.state.CLOSED) {
        message.error(I18n('CONNECT_SERVER_CLOSED'));
        Socket.queue.push(params);
      }
    } else {
      message.error(I18n("CONNECT_SERVER_COULD_NOT_ACCESS"));
      Socket.queue.push(params);
    }
  },
};

/**
 *
 * @param setting
 * @constructor
 */
const Query = function (setting) {

  this.router = setting.router;
  this.host = setting.host;
  this.crypto = setting.crypto;
  this.append = setting.append;
  this.loginUrl = (this.router.name === "BrowserRouter") ? Auth.getLoginUrl() : '/#' + Auth.getLoginUrl()

  /**
   *
   * @param params
   */
  this.appendParams = (params) => {
    if (this.append === null) {
      return;
    }
    for (let k in params) {
      for (let k2 in this.append) {
        if (typeof params[k] === 'object') {
          if (typeof params[k][k2] === "undefined") { // 不覆盖已有数据
            params[k][k2] = this.append[k2];
          }
        }
      }
      if (typeof params[k].scopes === 'object') {
        this.appendParams(params[k].scopes)
      }
    }
    return params;
  };

  /**
   * http-post
   * @param params
   * @param then
   */
  this.post = (params, then) => {
    params = this.appendParams(params);
    axios({
      method: 'post',
      url: this.host,
      data: Crypto.encode({
        client_id: Auth.getClientId(),
        scopes: params
      }, this.crypto),
      config: {}
    })
      .then((response) => {
        if (Crypto.is(this.crypto)) {
          response.data = Crypto.decode(response.data, this.crypto);
        }
        if (typeof response.data === 'object') {
          if (typeof response.data.code === 'number' && response.data.code === 444) {
            if (Auth.getUserId() !== undefined) {
              message.error(I18n('LOGIN_TIMEOUT'), 2.00, () => {
                Path.locationTo(this.loginUrl);
              });
            }
            then({code: 500, msg: I18n('LIMITED_OPERATION'), data: null});
            return;
          }
          then(response.data);
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
  };

  /**
   * websocket
   * @param params
   * @param then
   */
  this.ws = (params, then) => {
    params = this.appendParams(params);
    const apiStack = scope + Parse.jsonEncode(params);
    Socket.stackIndex += 1;
    if (Socket.stackIndex > Socket.stackLimit) {
      Socket.stackIndex = 0;
    }
    Socket.stack[Socket.stackIndex] = {};
    Socket.stack[Socket.stackIndex].then = then;
    Socket.stack[Socket.stackIndex].apis = {};
    Socket.stack[Socket.stackIndex].apis[apiStack] = false;
    let r = {
      client_id: Auth.getClientId(),
      scopes: params
    };
    r.stack = `${Socket.stackIndex}#STACK#${apiStack}`;
    console.log(r);
    r = Parse.jsonEncode(r);
    Socket.send({host: this.host, crypto: this.crypto, loginUrl: this.loginUrl}, r);
  };

};

export default Query;
