import './Initial.less';
import React, {Component} from 'react';
import Loadable from 'react-loadable';
import {ConfigProvider} from "antd";
import {Auth, Parse, History, I18nConfig, LocalStorage} from "h-react-antd";
import Loading from "./Loading";
import Login from "./Login";
import Catalog from "./Catalog";
import Guidance from "./Guidance";

class Initial extends Component {
  constructor(props) {
    super(props);

    const location = Parse.urlDispatch();

    this.state = {
      ...props.data,
      logging: Auth.isLogging(),
      currentUrl: location.url,
      subPages: [],
    }

    // 分析路由
    if (History.router[location.pathname]) {
      this.state.subPages.push({url: location.url, ...History.router[location.pathname]});
    } else {
      this.state.subPages.push({url: '/', ...History.router['/']});
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
