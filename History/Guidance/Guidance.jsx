import './Guidance.less';
import React, {Component} from 'react';
import {Button, message, Tabs, Tag} from 'antd';
import {
  PushpinOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  TranslationOutlined,
  SettingOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  ClearOutlined,
  UserOutlined,
  DeleteColumnOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import {
  Api,
  Document,
  Navigator,
  History,
  I18n,
  I18nContainer,
  LocalStorage,
  Parse,
  SettingContainer,
  SettingHelp, XossShow,
} from "../../index";
import Help from "../../Setting/Help";

class Guidance extends Component {

  constructor(props) {
    super(props);

    this.state = {
      usualPages: LocalStorage.get('h-react-usual-pages') || [],
      fullscreen: false,
      contextMenu: null,
    }

  }

  componentDidMount() {
    const self = this;
    if (document.addEventListener) {
      const fullscreenHandler = (e) => {
        self.setState({
          fullscreen: Document.isFullscreen()
        });
      }
      document.addEventListener('webkitfullscreenchange', fullscreenHandler, false);
      document.addEventListener('mozfullscreenchange', fullscreenHandler, false);
      document.addEventListener('fullscreenchange', fullscreenHandler, false);
      document.addEventListener('MSFullscreenChange', fullscreenHandler, false);
    }
  }

  renderUsual = () => {
    return (
      <div className="usual">
        {
          this.state.usualPages.map((url, idx) => {
            const location = Parse.urlDispatch(url);
            const router = History.state.router[location.pathname];
            if (!router) {
              return null;
            }
            return (
              <Tag
                key={idx}
                closable
                icon={<PushpinOutlined/>}
                color={History.state.currentUrl === url ? "#2598ea" : "default"}
                onClick={() => {
                  History.push(url);
                }}
                onClose={(e) => {
                  e.preventDefault();
                  this.state.usualPages.splice(idx, 1);
                  this.setState({
                    usualPages: this.state.usualPages,
                  });
                  LocalStorage.set('h-react-usual-pages', this.state.usualPages);
                }}>

                {I18n(router.label)}
              </Tag>
            );
          })
        }
      </div>
    );
  }

  renderContextMenu = () => {
    if (this.state.contextMenu === null) {
      return null;
    }
    const len = Object.entries(History.state.subPages).length;
    return (
      <div
        className="right-cm"
        style={{top: this.state.contextMenu.y - 10, left: this.state.contextMenu.x - 10}}
        onMouseLeave={() => {
          this.setState({
            contextMenu: null,
          });
        }}
      >
        <Button
          block
          type="text"
          disabled={this.state.usualPages.includes(this.state.contextMenu.url)}
          onClick={() => {
            if (this.state.usualPages.length >= 5) {
              message.error(I18n('Up to 5 tags'));
              return;
            }
            this.state.usualPages.push(this.state.contextMenu.url);
            this.setState({
              usualPages: this.state.usualPages,
              contextMenu: null,
            });
            LocalStorage.set('h-react-usual-pages', this.state.usualPages);
          }}>
          <PushpinOutlined/>{I18n('Join common')}
        </Button>
        <Button
          block
          type="text"
          onClick={() => {
            History.push(this.state.contextMenu.url);
          }}
        >
          <CopyOutlined/>{I18n(['NEW', 'TAB'])}
        </Button>
        <Button
          block danger
          type="text"
          disabled={len < 2}
          onClick={() => {
            History.singleton(this.state.contextMenu.url);
            this.setState({
              contextMenu: null,
            });
          }}
        >
          <DeleteColumnOutlined/>{I18n(['CLOSE', 'OTHER'])}
        </Button>
        <Button
          block danger
          type="text"
          disabled={len < 2}
          onClick={() => {
            History.remove(this.state.contextMenu.key);
            this.setState({
              contextMenu: null,
            });
          }}
        >
          <CloseOutlined/>{I18n(['CLOSE', 'TAB'])}
        </Button>
      </div>
    );
  }

  renderTabGuide = () => {
    return (
      <div className="bars-guides">
        <Tabs
          type="editable-card"
          hideAdd={true}
          size="default"
          tabPosition="top"
          activeKey={History.state.tabsActiveKey}
          onChange={(targetKey) => {
            History.change(targetKey);
          }}
          onEdit={(targetKey, action) => {
            if (action === 'remove') {
              History.remove(targetKey);
            }
          }}
          tabBarStyle={{}}
        >
          {
            History.state.subPages.map((val) => {
              const location = Parse.urlDispatch(val.url);
              const router = History.state.router[location.pathname];
              return <Tabs.TabPane
                key={val.key}
                tab={
                  <SettingHelp
                    placement="top"
                    title={I18n('Right-click to view the menu')}
                  >
                  <span onContextMenu={(evt) => {
                    evt.preventDefault();
                    this.setState({
                      contextMenu: {
                        key: val.key,
                        x: evt.pageX,
                        y: evt.pageY,
                        url: val.url,
                      }
                    });
                  }}>{router.icon || null}{I18n(router.label)}</span>
                  </SettingHelp>
                }
                closable={History.state.subPages.length > 1}
              />
            })
          }
        </Tabs>
        {this.renderContextMenu()}
      </div>
    );
  }

  render() {

    if (History.state.guidance === false) {
      return null;
    }

    const theme = History.state.setting.enableDarkMenu ? 'dark' : 'light';
    const btnType = History.state.setting.enableDarkMenu ? 'text' : 'default';

    return (
      <div className="guidance">
        <div className={`top-operate ${theme}`}>
          <div className="left">{this.renderUsual()}</div>
          <div className="right">
            <SettingContainer placement="right">
              <Button
                type={btnType}
                size="small"
                icon={<SettingOutlined/>}
              >{I18n('SETTING')}</Button>
            </SettingContainer>
            {
              History.state.setting.enableFullscreen &&
              <Button
                type={this.state.fullscreen ? 'dashed' : btnType}
                size="small"
                icon={this.state.fullscreen ? <FullscreenExitOutlined/> : <FullscreenOutlined/>}
                onClick={() => {
                  const fullscreen = !this.state.fullscreen;
                  this.setState({fullscreen: fullscreen});
                  Document.fullscreen(fullscreen);
                }}
              >{I18n('FULLSCREEN')}</Button>
            }
            {
              History.state.setting.enableClearCache &&
              <Help title={I18n('Need to log in again')}>
                <Button
                  type={btnType}
                  size="small"
                  icon={this.state.fullscreen ? <ClearOutlined/> : <ClearOutlined/>}
                  onClick={() => {
                    message.info(I18n('Cache has been emptied'));
                    LocalStorage.clearAll();
                    const tgc = setTimeout(() => {
                      window.clearTimeout(tgc);
                      window.location = window.location;
                    }, 500)
                  }}
                >{I18n('CLEAR CACHE')}</Button>
              </Help>
            }
            <I18nContainer placement="right">
              <Help title={I18n('Switch language')}>
                <Button
                  type={btnType}
                  size="small"
                  icon={<TranslationOutlined/>}
                >
                  {I18n('Translate', Navigator.language())}
                </Button>
              </Help>
            </I18nContainer>
            {
              History.state.loggingId !== null &&
              <Help title={I18n('Click to modify personal password')}>
                <Button size="small" type="primary" onClick={() => {
                  History.push('/user/password');
                }}>
                  <UserOutlined/> {I18n(['modify', 'password'])}
                </Button>
              </Help>
            }
            <Help title={I18n(['LOGOUT', 'LOGIN'])}>
              <Button
                icon={<ArrowRightOutlined/>}
                danger
                size="small"
                type="primary"
                onClick={() => {
                  message.loading(I18n('LOGGING OUT'));
                  Api.query().post({USER_LOGOUT: {}}, (response) => {
                    Api.handle(response,
                      () => {
                        message.success(I18n('LOGOUT_SUCCESS'));
                        History.setState({
                          loggingId: null,
                        });
                        LocalStorage.set('h-react-logging-id', null);
                      }
                    );
                  });
                }}
              >{I18n('logout')}</Button>
            </Help>
          </div>
        </div>
        {this.renderTabGuide()}
      </div>
    );
  }
}

export default Guidance;
