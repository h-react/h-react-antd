import React, {Component} from 'react';
import {Result, Typography} from 'antd';
import {CloseCircleOutlined, ClearOutlined, CoffeeOutlined} from '@ant-design/icons';

const {Paragraph, Text} = Typography;

export default class Error extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
    this.msg = props.msg || '';
    if (this.msg !== '') {
      console.error(this.msg);
    }
  }

  render() {
    return (
      <Result
        status="500"
        title="403"
        subTitle={
          <div>
            <p>Sorry, the server is busy.</p>
            <p style={{color: 'red'}}>{this.msg}</p>
          </div>
        }
      >
        <div className="desc">
          <Paragraph>
            <Text
              strong
              style={{
                fontSize: 16,
              }}
            >
              The content you submitted has the following error:
            </Text>
          </Paragraph>
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon"/> Your client has been frozen.
          </Paragraph>
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon"/> Your IP address has been frozen.
          </Paragraph>
          <Paragraph>
            <ClearOutlined className="site-result-demo-error-icon"/> You can try to clean up the browser cache.
          </Paragraph>
          <Paragraph>
            <CoffeeOutlined className="site-result-demo-error-icon"/> Server is extremely busy, visit it later.
          </Paragraph>
        </div>
      </Result>
    );
  }
}
