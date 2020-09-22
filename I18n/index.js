import {Api, History} from './../index';

const limiter = {};

const Index = (trans, lang = null) => {
  if (lang === null) {
    lang = History.state.i18n.lang;
  }
  // 当设置语言支持仅有一种的时候，强制转为该语言
  if (History.state.i18n.support.length <= 1) {
    lang = History.state.i18n.support[0];
  }
  if (typeof trans !== 'object') {
    trans = [trans];
  }

  // 汉语圈
  const isChinese = ['zh_cn', 'zh_tw', 'zh_hk', 'ja_jp', 'ko_kr'].includes(lang);

  let rl = [];
  if (History.state.i18n.data[lang] === undefined) {
    return
  }
  trans.forEach((t, idx) => {
    t = t.toUpperCase();
    if (History.state.i18n.data[lang][t] === undefined || !History.state.i18n.data[lang][t]) {
      if (limiter[t] !== true) {
        limiter[t] = true;
        Api.query().post({I18N_SET: {unique_key: t}}, (res) => {
          if (res.error === 0) {
            limiter[t] = false;
            if (res.data.i18n_unique_key === t) {
              History.state.i18n.support.forEach((l) => {
                if (res.data[`i18n_${l}`]) {
                  History.state.i18n.data[l][t] = res.data[`i18n_${l}`];
                }
              });
              History.setState({
                i18n: History.state.i18n,
              });
            }
          }
        });
      }
    }
    let l = History.state.i18n.data[lang][t];
    if (!l) {
      rl.push(t);
    } else {
      if (!isChinese) {
        if (idx === 0) {
          l = l.replace(l[0], l[0].toUpperCase());
        } else {
          l = ' ' + l.toLowerCase();
        }
      }
      rl.push(l);
    }
  });
  // 汉语圈不需要词组间加空格，而拉丁语圈要
  if (isChinese) {
    return rl.join('');
  } else {
    return rl.join(' ');
  }
};

export default Index;
