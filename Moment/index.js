import * as m from 'moment';
import {History} from 'h-react-antd';

const MomentShift = {
  "en_us": "en-us",
  "ja_jp": "ja-jp",
  "ko_kr": "ko-kp",
  "zh_cn": "zh-cn",
  "zh_hk": "zh-hk",
  "zh_tw": "zh-tw"
};

const Moment = {
  create: () => {
    return m();
  },
  locale: () => {
    if (m.locale() === 'en') {
      let l = MomentShift[History.state.i18n.lang];
      if (l === undefined) {
        l = MomentShift.en_us
      }
      m.locale(l);
    }
  },
  unix: (momentObj = null, withMillis = false) => {
    if (!momentObj) {
      momentObj = Moment.create();
    }
    let u = momentObj.valueOf();
    if (!withMillis) {
      u = Math.floor(u * 0.001);
    }
    return u;
  },
  format: (timestamp = null) => {
    const time = new Date().getTime();
    if (!timestamp) {
      timestamp = time;
    }
    Moment.locale();
    if (timestamp.toString().length < time.toString().length) {
      return m.unix(timestamp).format('llll:ss')
    } else {
      return m(timestamp).format('llll:ss')
    }
  },
};

export default Moment;
