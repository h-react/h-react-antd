import React, {Component} from 'react';
import {Cascader} from 'antd';

import data from './data.json';

export default class Region extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
  }

  render() {
    return <Cascader
      options={data}
      value={this.props.value}
      onChange={(value) => {
        this.props.onChange(value);
      }}
    />;
  }
}
