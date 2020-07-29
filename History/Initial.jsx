import './Initial.less';
import React, {Component} from 'react';
import {WechatOutlined, LeftOutlined} from '@ant-design/icons';
import {Api, Auth, I18n, Parse, History} from "h-react-antd";
import {message} from "antd";


class Initial extends Component {
  constructor(props) {
    super(props);

    const location = Parse.urlDispatch();

    this.state = {
      ...props.data,
      logging: Auth.isLogging(),
      subPages: [
        {url: location.pathname === '/' ? location.url : '/', ...History.router['/']},
      ],
    }

    // 分析路由
    if (location.pathname !== '/' && History.router[location.pathname]) {
      this.state.subPages.push({url: location.url, ...History.router[location.pathname]});
    }

    History.link(this);
  }

  componentDidMount = () => {
    const self = this;
    if (this.state.logging) {
      History.efficacy('init');
    }
  }

  renderApp = () => {
    let ele = null;
    if (this.state.logging) {
      ele = (
        <div className="subPages">
          <div className="back" onClick={() => History.pop()}><LeftOutlined/></div>
          <div className="subs">
            {
              this.state.subPages.map((item, idx) => {
                const Sub = item.component;
                return <div key={idx}><Sub props={this.props}/></div>;
              })
            }
          </div>
        </div>
      );
    } else {
      ele = (
        <div className="waitingWechat">
          <WechatOutlined/>
          <div className="tips">
            {I18n("WeChat authentication in progress")}
          </div>
        </div>
      );
    }
    return ele;
  }

  render() {
    return (
      <div className="app">
        {this.renderApp()}
      </div>
    );
  }
}

export default Initial;
