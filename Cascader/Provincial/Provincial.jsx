import React, {Component} from 'react';
import {Cascader} from 'antd';

import data from './data.json';

export default class Provincial extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
  }

  render() {
    return <Cascader
      options={data}
      onChange={(value) => {
        this.props.onChange(value);
      }}
    />;
  }
}