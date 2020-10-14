import React, {useState} from "react";
import {message, Form, Input, Button, Checkbox} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {Api, History, I18n, LocalStorage} from 'h-react-antd/index';

export default () => {

  const [formData, setFormData] = useState({
    account: LocalStorage.get('l_acc'),
    password: undefined,
    remember: LocalStorage.get('l_rem') === 1,
    loginStatus: 'free',
  });

  const layout = {
    labelCol: {
      span: 0,
    },
    wrapperCol: {
      span: 24,
    },
  };
  const
    tailLayout = {
      wrapperCol: {
        offset: 0,
        span: 24,
      },
    };

  const onFinish = values => {
    console.log('Success:', values);
    if (formData.loginStatus !== 'free') {
      return;
    }
    setFormData({...formData, loginStatus: 'ing'});
    values.license_id = [1, 2];
    Api.query().post({USER_LOGIN: values}, (response) => {
      Api.handle(response,
        () => {
          message.success(I18n('LOGIN_SUCCESS'));
          setFormData({...formData, loginStatus: 'ok'});
          if (values.remember === true) {
            LocalStorage.set('l_rem', values.remember ? 1 : 0);
            LocalStorage.set('l_acc', values.account);
          }
          LocalStorage.set('h-react-logging-id', response.data.user_id);
          History.setState({loggingId: response.data.user_id});
        },
        () => {
          message.warning(I18n(response.msg));
          setTimeout(() => {
            setFormData({...formData, loginStatus: 'free'});
          }, 300);
        },
        () => {
          message.error(I18n('fail'));
          setTimeout(() => {
            setFormData({...formData, loginStatus: 'free'});
          }, 300);
        },
      );
    });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      {...layout}
      name="login"
      initialValues={formData}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="account"
        label={I18n('ACCOUNT')}
        rules={[{required: true}]}
      >
        <Input
          name="account"
          maxLength={20}
          allowClear={true}
          prefix={<UserOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}
          placeholder={I18n(['YOUR', 'ACCOUNT'])}
        />
      </Form.Item>
      <Form.Item
        name="password"
        label={I18n('PASSWORD')}
        rules={[{required: true}]}
      >
        <Input.Password
          name="password"
          maxLength={16}
          prefix={<LockOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}
          placeholder={I18n(['YOUR', 'PASSWORD'])}
        />
      </Form.Item>
      <Form.Item>
        <Form.Item {...tailLayout} name="remember" valuePropName="checked" noStyle>
          <Checkbox>{I18n('REMEMBER_ME')}</Checkbox>
        </Form.Item>
        <Button type="link">{I18n('FORGOT_PASSWORD')}</Button>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button
          style={{width: '100%'}}
          htmlType="submit"
          type={formData.loginStatus === 'free' ? 'primary' : formData.loginStatus === 'ok' ? 'secondary' : 'normal'}
          loading={formData.loginStatus !== 'free'}
        >
          {formData.loginStatus === 'free' ? I18n('SUBMIT') : formData.loginStatus === 'ok' ? I18n('LOADING') : I18n('ACCESSING')}
        </Button>
      </Form.Item>
    </Form>
  );
};