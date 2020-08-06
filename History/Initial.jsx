import './Initial.less';
import React, {Component} from 'react';
import {ConfigProvider, Spin} from "antd";
import {Api, Parse, History, LocalStorage} from "h-react-antd";

import Login from "./Login";
import Catalog from "./Catalog";
import Guidance from "./Guidance";

const AntdLangs = {
  "en_us": "en_US",
  "ja_jp": "ja_JP",
  "ko_kr": "ko_KR",
  "zh_cn": "zh_CN",
  "zh_hk": "zh_TW",
  "zh_tw": "zh_TW"
};

class Initial extends Component {
  constructor(props) {
    super(props);

    const location = Parse.urlDispatch();

    this.state = {
      ...props.data,
      loggingId: LocalStorage.get('h-react-logging-id') || null,
      currentUrl: location.url,
      subPages: [],
      tabsActiveKey: '0',
      i18n: {},
    }

    // setting
    this.state.setting = LocalStorage.get('h-react-setting-' + this.state.loggingId) || {};

    // 分析路由
    if (History.router[location.pathname]) {
      this.state.subPages.push({url: location.url, ...History.router[location.pathname]});
    } else {
      this.state.subPages.push({url: '/', ...History.router['/']});
    }

    // 绑定
    History.link(this);

    // 注册api
    if (props.api) {
      Api.config(props.api.key, props.api.host, props.api.crypto, props.api.append)
    }

    // 注册国际化
    if (props.i18n) {
      this.state.i18n.lang = LocalStorage.get('h-react-i18n-lang') || props.lang || 'zh_cn';
      this.state.i18n.support = props.support || ['zh_cn', 'zh_tw', 'zh_hk', 'en_us', 'ja_jp', 'ko_kr'];
      if (props.i18n.data && props.i18n.data.length > 0) {
        this.state.i18n.data = this.i18nDataFormat(props.i18n.data, this.state.i18n.support);
        if (props.router) History.router = props.router;
      } else {
        this.state.i18n.data = [];
      }
    } else {
      this.state.i18n.lang = 'zh_cn';
      this.state.i18n.support = ['zh_cn', 'zh_tw', 'zh_hk', 'en_us', 'ja_jp', 'ko_kr'];
      this.state.i18n.data = [];
    }
  }

  componentDidMount() {
    if (this.state.i18n.data.length === 0) {
      const self = this;
      Api.query().post({I18N_ALL: {}}, (res) => {
        if (res.code === 200) {
          self.state.i18n.data = self.i18nDataFormat(res.data, self.state.i18n.support);
          self.setState({
            i18n: self.state.i18n,
          });
        }
      });
    }
  }

  i18nDataFormat = (langJson, support) => {
    const data = {};
    langJson.forEach((ljv) => {
      support.forEach((sv) => {
        if (data[sv] === undefined) {
          data[sv] = {};
        }
        const uk = ljv.i18n_unique_key;
        data[sv][uk] = ljv[`i18n_${sv}`] || '';
      });
    });
    return data;
  }

  isInitial = () => {
    if (!this.state.i18n.data) return false;
    if (this.state.i18n.data.length <= 0) return false;
    return true;
  }

  renderApp = () => {
    if (!this.isInitial()) {
      return (
        <div style={{textAlign: 'center', width: '100%', height: '100vh', lineHeight: '100vh'}}>
          <Spin tip="loading" size="large"/>
        </div>
      );
    }
    if (this.state.loggingId !== null) {
      return (
        <div className="container">
          <Catalog/>
          <div className="exhibition">
            <Guidance/>
            <div className="subPages">
              <div className="subs">
                {
                  this.state.subPages.map((item, idx) => {
                    const Sub = item.component;
                    return <div key={idx}><Sub/></div>;
                  })
                }
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return this.props.Login || <Login/>;
    }
  }

  i18nAntd = () => {
    let l = AntdLangs[this.state.i18n.lang];
    if (l === undefined) {
      l = AntdLangs.en_us
    }
    const obj = require(`antd/es/locale/${l}.js`);
    return obj.default;
  }

  render() {
    return (
      <ConfigProvider locale={this.i18nAntd()}>
        <div className="app">
          {this.renderApp()}
        </div>
      </ConfigProvider>
    );
  }
}

export default Initial;
