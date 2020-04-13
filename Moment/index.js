import * as m from 'moment';
import {I18nConfig} from "h-react";

const MomentShift = {
  "en_us": "en-us",
  "ja_jp": "ja-jp",
  "ko_kr": "ko-kp",
  "zh_cn": "zh-cn",
  "zh_hk": "zh-hk",
  "zh_tw": "zh-tw"
};

const Moment = {
  locale: () => {
    if (m.locale() === 'en') {
      let l = MomentShift[I18nConfig.lang];
      if (l === undefined) {
        l = MomentShift.en_us
      }
      m.locale(l);
    }
  },
  format: (timestamp) => {
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
