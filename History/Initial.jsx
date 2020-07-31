import './Initial.less';
import React, {Component} from 'react';
import Loadable from 'react-loadable';
import {ConfigProvider, Menu} from "antd";
import {Auth, Parse, History, I18nConfig, LocalStorage} from "h-react-antd";
import {VerticalAlignTopOutlined, BulbFilled} from '@ant-design/icons';
import Loading from "./Loading";
import Login from "./Login";


class Initial extends Component {
  constructor(props) {
    super(props);

    const location = Parse.urlDispatch();

    this.state = {
      ...props.data,
      logging: Auth.isLogging(),
      catalog: {
        theme: LocalStorage.get('h-react-catalog-theme') || 'light',
        collapsed: LocalStorage.get('h-react-catalog-collapsed') || false,
      },
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
          <div className={`catalog ${this.state.catalog.theme}`}>
            <Menu
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              theme={this.state.catalog.theme}
              inlineCollapsed={this.state.catalog.collapsed}
            >
              <Menu.Item key="1" icon={<VerticalAlignTopOutlined/>}>
                Option 1
              </Menu.Item>
              <Menu.Item key="2" icon={<VerticalAlignTopOutlined/>}>
                Option 2
              </Menu.Item>
              <Menu.Item key="3" icon={<VerticalAlignTopOutlined/>}>
                Option 3
              </Menu.Item>
              <Menu.SubMenu key="sub1" icon={<VerticalAlignTopOutlined/>} title="Navigation One">
                <Menu.Item key="5">Option 5</Menu.Item>
                <Menu.Item key="6">Option 6</Menu.Item>
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="sub2" icon={<VerticalAlignTopOutlined/>} title="Navigation Two">
                <Menu.Item key="9">Option 9</Menu.Item>
                <Menu.Item key="10">Option 10</Menu.Item>
                <Menu.SubMenu key="sub3" title="Submenu">
                  <Menu.Item key="11">Option 11</Menu.Item>
                  <Menu.Item key="12">Option 12</Menu.Item>
                </Menu.SubMenu>
              </Menu.SubMenu>
            </Menu>
            <span className="catalog-switch">
              <BulbFilled onClick={() => {
                this.state.catalog.theme = this.state.catalog.theme === 'dark' ? 'light' : 'dark';
                LocalStorage.set('h-react-catalog-theme', this.state.catalog.theme);
                this.setState({catalog: this.state.catalog});
              }}/>
              <VerticalAlignTopOutlined rotate={this.state.catalog.collapsed ? 90 : -90} onClick={() => {
                this.state.catalog.collapsed = !this.state.catalog.collapsed || false;
                LocalStorage.set('h-react-catalog-collapsed', this.state.catalog.collapsed);
                this.setState({catalog: this.state.catalog});
              }}/>
            </span>
          </div>
          <div className="exhibition">
            <div className="tabs">

            </div>
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
