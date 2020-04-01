import React, {Component} from 'react';
import './Layout.scss';
import {Api, Auth} from 'api';

export default class AppLayout extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
    if (Auth.isOnline() === false) {
      alert('login offline');
      if (window.location.hostname.indexOf('127.0.0.1') === 0 || window.location.hostname.indexOf('localhost') === 0) {
        this.props.history.replace('/sign/in');
      } else {
        this.props.history.replace(Auth.getLoginPath());
      }
    }
  }

  componentDidMount() {
    Api.query().cache('User.Info.getInfo', {uid: Auth.getUid()}, (resUser) => {
      if (resUser.code === 200) {
        // nothing
      } else {
        alert(resUser.msg);
      }
    });
  }

  to = (url) => {
    this.props.history.push(url);
  };

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
