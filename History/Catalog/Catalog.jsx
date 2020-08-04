import './Catalog.less';
import React, {Component} from 'react';
import {Menu} from 'antd';
import {LocalStorage, History} from 'h-react-antd';

class Catalog extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }


  renderSub = (routers) => {
    routers = routers || History.router;
    console.log(Object.entries(routers));
    return (
      Object.entries(routers).map((router) => {
        const url = router[0];
        const val = router[1];
        if (val.hidden === true) {
          return null;
        } else if (val.disabled === true) {
          return (
            <Menu.Item
              key={url}
              disabled
            >
              {val.icon !== undefined ? val.icon : ''}<span>{val.label}</span>
            </Menu.Item>
          );
        } else if (val.children !== undefined && val.children.length > 0) {
          return (
            <Menu.SubMenu
              key={url}
              disabled={val.disabled}
              title={<span>{val.icon !== undefined ? val.icon : ''}<span>{val.label}</span></span>}
            >
              {this.renderSub(val.children)}
            </Menu.SubMenu>
          );
        }
        return (
          <Menu.Item
            key={url}
            disabled={val.disabled}
          >
            {val.icon !== undefined ? val.icon : ''}<span>{val.label}</span>
          </Menu.Item>
        );
      })
    );
  };

  render() {

    const theme = History.state.setting.enableDarkMenu ? 'dark' : 'light'

    return (
      <div className={`catalog ${theme}`}>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme={theme}
          inlineCollapsed={History.state.setting.enableSmallMenu}
        >
          {this.renderSub()}
        </Menu>
      </div>
    );
  }
}

export default Catalog;
