import React, {Component} from 'react';
import {Radio, Drawer, Button} from 'antd';
import {TranslationOutlined} from '@ant-design/icons';
import I18nConfig from '../Config';
import Cookie from '../../Storage/Cookie';

import './Tool.scss';

const langJson = require('./lang.json');

class Tool extends Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      defaultLang: Cookie.get('i18nDefaultLang') || I18nConfig.defaultLang,
      showTool: false,
      placement: props.placement,
      drawerPlacement: "right",
    };
    this.originLang = this.state.defaultLang;
    this.changed = false;
    switch (this.state.placement) {
      case 'leftTop':
      case 'leftBottom':
        this.state.drawerPlacement = "left";
        break;
      case 'rightTop':
      case 'rightBottom':
      default:
        this.state.drawerPlacement = "right";
        break;
    }
  };

  render() {
    if (I18nConfig.support.length <= 0) {
      return null;
    }
    return (
      <div className={`toolbar ${this.state.placement}`}>
        <Button
          type="default"
          icon={<TranslationOutlined/>}
          size="large"
          onClick={() => {
            this.setState({showTool: true})
          }}
        >
          Translation
        </Button>
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
      </div>
    );
  }
}

export default Tool;
