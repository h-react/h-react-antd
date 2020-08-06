import {Api, History} from './../index';

const Index = (trans, lang = null) => {
  if (lang === null) {
    lang = History.state.i18n.lang;
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
      Api.query().post({I18N_SET: {unique_key: t}}, (res) => {
        if (res.code === 200) {
          console.log(res);
        }
      });
    }
    let l = History.state.i18n.data[lang][t];
    if (!l) {
      rl.push(`{I18N${t}}`);
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
