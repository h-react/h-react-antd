import React, {Component} from 'react';
import {Button} from 'antd';
import {TranslationOutlined} from '@ant-design/icons';
import {I18n, I18nContainer, Navigator} from 'h-react-antd/index';
import LoginForm from './Form'
import './Login.less';

class Login extends Component {

  render() {
    return (
      <div className="h-react-login">
        <div className="bg"/>
        <div className="login-box">
          <div className="login-form">
            <h4 className="tit">{I18n('LOGIN')}</h4>
            <LoginForm/>
          </div>
        </div>
        <I18nContainer placement="right">
          <Button className="tranBtn" icon={<TranslationOutlined/>}>{I18n('Translate', Navigator.language())}</Button>
        </I18nContainer>
      </div>
    );
  }
}

export default Login;
