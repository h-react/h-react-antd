import React, {Component} from 'react';
import {Button, Form, Radio} from 'antd';
import {I18n} from 'h-react-antd';

class Approve extends Component {
  constructor(props) {
    super(props);

    this.form = React.createRef();

  }

  onFinish = values => {
    for (let i in values) {
      if (!values[i]) {
        values[i] = undefined;
      }
    }
    this.props.onApprove(values.status);
  };

  render() {
    return (
      <Form
        className="h-react-filter"
        ref={this.form}
        onFinish={this.onFinish}
      >
        <Form.Item name="status">
          <Radio.Group options={this.props.mapping}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">{I18n('SUBMIT')}</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Approve;