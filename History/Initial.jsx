import './Initial.less';
import React, {Component} from 'react';
import {ConfigProvider, Spin} from "antd";
import {Api, Parse, History, LocalStorage} from "h-react-antd";
import {LoadingOutlined} from "@ant-design/icons";

import Login from "./Login";
import Catalog from "./Catalog";
import Guidance from "./Guidance";

class Initial extends Component {
  constructor(props) {
    super(props);

    this.location = Parse.urlDispatch();

    this.state = {
      ...props.data,
      loggingId: LocalStorage.get('h-react-logging-id') || null,
      currentUrl: this.location.url,
      subPages: [],
      tabsActiveKey: '0',
      i18n: {},
      router: {},
      catalog: [],
    }

    // setting
    this.state.setting = LocalStorage.get('h-react-setting-' + this.state.loggingId) || {};

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
      } else {
        this.state.i18n.data = [];
      }
    } else {
      this.state.i18n.lang = 'zh_cn';
      this.state.i18n.support = ['zh_cn', 'zh_tw', 'zh_hk', 'en_us', 'ja_jp', 'ko_kr'];
      this.state.i18n.data = [];
    }
  }

  _init = () => {
    if (this.props.menu) {
      const menu = this.props.menu.get();
      History.state.router = menu.router;
      History.state.catalog = menu.catalog;
      History.setState({
        router: menu.router,
        catalog: menu.catalog,
      });
    }
    if (this.state.router[this.location.pathname]) {
      this.state.subPages.push(this.location.url);
    } else {
      this.state.subPages.push('/');
    }
    this.setState({
      subPages: this.state.subPages,
    });
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
          self._init();
        }
      });
    } else {
      this._init();
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
          <Spin indicator={<LoadingOutlined style={{fontSize: 50}} spin/>}/>
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
                  this.state.subPages.map((url, idx) => {
                    const location = Parse.urlDispatch(url);
                    const Sub = this.state.router[location.pathname].component;
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

  render() {
    return (
      <ConfigProvider locale={History.i18nAntd()}>
        <div className="app">
          {this.renderApp()}
        </div>
      </ConfigProvider>
    );
  }
}

export default Initial;
