import './Guidance.less';
import React, {Component} from 'react';
import {Button, message, Tabs, Tag, Tooltip} from 'antd';
import {
  PushpinOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  TranslationOutlined,
  SettingOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import {Api, Auth, Document, History, I18n, I18nContainer, LocalStorage, Setting} from "../../index";
import Me from "../Me";

class Guidance extends Component {

  constructor(props) {
    super(props);

    this.state = {
      usualPages: LocalStorage.get('h-react-usual-pages') || [],
      fullscreen: false,
      contextMenu: null,
    }

  }

  renderUsual = () => {
    return (
      <div>
        {
          this.state.usualPages.map((mk, idx) => {
            const opt = JSON.parse(mk);
            return (
              <Tag
                key={idx}
                closable
                icon={<PushpinOutlined/>}
                color={History.state.currentUrl === opt.url ? "processing" : "default"}
                onClick={() => {
                }}
                onClose={(e) => {
                  e.preventDefault();
                  this.state.usualPages.splice(idx, 1);
                  this.setState({
                    usualPages: this.state.usualPages,
                  });
                  LocalStorage.set('h-react-usual-pages', this.state.usualPages);
                }}>
                {opt.label}
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
    const mk = JSON.stringify({
      label: History.state.subPages[this.state.contextMenu.idx].label,
      url: History.state.subPages[this.state.contextMenu.idx].url,
    });
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
          disabled={this.state.usualPages.includes(mk)}
          onClick={() => {
            this.state.usualPages.push(mk);
            this.setState({
              usualPages: this.state.usualPages,
              contextMenu: null,
            });
            LocalStorage.set('h-react-usual-pages', this.state.usualPages);
          }}>
          <PushpinOutlined/>设为常用
        </Button>
        <Button
          block danger
          type="text"
          disabled={
            History.state.subPages.length <= 0
            || History.state.currentUrl === History.state.subPages[this.state.contextMenu.idx].url
          }
          onClick={() => {
          }}
        >
          <CloseOutlined/>关闭标签
        </Button>
      </div>
    );
  }

  renderTabs = () => {
    return (
      <div className="tabs">
        <Tabs
          type="editable-card"
          hideAdd={true}
          size="default"
          tabPosition="top"
          onChange={(activeKey) => {
            const tag = History.state.subPages[activeKey];
            History.replace(tag.url);
          }}
        >
          {History.state.subPages.map((sub, idx) =>
            <Tabs.TabPane
              tab={
                <Tooltip placement="top" title={I18n('Right-click to view the menu')}>
                   <span onContextMenu={(evt) => {
                     evt.preventDefault();
                     this.setState({
                       contextMenu: {
                         idx: idx,
                         x: evt.pageX,
                         y: evt.pageY,
                         url: sub.url,
                       }
                     });
                   }}>{sub.icon || null}{sub.label}</span>
                </Tooltip>
              }
              key={idx}
              closable={History.state.subPages.length > 0 && History.state.currentUrl !== sub.url}
            />)
          })}
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
            <Setting placement="right">
              <Button size="small" icon={<SettingOutlined/>}>{I18n('SETTING')}</Button>
            </Setting>
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
            {History.state.logging && <Button size="small" type="primary"><Me/></Button>}
            <Button
              icon={<ArrowRightOutlined/>}
              size="small"
              type="danger"
              onClick={() => {
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
              }}
            >{I18n('logout')}</Button>
          </div>
        </div>
        {this.renderTabs()}
      </div>
    );
  }
}

export default Guidance;
