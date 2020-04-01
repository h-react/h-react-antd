import Cookie from '../../Storage/Cookie';

const Core = {
  default: 'zh_cn',
  support: [],
  langJson: {},
  setDefault: (lang) => {
    let tempLang = Cookie.get('i18nDefaultLang');
    if (tempLang === '') {
      tempLang = 'zh_cn'
    }
    Core.default = tempLang;
  },
  setSupport: (support) => {
    Core.support = support;
  },
  setLangJson: (langJson) => {
    langJson.forEach((ljv) => {
      Core.support.forEach((sv) => {
        if (Core.langJson[sv] === undefined) {
          Core.langJson[sv] = {};
        }
        const uk = ljv.yonna_i18n_unique_key;
        Core.langJson[sv][uk] = ljv[`yonna_i18n_${sv}`] || '';
      });
    });
  },
};

export default Core;
