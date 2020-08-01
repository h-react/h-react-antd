import './Initial.less';
import React, {Component} from 'react';
import Loadable from 'react-loadable';
import {ConfigProvider, Button, message} from "antd";
import {Auth, Parse, History, I18nConfig, Api, I18n, I18nContainer} from "h-react-antd";
import Loading from "./Loading";
import Login from "./Login";
import Catalog from "./Catalog";
import Guidance from "./Guidance";
import Me from "./me";


class Initial extends Component {
  constructor(props) {
    super(props);

    const location = Parse.urlDispatch();

    this.state = {
      ...props.data,
      logging: Auth.isLogging(),
      subPages: [
        {url: location.pathname === '/' ? location.url : '/', ...History.router['/']},
      ],
    }

    // 分析路由
    if (location.pathname !== '/' && History.router[location.pathname]) {
      this.state.subPages.push({url: location.url, ...History.router[location.pathname]});
    }

    History.link(this);
  }

  componentDidMount = () => {
    if (this.state.logging) {
      History.efficacy('init');
    }
  }

  renderApp = () => {

    if (this.state.logging) {
      return (
        <div className="container">
          <Catalog/>
          <div className="exhibition">
            <div className="global-operate">
              {this.state.logging && <Button size="small" type="primary"><Me/></Button>}
              <I18nContainer placement="top"><Button size="small">Translate</Button></I18nContainer>
              <Button size="small" type="danger" onClick={() => {
                Api.query().post({USER_LOGOUT: {}}, (res) => {
                  if (res.code === 200) {
                    message.success(I18n('LOGOUT_SUCCESS'));
                    Auth.clearLogging();
                    History.state.logging = false;
                    History.setState({
                      logging: History.state.logging,
                    });
                  } else {
                    message.error(I18n(res.msg));
                  }
                });
              }}>{I18n('logout')}</Button>
            </div>
            <Guidance/>
            <div className="subPages">
              <div className="subs">
                {
                  this.state.subPages.map((item, idx) => {
                    const Sub = React.createElement((item.component !== undefined)
                      ? Loadable({loader: item.component, loading: Loading})
                      : item.component, this.props)
                    return <div key={idx}>{Sub}</div>;
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
      <ConfigProvider locale={I18nConfig.antd()}>
        <div className="app">
          {this.renderApp()}
        </div>
      </ConfigProvider>
    );
  }
}

export default Initial;
