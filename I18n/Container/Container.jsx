import React, {Component} from 'react';
import {Radio, Drawer} from 'antd';
import I18nConfig from '../Config';
import Cookie from '../../Storage/Cookie';

import './Container.scss';

const langJson = require('./lang.json');

class Container extends Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      defaultLang: Cookie.get('i18nDefaultLang') || I18nConfig.defaultLang,
      showTool: false,
      drawerPlacement: props.placement || "right",
    };
    this.originLang = this.state.defaultLang;
    this.changed = false;
  };

  render() {
    if (I18nConfig.support.length <= 0) {
      return null;
    }
    return (
      <span className={`toolbar ${this.state.placement}`}>
        <span onClick={() => {
          this.setState({showTool: true})
        }}>
          {this.props.children}
        </span>
        <Drawer
          title="CHOICE LANGUAGE"
          placement={this.state.drawerPlacement}
          closable={false}
          onClose={() => {
            this.setState({
              showTool: false,
            });
            if (this.changed && this.originLang !== Cookie.get('i18nDefaultLang')) {
              location.reload();
            }
          }}
          visible={this.state.showTool}
        >
          <Radio.Group
            defaultValue={this.state.defaultLang}
            onChange={(evt) => {
              Cookie.set('i18nDefaultLang', evt.target.value, 30);
              this.changed = true;
            }}
          >
            {
              Object.entries(langJson).map((val, key) => {
                if (I18nConfig.support.includes(val[0])) {
                  return <Radio className="radioStyle" key={key} value={val[0]}>{val[1]}</Radio>;
                }
              })
            }
          </Radio.Group>
        </Drawer>
      </span>
    );
  }
}

export default Container;
