import './TopOperate.less';
import React, {Component} from 'react';
import {Button, message, Tag} from 'antd';
import {PushpinOutlined} from '@ant-design/icons';
import {LocalStorage, History, I18nContainer, Api, I18n, Auth} from 'h-react-antd';
import Me from "../Me";

class TopOperate extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="top-operate">
        <div className="left">
          {
            History.state.usualPages.map((opt, idx) => {
              return (
                <Tag
                  key={idx}
                  closable
                  icon={<PushpinOutlined/>}
                  onClick={() => {
                    alert();
                  }}
                  onClose={(e) => {
                    e.preventDefault();
                    History.state.usualPages.pop();
                    History.setState({
                      usualPages: History.state.usualPages,
                    });
                    LocalStorage.set('h-react-usual-pages', History.state.usualPages);
                  }}>
                  {opt.label}
                </Tag>
              );
            })
          }
        </div>
        <div className="right">
          {History.state.logging && <Button size="small" type="primary"><Me/></Button>}
          <I18nContainer placement="right"><Button size="small">Translate</Button></I18nContainer>
          <Button size="small" type="danger" onClick={() => {
            Api.query().post({USER_LOGOUT: {}}, (res) => {
              if (res.code === 200) {
                message.success(I18n('LOGOUT_SUCCESS'));
                Auth.clearLogging();
                History.state.logging = false;
                History.setState({
                  logging: History.state.logging,
                });
              } else {
                message.error(I18n(res.msg));
              }
            });
          }}>{I18n('logout')}</Button>
        </div>
      </div>
    );
  }
}

export default TopOperate;
