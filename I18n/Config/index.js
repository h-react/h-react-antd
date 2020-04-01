import Cookie from '../../Storage/Cookie';

const Core = {
  lang: 'zh_cn',
  support: [],
  data: {},
  setLang: (lang) => {
    let tempLang = Cookie.get('i18nDefaultLang');
    if (tempLang === '') {
      tempLang = lang
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
        const uk = ljv.yonna_i18n_unique_key;
        Core.data[sv][uk] = ljv[`yonna_i18n_${sv}`] || '';
      });
    });
  },
  antd: () => {
    const trans = {
      "en_us": "en_US",
      "ja_jp": "ja_JP",
      "ko_kr": "ko_KR",
      "zh_cn": "zh_CN",
      "zh_hk": "zh_TW",
      "zh_tw": "zh_TW"
    };
    return require('antd/es/locale/' + trans[Core.lang]).default;
  },
};

export default Core;
