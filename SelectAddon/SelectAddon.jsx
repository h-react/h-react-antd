import './SelectAddon.less';
import React, {Component} from 'react';
import {Col, Select} from 'antd';

export default class SelectAddon extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || undefined,
    }
  }

  render() {
    return (
      <div className="h-react-select-addon">
        <span className="selector">
          <Select{...this.props}>
            {this.props.children}
          </Select>
        </span>
        <span className="addon">
          {this.props.addon}
        </span>
      </div>
    );
  }
}
