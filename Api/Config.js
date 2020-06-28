let ApiConfig = {};

/**
 *
 * @param host
 * @param type
 * @param crypto
 * @param append 只支持静态数据
 * @constructor
 */
const Config = (host, type = 'http', crypto = null, append = null) => {
  ApiConfig = {
    host: host,
    type: type.toLowerCase(),
    crypto: crypto,
    append: append,
  };
};

export default Config;
