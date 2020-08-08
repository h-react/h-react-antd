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
} from '@ant-design/icons';
import {
  Api,
  Document,
  History,
  I18n,
  I18nContainer,
  LocalStorage, Parse,
  SettingContainer,
  SettingHelp
} from "../../index";
import Me from "../Me";
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
                color={History.state.currentUrl === url ? "processing" : "default"}
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
    return (
      <div
        className="right-cm"
        style={{top: this.state.contextMenu.y, left: this.state.contextMenu.x}}
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
          block danger
          type="text"
          disabled={History.state.subPages.length < 2}
          onClick={() => {
            let next = 0;
            const targetKey = this.state.contextMenu.idx;
            if (targetKey === History.state.tabsActiveKey) {
              if (targetKey === 0) {
                next = 0;
              } else {
                next = targetKey - 1;
              }
            } else if (targetKey > History.state.tabsActiveKey) {
              next = targetKey - 1;
            }
            History.remove(targetKey, next);
            History.setState({
              tabsActiveKey: '' + next,
            });
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
      <div className="barsGuides">
        <Tabs
          type="editable-card"
          hideAdd={true}
          size="default"
          tabPosition="top"
          activeKey={History.state.tabsActiveKey}
          onChange={(activeKey) => {
            History.change(activeKey);
          }}
          onEdit={(targetKey, action) => {
            if (action === 'remove') {
              let next = Number.parseInt(History.state.tabsActiveKey) - 1;
              if (targetKey === History.state.tabsActiveKey) {
                if (targetKey === '0') {
                  next = 0;
                } else {
                  next = Number.parseInt(targetKey) - 1;
                }
              } else if (targetKey > History.state.tabsActiveKey) {
                next = Number.parseInt(targetKey) - 1;
              }
              History.remove(targetKey, next);
              History.setState({
                tabsActiveKey: '' + next,
              });
            }
          }}
        >
          {
            History.state.subPages.map((url, idx) => {
              const location = Parse.urlDispatch(url);
              const router = History.state.router[location.pathname];
              return <Tabs.TabPane
                tab={
                  <SettingHelp
                    placement="top"
                    title={I18n('Right-click to view the menu')}
                  >
                  <span onContextMenu={(evt) => {
                    evt.preventDefault();
                    this.setState({
                      contextMenu: {
                        idx: idx,
                        x: evt.pageX,
                        y: evt.pageY,
                        url: url,
                      }
                    });
                  }}>{router.icon || null}{I18n(router.label)}</span>
                  </SettingHelp>
                }
                key={idx}
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
    return (
      <div className="guidance">
        <div className="top-operate">
          <div className="left">{this.renderUsual()}</div>
          <div className="right">
            <SettingContainer placement="right">
              <Button size="small" icon={<SettingOutlined/>}>{I18n('SETTING')}</Button>
            </SettingContainer>
            <Button
              size="small"
              icon={this.state.fullscreen ? <FullscreenExitOutlined/> : <FullscreenOutlined/>}
              type={this.state.fullscreen ? 'dashed' : 'default'}
              onClick={() => {
                const fullscreen = !this.state.fullscreen;
                this.setState({fullscreen: fullscreen});
                Document.fullscreen(fullscreen);
              }}
            >{I18n('FULLSCREEN')}</Button>
            <I18nContainer placement="right">
              <Button size="small" icon={<TranslationOutlined/>}>Translate</Button>
            </I18nContainer>
            {
              History.state.loggingId !== null &&
              <Help title={I18n('Click to modify personal information')}>
                <Button size="small" type="primary"><Me/></Button>
              </Help>
            }
            <Help title={I18n(['LOGOUT', 'LOGIN'])}>
              <Button
                icon={<ArrowRightOutlined/>}
                size="small"
                type="danger"
                onClick={() => {
                  message.loading(I18n('LOGGING OUT'));
                  Api.query().post({USER_LOGOUT: {}}, (res) => {
                    if (res.code === 200) {
                      message.success(I18n('LOGOUT_SUCCESS'));
                      History.setState({
                        loggingId: null,
                      });
                      LocalStorage.set('h-react-logging-id', null);
                    } else {
                      message.error(I18n(res.msg));
                    }
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
