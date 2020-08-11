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
      preprocessingLength: this._preprocessingLength(props.preprocessing),
      preprocessingStack: 0,
      preprocessingError: [],
      loggingId: LocalStorage.get('h-react-logging-id') || null,
      currentUrl: this.location.url,
      subPages: [],
      tabsActiveKey: '0',
    }

    // setting
    this.state.setting = LocalStorage.get('h-react-setting-' + this.state.loggingId) || {};

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
        History.setState(res);
        if (this.state.router[this.location.pathname]) {
          History.state.subPages.push(this.location.url);
        } else {
          History.state.subPages.push('/');
        }
        History.setState({
          subPages: History.state.subPages,
          preprocessingStack: (this.state.preprocessingStack - 1)
        });
      })
    }
  }

  _preprocessingLength = (pre, len = 0) => {
    if (!pre || pre.length <= 0) {
      return len;
    }
    for (let p in pre) {
      const t = typeof pre[p];
      if (t === 'object') {
        len = this._preprocessingLength(pre[p], len);
      } else if (t === 'function' && '_promise' === pre[p].name) {
        len++;
      }
    }
    return len
  }

  _preprocessing = async (pre) => {
    for (let p in pre) {
      const t = typeof pre[p];
      if (t === 'object') {
        await this._preprocessing(pre[p]);
      } else if (t === 'function' && '_promise' === pre[p].name) {
        await pre[p]()
          .then((r) => {
            pre[p] = r;
            this.state.preprocessingStack -= 1;
          })
          .catch((error) => {
            this.state.preprocessingError.push(error);
            this.setState({
              preprocessingError: this.state.preprocessingError,
            });
            console.error(error);
          });
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
    if (this.state.loggingId !== null) {
      return (
        <ConfigProvider locale={History.i18nAntd()}>
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
