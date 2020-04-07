import Config from './Config';
import Api from './../Api';

const i18nBtn = {
  color: 'yellow',
  textDecoration: 'underline',
  background: '#000000',
};

const Index = (trans, lang = null) => {
  if (lang === null) {
    lang = Config.lang;
  }
  if (typeof trans !== 'object') {
    trans = [trans];
  }

  // 汉语圈
  const isChinese = [
    'zh_cn', 'zh_tw', 'zh_hk',
    'ja_jp', 'ko_kr'
  ].includes(lang);

  let rl = [];
  if (Config.data[lang] === undefined) {
    console.error('i18n lang config:' + lang);
    return
  }
  trans.forEach((t, idx) => {
    t = t.toUpperCase();
    if (Config.data[Config.lang][t] === undefined) {
      Api.delete().real('I18N_SET', {unique_key: t, source: 'ui'}, (res) => {
        if (res.code !== 200) {
          console.error(res);
        }
      });
    }
    let l = Config.data[lang][t];
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
