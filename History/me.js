import React, {useState, useEffect} from "react";
import {message, Form, Input, Button, Modal} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {Api, Auth, I18n} from 'h-react-antd';

export default (props) => {

  const [form] = Form.useForm();

  const [userInfo, setUserInfo] = useState({});
  const [visible, setVisible] = useState(false);
  const [querying, setQuerying] = useState(false);

  const getData = () => {
    if (Auth.isLogging()) {
      Api.query().post({
        ADMIN_USER_INFO: {},
        USER_META_CATEGORY: {},
        MAPPING: {
          method: "antd",
          keys: [
            "Yonna_QuickStart_Mapping_User_Sex",
          ]
        }
      }, (res) => {
        if (res.code === 200) {
          setUserInfo(res.data.ADMIN_USER_INFO);
        } else {
          message.error(res.msg);
        }
      })
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
    if (querying === true) {
      return;
    }
    setQuerying(true);
    // Api.query().post({I18N_SET: values}, (res) => {
    //   setQuerying(false);
    //   if (res.code === 200) {
    //     message.success(I18n('SUCCESS'));
    //     props.callback();
    //   } else {
    //     message.error(res.msg);
    //   }
    // });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div onClick={() => {
      if (visible === false) {
        form.setFieldsValue({
          password: '',
          confirm_password: '',
        });
        setVisible(true)
      }
    }}>
      <UserOutlined/>&nbsp;{userInfo.user_meta_name || userInfo.user_meta_nickname || '无名氏'}
      <Modal
        title={I18n(['CHANGE MY INFORMATION'])}
        visible={visible}
        footer={null}
        onOk={() => {
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        {
          userInfo.user_id &&
          <Form
            {...layout}
            form={form}
            name="me"
            initialValues={userInfo}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              key="password"
              name="password"
            >
              <Input.Password
                addonBefore={I18n("PASSWORD")}
                placeholder={
                  I18n(['PLEASE_INPUT', 'YOUR', 'NEW'])
                  + I18n("PASSWORD")
                  + '('
                  + I18n("Fill in the blank to indicate no modification")
                  + ')'
                }
                name="password"
                allowClear={true}
              />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.password !== currentValues.password}
            >
              {({getFieldValue}) => {
                console.log(getFieldValue('password'));
                return (getFieldValue('password') || '') !== '' ? (
                  <Form.Item
                    key="confirm_password"
                    name="confirm_password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: I18n(['CONFIRM', 'YOUR', 'PASSWORD']) + '!',
                      },
                      ({getFieldValue}) => ({
                        validator(rule, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(I18n('The two passwords that you entered do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      addonBefore={I18n("CONFIRM_PASSWORD")}
                      placeholder={I18n(['PLEASE_INPUT', 'YOUR', 'NEW']) + I18n("PASSWORD")}
                      name="password"
                      allowClear={true}
                    />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>
            {
              Object.entries(userInfo).map((v) => {
                if (v[0] === 'user_id') {
                  return null;
                }
                let field = v[0]
                if (field.indexOf('user_meta_') === 0) {
                  field = field.replace('user_meta_', '');
                }
                return (
                  <Form.Item
                    key={v[0]}
                    name={v[0]}
                    rules={[
                      {
                        required: true,
                        message: I18n(['PLEASE_INPUT', 'YOUR']) + I18n(field) + '!',
                      },
                    ]}
                  >
                    <Input
                      addonBefore={I18n(field)}
                      placeholder={I18n(['PLEASE_INPUT', 'YOUR', 'NEW']) + I18n(field)}
                      name={v[0]}
                      allowClear={true}
                    />
                  </Form.Item>
                );
              })
            }
            <Form.Item {...tailLayout}>
              <Button
                style={{width: '100%'}}
                htmlType="submit"
                disabled={querying}
                type={querying ? 'normal' : 'primary'}
                loading={querying}
              >
                {querying ? I18n('LOADING') : I18n('SAVE')}
              </Button>
            </Form.Item>
          </Form>
        }
      </Modal>
    </div>
  );
};