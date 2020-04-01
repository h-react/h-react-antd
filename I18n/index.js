import Config from './Config';

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
  trans.forEach((t, idx) => {
    t = t.toUpperCase();
    let l = (Config.data[lang] && Config.data[lang][t]) ? Config.data[lang][t] : null;
    if (!l) l = (Config.data[Config.lang] && Config.data[Config.lang][t]) ? Config.data[Config.lang][t] : null;
    if (!l) {
      rl.push('[I18N]' + t);
    } else {
      if (!isChinese) {
        if (idx === 0) {
          l = l.replace(l[0], l[0].toUpperCase());
        } else {
          l = l.toLowerCase();
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
