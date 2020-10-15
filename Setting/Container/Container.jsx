import './Container.less';
import React, {Component} from 'react';
import {Checkbox, Row, Col, Drawer, message} from 'antd';
import {I18n, LocalStorage, History} from "../../index";

class Container extends Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.prev = '';
    this.state = {
      showTool: false,
      drawerPlacement: props.placement || "right"
    };

  };

  save = (e) => {
    switch (e.target.type) {
      case 'checkbox':
        History.state.setting[e.target.name] = e.target.checked;
        break;
    }
  }

  render() {
    return (
      <span>
        <span onClick={() => {
          this.prev = JSON.stringify(History.state.setting);
          this.setState({
            showTool: true,
          });
        }}>
          {this.props.children}
        </span>
        <Drawer
          className="h-react-setting"
          title={I18n('SETTING')}
          placement={this.state.drawerPlacement}
          closable={false}
          onClose={() => {
            this.setState({
              showTool: false,
            });
            const cur = JSON.stringify(History.state.setting);
            if (this.prev !== cur) {
              History.setState({
                setting: History.state.setting
              });
              LocalStorage.set('h-react-setting', History.state.setting);
              message.loading(I18n('Setting is being processed'), 0.5);
            }
          }}
          visible={this.state.showTool}
        >
          <Row>
            <div className="setter">
              <p>{I18n('STYLE')}</p>
              <Col span={24}>
                <Checkbox
                  defaultChecked={History.state.setting.enableDarkMenu}
                  name="enableDarkMenu"
                  onChange={this.save}
                >{I18n(['ENABLE', 'DARK', 'MENU'])}</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox
                  defaultChecked={History.state.setting.enableSmallMenu}
                  name="enableSmallMenu"
                  onChange={this.save}
                >{I18n(['ENABLE', 'SMALL', 'MENU'])}</Checkbox>
              </Col>
            </div>
            <div className="setter">
              <p>{I18n('ACCESSIBILITY')}</p>
              <Col span={24}>
                <Checkbox
                  defaultChecked={History.state.setting.enableHelpTips}
                  name="enableHelpTips"
                  onChange={this.save}
                >{I18n(['ENABLE', 'HELP', 'TIPS'])}</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox
                  defaultChecked={History.state.setting.enableFullscreen}
                  name="enableFullscreen"
                  onChange={this.save}
                >{I18n(['ENABLE', 'FULLSCREEN', 'OPERATE'])}
                </Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox
                  defaultChecked={History.state.setting.enableClearCache}
                  name="enableClearCache"
                  onChange={this.save}
                >{I18n(['ENABLE', 'CLEAR CACHE'])}</Checkbox>
              </Col>
            </div>
          </Row>
        </Drawer>
      </span>
    );
  }
}

export default Container;
