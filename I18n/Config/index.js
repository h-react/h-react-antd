import LocalStorage from "../../Storage/LocalStorage";
import {History} from "../../index";

const AntdShift = {
  "en_us": "en_US",
  "ja_jp": "ja_JP",
  "ko_kr": "ko_KR",
  "zh_cn": "zh_CN",
  "zh_hk": "zh_TW",
  "zh_tw": "zh_TW"
};
const Core = {
  setting: {},
  set: (conf) => {
    let tempSetting = LocalStorage.get('h-react-i18n-setting') || {};
    Core.setting = {
      lang: conf.lang || tempSetting.lang || 'zh_cn',
      support: conf.support || tempSetting.support || ['zh_cn', 'zh_tw', 'zh_hk', 'en_us', 'ja_jp', 'ko_kr'],
    };
    LocalStorage.set('h-react-i18n-setting', Core.setting);
    const data = {}
    if (conf.data) {
      conf.data.forEach((ljv) => {
        Core.support.forEach((sv) => {
          if (Core.data[sv] === undefined) {
            Core.data[sv] = {};
          }
          const uk = ljv.i18n_unique_key;
          Core.data[sv][uk] = ljv[`i18n_${sv}`] || '';
        });
      });
    }
    Core.setting.data = data;
  },
  antd: () => {
    let l = AntdShift[Core.lang];
    if (l === undefined) {
      l = AntdShift.en_us
    }
    const obj = require(`antd/es/locale/${l}.js`);
    return obj.default;
  },
};

export default Core;
