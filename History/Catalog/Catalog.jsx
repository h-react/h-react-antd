import './Catalog.less';
import React, {Component} from 'react';
import {Menu} from 'antd';
import {History} from 'h-react-antd';

class Catalog extends Component {

  constructor(props) {
    super(props);

    this.state = {}

  }

  selectedKeys = () => {
    return [
      History.state.currentUrl,
    ];
  }

  openKeys = (routers, keys = []) => {
    routers = routers || History.catalog;
    routers.forEach((val, idx) => {
      if (typeof val.to === 'string') {
        if (val.to === History.state.currentUrl) {
          keys.push(val.to);
        }
      } else if (typeof val.to === 'object') {
        keys.push(`catalog_${idx}`);
        keys = this.openKeys(val.to[1], keys);
      }
    });
    return keys;
  }

  renderSub = (routers) => {
    routers = routers || History.catalog;
    return (
      routers.map((val, idx) => {
        if (val.hidden === true) {
          return null;
        }
        if (val.disabled === true) {
          return (
            <Menu.Item key={val.to} disabled>
              {val.icon !== undefined ? val.icon : ''}<span>{val.label}</span>
            </Menu.Item>
          );
        }
        if (typeof val.to === 'string') {
          return (
            <Menu.Item key={val.to}>
              {val.icon !== undefined ? val.icon : ''}<span>{History.router[val.to].label}</span>
            </Menu.Item>
          );
        }
        if (typeof val.to === 'object') {
          return (
            <Menu.SubMenu
              key={`catalog_${idx}`}
              title={<span>{val.icon !== undefined ? val.icon : ''}<span>{val.to[0]}</span></span>}
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
          defaultSelectedKeys={this.selectedKeys()}
          defaultOpenKeys={this.openKeys()}
          mode="inline"
          theme={theme}
          inlineCollapsed={History.state.setting.enableSmallMenu}
          onClick={(e) => {
            History.push(e.key);
          }}
        >
          {this.renderSub()}
        </Menu>
      </div>
    );
  }
}

export default Catalog;
