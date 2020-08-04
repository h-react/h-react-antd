import React, {Component} from 'react';
import {Tooltip} from 'antd';
import {I18n, History} from "../../index";

export default class Help extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (History.state.setting.enableHelpTips === true) {
      return (
        <Tooltip
          placement={this.props.placement || "top"}
          title={this.props.title || I18n('TIPS')}
        >
          {this.props.children}
        </Tooltip>
      );
    }
    return this.props.children;
  }
}
