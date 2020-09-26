import {History, Parse, LocalStorage} from 'h-react-antd';
import axios from "axios";
import nanoid from "nanoid";
import Crypto from "./Crypto";

/**
 * 获取客户端ID
 */
const clientId = () => {
  if (LocalStorage.get('cid') === null) {
    LocalStorage.set('cid', nanoid(42) + (new Date()).getTime().toString(36));
  }
  return LocalStorage.get('cid');
}

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
      console.info('CONNECT_SERVER_SUCCESS');
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
        console.error('STACK_ERROR');
        return;
      }
      stack = stack.split('#STACK#');
      const stackIndex = stack[0];
      const stackKey = stack[1];
      if (typeof Socket.stack[stackIndex].then !== 'function') {
        console.error('STACK_THEN_ERROR');
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
              response.push(res);
              if (typeof res.error === 'number' && res.error === 44444) {
                hasNotAuth = true;
              }
            } else {
              response.push({error: res.error, msg: 'API_ERROR', data: null});
            }
          }
        });
      if (totalFinish === true) {
        if (hasNotAuth === true) {
          if (History.state.loggingId !== null) {
            History.setState({
              loggingId: null,
            });
            LocalStorage.clear('h-react-logging-id');
          } else {
            console.error('OPERATION_NOT_PERMISSION');
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
        console.info('CONNECT_SERVER_TRYING');
        Socket.queue.push(params);
      } else if (ApiSocket[host].readyState === Socket.state.CLOSING) {
        console.info('CONNECT_SERVER_CLOSING');
        Socket.queue.push(params);
      } else if (ApiSocket[host].readyState === Socket.state.CLOSED) {
        console.error('CONNECT_SERVER_CLOSED');
        Socket.queue.push(params);
      }
    } else {
      console.error("CONNECT_SERVER_COULD_NOT_ACCESS");
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

  this.host = setting.host;
  this.crypto = setting.crypto;
  this.append = setting.append;

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
        client_id: clientId(),
        scopes: params
      }, this.crypto),
      config: {}
    })
      .then((response) => {
        if (Crypto.is(this.crypto)) {
          response.data = Crypto.decode(response.data, this.crypto);
        }
        if (typeof response.data === 'object') {
          if (typeof response.data.error === 'number' && response.data.error === 44444) {
            if (History.state.loggingId !== null) {
              History.setState({
                loggingId: null,
              });
              LocalStorage.clear('h-react-logging-id');
            }
            then({error: response.data.error, msg: 'LIMITED_OPERATION', data: null});
            return;
          }
          then(response.data);
        } else {
          then({error: 99999, msg: 'API_ERROR', data: null});
        }
      })
      .catch((error) => {
        const status = (error.response && error.response.status) ? error.response.status : -1;
        switch (status) {
          case 400:
            error.message = 'API_ERROR_QUERY';
            break;
          case 401:
            error.message = 'API_ERROR_NOT_AUTH';
            break;
          case 403:
            error.message = 'API_ERROR_REJECT';
            break;
          case 404:
            error.message = 'API_ERROR_ABORT';
            break;
          case 408:
            error.message = 'API_ERROR_TIMEOUT';
            break;
          case 500:
            error.message = 'API_ERROR_SERVER';
            break;
          case 501:
            error.message = 'API_ERROR_NOT_SERVICE';
            break;
          case 502:
            error.message = 'API_ERROR_NET';
            break;
          case 503:
            error.message = 'API_ERROR_SERVICE_DISABLE';
            break;
          case 504:
            error.message = 'API_ERROR_NET_TIMEOUT';
            break;
          case 505:
            error.message = 'API_ERROR_NOT_SUPPORT_HTTP';
            break;
          default:
            break;
        }
        then({error: 99999, msg: error.message, data: null});
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
      client_id: clientId(),
      scopes: params
    };
    r.stack = `${Socket.stackIndex}#STACK#${apiStack}`;
    console.log(r);
    r = Parse.jsonEncode(r);
    Socket.send({host: this.host, crypto: this.crypto}, r);
  };

};

export default Query;
