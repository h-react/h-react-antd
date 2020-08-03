import './Setting.less';
import React, {Component} from 'react';
import {Checkbox, Row, Col, Drawer} from 'antd';
import LocalStorage from "../Storage/LocalStorage";
import {I18n} from "../index";
import operate from "../../../src/pages/Setting/I18n/flagment/operate";

class Setting extends Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      showTool: false,
      drawerPlacement: props.placement || "right",
      setting: LocalStorage.get('h-react-setting') || {},
    };

  };

  save = (e) => {
    switch (e.target.type) {
      case 'checkbox':
        this.state.setting[e.target.name] = e.target.checked;
        break;
    }
    this.setState({
      setting: this.state.setting,
    });
    LocalStorage.set('h-react-setting', this.state.setting);
  }

  render() {
    return (
      <span className={`toolbar ${this.state.placement}`}>
        <span onClick={() => {
          this.setState({showTool: true})
        }}>
          {this.props.children}
        </span>
        <Drawer
          title={I18n('SETTING')}
          placement={this.state.drawerPlacement}
          closable={false}
          onClose={() => {
            this.setState({showTool: false,});
          }}
          visible={this.state.showTool}
        >
          <Row>
            <Col span={24}>
              <Checkbox
                defaultChecked={this.state.setting.help}
                name="help"
                onChange={this.save}
              >{I18n(['ENABLE', 'HELP', 'TIPS'])}</Checkbox>
            </Col>
          </Row>
        </Drawer>
      </span>
    );
  }
}

export default Setting;
