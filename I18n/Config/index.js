import LocalStorage from "../../Storage/LocalStorage";

const AntdShift = {
  "en_us": "en_US",
  "ja_jp": "ja_JP",
  "ko_kr": "ko_KR",
  "zh_cn": "zh_CN",
  "zh_hk": "zh_TW",
  "zh_tw": "zh_TW"
};
const Core = {
  lang: 'zh_cn',
  support: [],
  data: {},
  setLang: (lang) => {
    let tempLang = LocalStorage.get('i18nDefaultLang');
    if (!tempLang) {
      tempLang = lang
      LocalStorage.set('i18nDefaultLang', lang);
    }
    Core.lang = tempLang;
  },
  setSupport: (support) => {
    Core.support = support;
  },
  setData: (langJson) => {
    langJson.forEach((ljv) => {
      Core.support.forEach((sv) => {
        if (Core.data[sv] === undefined) {
          Core.data[sv] = {};
        }
        const uk = ljv.i18n_unique_key;
        Core.data[sv][uk] = ljv[`i18n_${sv}`] || '';
      });
    });
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
