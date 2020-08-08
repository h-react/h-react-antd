import './Catalog.less';
import React, {Component} from 'react';
import {Menu} from 'antd';
import {History, I18n} from 'h-react-antd';

class Catalog extends Component {

  constructor(props) {
    super(props);

    this.state = {
      openKeys: [],
    }
  }

  componentDidMount() {
    this.setState({
      openKeys: [],
    });
  }

  openKeys = (catalog, keys = [], prevKeys = []) => {
    catalog = catalog || History.state.catalog;
    catalog.forEach((val, idx) => {
      if (typeof val.to === 'string') {
        if (val.to === History.state.currentUrl) {
          keys.push(val.to);
          if (this.state.openKeys.length === 0) {
            prevKeys.forEach((to) => {
              if (!keys.includes(to)) {
                keys.push(to);
              }
            });
          }
        }
      } else if (typeof val.to === 'object') {
        prevKeys.push(`catalog_${idx}`);
        keys = this.openKeys(val.to[1], keys, prevKeys);
      }
    });
    this.state.openKeys.forEach((k) => {
      if (!keys.includes(k)) {
        keys.push(k);
      }
    });
    return keys;
  }

  renderSub = (catalog) => {
    catalog = catalog || History.state.catalog;
    return (
      catalog.map((val, idx) => {
        if (val.hidden === true) {
          return null;
        }
        if (val.disabled === true) {
          return (
            <Menu.Item key={val.to} disabled>
              {val.icon !== undefined ? val.icon : ''}<span>{I18n(val.label)}</span>
            </Menu.Item>
          );
        }
        if (typeof val.to === 'string') {
          return (
            <Menu.Item key={val.to}>
              {val.icon !== undefined ? val.icon : ''}<span>{I18n(History.state.router[val.to].label)}</span>
            </Menu.Item>
          );
        }
        if (typeof val.to === 'object') {
          return (
            <Menu.SubMenu
              key={`catalog_${idx}`}
              title={<span>{val.icon !== undefined ? val.icon : ''}<span>{I18n(val.to[0])}</span></span>}
            >
              {this.renderSub(val.to[1])}
            </Menu.SubMenu>
          );
        }
        return null;
      })
    );
  };

  render() {

    const theme = History.state.setting.enableDarkMenu ? 'dark' : 'light'

    return (
      <div className={`catalog ${theme}`}>
        <Menu
          selectedKeys={[History.state.currentUrl]}
          openKeys={this.openKeys()}
          mode="inline"
          theme={theme}
          inlineCollapsed={History.state.setting.enableSmallMenu}
          onClick={(e) => {
            History.push(e.key);
          }}
          onOpenChange={(openKeys) => {
            this.setState({
              openKeys: openKeys
            });
          }}
        >
          {this.renderSub()}
        </Menu>
      </div>
    );
  }
}

export default Catalog;
