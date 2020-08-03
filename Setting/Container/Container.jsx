import './Container.less';
import React, {Component} from 'react';
import {Checkbox, Row, Col, Drawer} from 'antd';
import {I18n, Auth, LocalStorage, History} from "../../index";

class Container extends Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);

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
      <span className={`toolbar ${this.state.placement}`}>
        <span onClick={() => {
          this.setState({
            showTool: true,
          });
        }}>
          {this.props.children}
        </span>
        <Drawer
          title={I18n('SETTING')}
          placement={this.state.drawerPlacement}
          closable={false}
          onClose={() => {
            this.setState({
              showTool: false,
            });
            History.setState({
              setting: History.state.setting
            });
            LocalStorage.set('h-react-setting-' + Auth.getLoggingId(), History.state.setting);
          }}
          visible={this.state.showTool}
        >
          <Row>
            <Col span={24}>
              <Checkbox
                defaultChecked={History.state.setting.enableHelp}
                name="enableHelp"
                onChange={this.save}
              >{I18n(['ENABLE', 'HELP', 'TIPS'])}</Checkbox>
            </Col>
          </Row>
        </Drawer>
      </span>
    );
  }
}

export default Container;
