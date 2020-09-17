import React, {Component} from 'react';
import {Radio, Drawer} from 'antd';
import {LocalStorage, History, I18n, Navigator} from "../../index";

import './Container.less';

const langJson = require('./lang.json');

class Container extends Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      lang: History.state.i18n.lang,
      showTool: false,
      drawerPlacement: props.placement || "right",
    };
  };

  render() {
    if (History.state.i18n.support.length <= 1) {
      return null;
    }
    return (
      <span>
        <span onClick={() => {
          this.setState({showTool: true})
        }}>
          {this.props.children}
        </span>
        <Drawer
          className="h-react-i18n"
          title={I18n("CHOICE LANGUAGE", Navigator.language())}
          placement={this.state.drawerPlacement}
          closable={false}
          onClose={() => {
            this.setState({
              showTool: false,
            });
            if (this.state.lang !== History.state.i18n.lang) {
              History.state.i18n.lang = this.state.lang;
              History.setState({
                i18n: History.state.i18n,
              });
              LocalStorage.set('h-react-i18n-lang', this.state.lang);
            }
          }}
          visible={this.state.showTool}
        >
          <Radio.Group
            defaultValue={this.state.lang}
            onChange={(evt) => {
              this.state.lang = evt.target.value;
              this.setState({
                lang: this.state.lang,
              })
            }}
          >
            {
              Object.entries(langJson).map((val, key) => {
                if (History.state.i18n.support.includes(val[0])) {
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
