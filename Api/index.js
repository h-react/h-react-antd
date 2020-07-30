import Query from "./Query";

/**
 * api 请求
 * @param scope
 * @param params
 * @param then
 * @param refresh
 * @constructor
 */
const Index = {

  setting: {},

  /**
   * 配置host
   * @param settingKey
   * @param host 链接
   * @param crypto 加密方式
   * @param append 附加参数,只支持静态数据
   */
  config: (settingKey = 'def', host, crypto = null, append = null) => {
    Index.setting[settingKey] = {
      host: host,
      crypto: crypto,
      append: append,
    };
  },

  /**
   * mixed query
   * @param settingKey
   * @returns {Query}
   */
  query: (settingKey = 'def') => {
    const setting = Index.setting[settingKey];
    if (setting === undefined) {
      throw 'setting error';
    }
    return new Query(setting);
  },

};

export default Index;
