import './Catalog.less';
import React, {Component} from 'react';
import {Menu} from 'antd';
import {BulbFilled, VerticalAlignTopOutlined} from '@ant-design/icons';
import {LocalStorage, History} from 'h-react-antd';

class Catalog extends Component {

  constructor(props) {
    super(props);

    this.state = {
      catalog: {
        theme: LocalStorage.get('h-react-catalog-theme') || 'light',
        collapsed: LocalStorage.get('h-react-catalog-collapsed') || false,
      },
    }
  }


  renderSub = (router) => {
    router = router || History.router;
    return (
      router.map((val) => {
        if (val.hide === true) {
          return null;
        } else if (this.state.path.includes(val.jumpPath)) {
          switch (this.theme.pathHideType) {
            case 'hidden':
              return null;
            case 'disabled':
            default:
              return (
                <Menu.Item
                  key={val.jumpPath}
                  disabled
                >
                  {val.icon !== undefined ? val.icon : ''}<span>{val.name}</span>
                </Menu.Item>
              );
          }
        } else if (val.children !== undefined && val.children.length > 0) {
          return (
            <Menu.SubMenu
              key={val.jumpPath}
              disabled={val.disabled}
              title={<span>{val.icon !== undefined ? val.icon : ''}<span>{val.name}</span></span>}
            >
              {this.renderSub(val.children)}
            </Menu.SubMenu>
          );
        }
        return (
          <Menu.Item
            key={val.jumpPath}
            disabled={val.disabled}
          >
            {val.icon !== undefined ? val.icon : ''}<span>{val.name}</span>
          </Menu.Item>
        );
      })
    );
  };

  render() {
    return (
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
    );
  }
}

export default Catalog;
