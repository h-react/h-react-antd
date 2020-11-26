import './Catalog.less';
import React, {Component} from 'react';
import {Menu, Popover} from 'antd';
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

  checkOpenKeys = (key) => {
    if (key === History.state.currentUrl) {
      return true;
    }
    let res = false;
    for (let i in History.state.subPages) {
      if (key === History.state.subPages[i].url) {
        res = true;
      }
    }
    return res;
  }

  openKeys = (catalog, keys = [], prevKeys = [], addState = true) => {
    catalog = catalog || History.state.catalog;
    catalog.forEach((val, idx) => {
      if (typeof val.to === 'string') {
        if (this.checkOpenKeys(val.to)) {
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
        const prevLen = keys.length
        keys = this.openKeys(val.to[1], keys, prevKeys, false);
        if (keys.length > prevLen) {
          keys.push(`catalog_${val.to[0].toString()}`);
        }
      }
    });
    if (addState) {
      this.state.openKeys.forEach((k) => {
        if (!keys.includes(k)) {
          keys.push(k);
        }
      });
    }
    return keys;
  }

  renderSubTabs = (to) => {
    const tabs = [];
    History.state.subPages.forEach((subPages) => {
      if (subPages.url === to) {
        tabs.push(subPages);
      }
    })
    return tabs;
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
          const tabs = this.renderSubTabs(val.to)
          return (
            <Menu.Item
              key={val.to}
              onClick={() => {
                if (tabs.length <= 0) {
                  History.push(val.to);
                } else {
                  History.change(tabs[tabs.length - 1].key);
                }
              }}
            >
              {val.icon !== undefined ? val.icon : ''}
              <span>{I18n(History.state.router[val.to].label)}</span>
            </Menu.Item>
          );
        }
        if (typeof val.to === 'object') {
          return (
            <Menu.SubMenu
              key={`catalog_${typeof val.to[0] === 'object' ? val.to[0].toString() : val.to[0]}`}
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

    if (History.state.catalog === false) {
      return null;
    }

    const theme = History.state.setting.enableDarkMenu ? 'dark' : 'light';

    return (
      <div className={`catalog ${theme}`}>
        <Menu
          selectedKeys={[History.state.currentUrl]}
          openKeys={this.openKeys()}
          mode="inline"
          theme={theme}
          inlineCollapsed={History.state.setting.enableSmallMenu}
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
