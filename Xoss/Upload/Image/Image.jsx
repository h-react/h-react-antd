import React, {Component} from 'react';
import {message, Modal, Upload} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {I18n, LocalStorage, Xoss} from '../../../index';

export default class Image extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.maxQuantity = this.props.maxQuantity || 1;
    this.maxSize = Number.parseInt((this.props.maxSize || 1), 10); // MB
    this.fileType = this.props.fileType || ['image/jpeg', 'image/png', 'image/gif'];

    let fileList = [];
    if (this.props.value) {
      if (typeof this.props.value === 'string') {
        fileList = [{uid: this.props.value, name: I18n('picture'), status: 'done', url: Xoss.url(this.props.value)}];
      } else if (Array.isArray(this.props.value)) {
        const tmp = [];
        this.props.value.forEach((val) => {
          tmp.push({uid: val, name: I18n('picture'), status: 'done', url: Xoss.url(val)});
        });
        fileList = tmp;
      }
    }

    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: fileList,
    }
  }

  beforeUpload = (file) => {
    const isImage = this.fileType.includes(file.type);
    if (!isImage) {
      message.error(I18n('You can only upload') + ' ' + this.fileType.join(',') + ' ' + I18n('file'));
    }
    const isOver = file.size / 1024 / 1024 < this.maxSize;
    if (!isOver) {
      message.error(I18n('Image must smaller than') + this.maxSize + 'MB!');
    }
    return isImage && isOver;
  }

  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  render() {
    return (
      <div>
        <Upload
          action="/xoss"
          data={{
            client_id: LocalStorage.get('cid'),
            scope: 'XOSS_UPLOAD',
          }}
          listType="picture-card"
          fileList={this.state.fileList}
          onPreview={this.handlePreview}
          beforeUpload={this.beforeUpload}
          onChange={({fileList}) => {
            const files = [];
            let ing = false;
            fileList.forEach((f, idx) => {
              if (f.response) {
                if (f.response.error === 0 && f.response.data[0].result === 1) {
                  files.push(f.response.data[0].data.xoss_key);
                } else {
                  message.error(f.response.data[0].msg);
                  f.thumbUrl = null;
                  f.status = 'error';
                }
              }
              if (f.status === 'uploading') {
                ing = true;
              }
            });
            this.setState({
              fileList: fileList,
            });
            if (!ing) {
              this.props.onChange(files);
            }
          }}
        >
          {
            this.state.fileList.length >= this.maxQuantity
              ?
              null
              :
              <div>
                <PlusOutlined/>
                <div style={{marginTop: 8}}>{I18n('upload')}</div>
              </div>
          }
        </Upload>
        <Modal
          visible={this.state.previewVisible}
          title={this.state.previewTitle}
          footer={null}
          onCancel={() => this.setState({previewVisible: false})}
        >
          <img alt="upload" style={{width: '100%'}} src={this.state.previewImage}/>
        </Modal>
      </div>
    );
  }
}
