const Xoss = {

  /**
   * 按顺序传参~不需要keyName，已“|”分隔
   * keyName[key]访键
   * options[thumb]裁剪：thumb=500,500,1200,1200 (x1,y1,x2,y2) 坐标以左上角为(0,0)
   * options[resize]缩放：100,100 | 100%,100% 支持百分比（urlencode=%25）及固定参数,height可省略
   * options[flip]翻转：flip=0,1 (x,y) 支持0 or 1，1表示该轴翻转
   * options[blur]模糊：blur=2 (distance)模糊程度，数值越大越模糊
   * options[grayscale]灰度：grayscale=1 (1 or 0)
   * options[reverse]反相 (1 or 0)
   */
  url: (key, options = {}) => {
    if (!key) {
      return null;
    }
    if (key.indexOf('http') > -1 || key.indexOf('/') === 0) {
      return key;
    }
    const path = [
      key,
      options.thunb ? options.thunb : '',
      options.resize ? options.resize : '',
      options.flip ? options.flip : '',
      options.blur ? options.blur : '',
      options.grayscale ? options.grayscale : '',
      options.reverse ? options.reverse : '',
    ];
    return '/xoss_download/' + path.join('|');
  }

};

export default Xoss;
