import './Braft.less';
import React, {Component} from 'react';
import {Input, Modal} from 'antd';
import BraftEditor from 'braft-editor'
import {History, I18n} from "../index";


export default class Braft extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      code: props.value || '',
      editorState: BraftEditor.createEditorState(props.value || ''),
    }
  }

  editorConf = () => {
    return {
      media: {
        accepts: {image: 'image/png,image/jpeg,image/gif', video: false, audio: false},
        externals: {image: 'image/png,image/jpeg,image/gif', video: false, audio: false}
      },
      extendControls: [
        'separator',
        {
          key: 'my_code',
          type: 'button',
          text: 'HTML',
          onClick: () => {
            this.state.code = this.state.editorState.toHTML();
            this.setState({
              code: this.state.code,
            });
            Modal.info({
              maskClosable: true,
              width: '75%',
              title: 'HTML ' + I18n('code'),
              okText: I18n('sure'),
              onOk: () => {
                this.setState({
                  editorState: BraftEditor.createEditorState(this.state.code),
                });
              },
              content: (
                <div className="braft-editor-code">
                  <Input.TextArea
                    rows={17}
                    defaultValue={this.state.editorState.toHTML()}
                    onChange={(evt) => {
                      this.setState({
                        code: evt.target.value,
                      });
                    }}
                  />
                </div>
              ),
            });
          }
        },
        {
          key: 'preview',
          type: 'button',
          text: I18n('preview'),
          onClick: () => {
            Modal.info({
              maskClosable: true,
              centered: true,
              title: I18n('preview'),
              content: (
                <div
                  className="braft-editor-mobile-preview"
                  dangerouslySetInnerHTML={{__html: this.state.editorState.toHTML()}}
                />
              ),
            });
          }
        }
      ],
    };
  }

  render() {
    return (
      <BraftEditor
        language={History.i18nBraftEditor()}
        value={this.state.editorState}
        onChange={(value) => {
          this.setState({
            editorState: value,
          });
          this.props.onChange(value.toHTML());
        }}
        {...this.editorConf()}
      />
    );
  }
}
