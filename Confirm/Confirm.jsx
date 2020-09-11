import React, {Component} from 'react';
import {Popconfirm} from 'antd';
import {I18n} from "../index";


export default class Confirm extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <Popconfirm
        placement="topRight"
        title={I18n('Are you sure you want to perform this operation?')}
        onConfirm={this.props.onConfirm}
        disabled={this.props.disabled || false}
      >
        {this.props.children}
      </Popconfirm>
    );
  }
}
