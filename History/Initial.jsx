import './Initial.less';
import React, {Component} from 'react';
import {ConfigProvider, Spin} from "antd";
import {Api, Parse, History, LocalStorage, Navigator} from "h-react-antd";
import {LoadingOutlined} from "@ant-design/icons";

import Login from "./Login";
import Catalog from "./Catalog";
import Guidance from "./Guidance";

class Initial extends Component {
  constructor(props) {
    super(props);

    this.location = Parse.urlDispatch();

    // 是否强制登录
    this.forceLogin = true;
    if (typeof this.props.forceLogin === 'boolean') {
      this.forceLogin = this.props.forceLogin;
    }

    this.state = {
      preprocessingLength: this._preprocessingLength(props.preprocessing),
      preprocessingStack: 0,
      preprocessingError: [],
      loggingId: LocalStorage.get('h-react-logging-id') || null,
      currentUrl: this.location.url,
      subPages: [],
      tabsActiveKey: '',
      catalog: this.props.catalog,
      guidance: this.props.guidance,
    }

    // setting
    this.state.setting = LocalStorage.get('h-react-setting') || this.props.defaultSetting || {};

    // 绑定
    History.link(this);

    // 注册api
    if (props.api) {
      Api.config(props.api.key, props.api.host, props.api.crypto, props.api.append)
    }

    // 预处理数据
    if (props.preprocessing) {
      this.state.preprocessingStack = 1 + this.state.preprocessingLength;
      this._preprocessing(props.preprocessing).then((res) => {
        console.log(res);
        History.setState(res);
        if (this.state.router[this.location.pathname]) {
          History.push(this.location.url);
        } else {
          History.push('/');
        }
        History.setState({
          preprocessingStack: (this.state.preprocessingStack - 1)
        });
      })
    }
  }

  componentDidMount() {
    Navigator.banReturn();
  }

  _preprocessingLength = (pre, len = 0) => {
    if (!pre || pre.length <= 0) {
      return len;
    }
    for (let p in pre) {
      const t = typeof pre[p];
      if (!pre[p] || t !== 'object') {
        continue;
      }
      if (typeof pre[p].name === 'function' && pre[p].name() === 'Preprocessing') {
        len++;
      } else {
        len = this._preprocessingLength(pre[p], len);
      }
    }
    return len
  }

  _preprocessing = async (pre) => {
    for (let p in pre) {
      const t = typeof pre[p];
      if (!pre[p] || t !== 'object') {
        continue;
      }
      if (typeof pre[p].name === 'function' && pre[p].name() === 'Preprocessing') {
        await pre[p].query()
          .then((r) => {
            pre[p] = r;
            this.state.preprocessingStack -= 1;
          })
          .catch((error) => {
            this.state.preprocessingError.push(error);
            this.setState({
              preprocessingError: this.state.preprocessingError,
            });
          });
      } else {
        await this._preprocessing(pre[p]);
      }
    }
    return pre;
  }

  renderApp = () => {
    if (this.state.preprocessingStack > 0) {
      return (
        <div className="preprocessing">
          <Spin indicator={<LoadingOutlined style={{fontSize: 50}} spin/>}/>
          {
            this.state.preprocessingError.map((txt, idx) => {
              return <div key={idx} className="error">{txt}</div>
            })
          }
        </div>
      );
    }
    if (this.forceLogin === false || this.state.loggingId !== null) {
      return (
        <ConfigProvider locale={History.i18nAntd()}>
          <div className="container">
            <Catalog/>
            <div className="exhibition">
              <Guidance/>
              <div className="subPages">
                <div className="subs">
                  {
                    this.state.subPages.map((val) => {
                      const location = Parse.urlDispatch(val.url);
                      const Sub = this.state.router[location.pathname].component;
                      return <div
                        key={val.key}
                        className={val.key === this.state.tabsActiveKey ? 'show' : 'hide'}>
                        <Sub/>
                      </div>;
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </ConfigProvider>
      );
    } else {
      return (
        <ConfigProvider locale={History.i18nAntd()}>
          {this.props.Login || <Login/>}
        </ConfigProvider>
      );
    }
  }

  render() {
    return (
      <div className="app">
        {this.renderApp()}
      </div>
    );
  }
}

export default Initial;
