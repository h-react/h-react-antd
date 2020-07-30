import {message} from "antd";
import {Parse} from "../index";

const $History = {
  app: null,
  router: {},
  prefix: '',
  dispatching: false,
  dispatch: null,
  push: null,
  pop: null,
  replace: null,
  efficacy: (action) => {
    const subs = document.querySelectorAll(".subPages >.subs > div");
    switch (action) {
      case 'init':
        if (subs.length === 1) {
          subs[subs.length - 1].className = 'first';
        } else if (subs.length === 2) {
          subs[subs.length - 2].className = 'diving';
          subs[subs.length - 1].className = 'first';
        }
        break;
      case 'push':
        subs[subs.length - 2].className = 'diving';
        subs[subs.length - 1].className = 'face';
        break;
      case 'pop':
        subs[subs.length - 1].className = 'leave';
        subs[subs.length - 2].className = 'face';
        break;
      case 'replace':
        subs[subs.length - 1].className = 'face';
        break;
    }
  },
  link: ($this) => {
    $History.app = $this;
    $History.state = $this.state;
    $History.setState = (data) => {
      $History.app.setState(data);
    };
    $History.getState = (key, callValue) => {
      const kArr = key.split('.');
      let tar = $History.state;
      let res = null;
      for (const k in kArr) {
        if (tar[kArr[k]] === undefined) {
          res = null;
          break;
        } else {
          res = tar[kArr[k]];
          tar = tar[kArr[k]];
        }
      }
      if (res === null && typeof callValue === 'function') {
        res = callValue();
      }
      return res;
    }
    $History.dispatch = (status) => {
      if (status === undefined) {
        return $History.dispatching;
      }
      $History.dispatching = status;
      if (status === true) {
        const t = setTimeout(() => {
          window.clearTimeout(t);
          $History.dispatching = false;
        }, 600)
      }
    }
    $History.push = (url) => {
      if (!$History.dispatch()) {
        $History.dispatch(true);
        const location = Parse.urlDispatch(url);
        if ($History.router[location.pathname]) {
          $this.state.subPages.push({url: location.url, ...$History.router[location.pathname]});
          $this.setState({
            subPages: $this.state.subPages,
          });
          window.history.replaceState(null, null, $History.prefix + location.url);
          const t = setTimeout(() => {
            window.clearTimeout(t);
            $History.efficacy('push');
          }, 50)
        } else {
          message.error('History push fail!');
        }
      }
    }
    $History.pop = () => {
      if (!$History.dispatch()) {
        if ($this.state.subPages.length <= 1) {
          window.history.replaceState(null, null, $History.prefix + '/');
          return;
        }
        $History.dispatch(true);
        $History.efficacy('pop');
        window.history.replaceState(null, null, $History.prefix + $this.state.subPages[$this.state.subPages.length - 2].url);
        const t = setTimeout(() => {
          window.clearTimeout(t);
          $this.state.subPages.pop();
          $this.setState({
            subPages: $this.state.subPages,
          })
        }, 430)
      }
    }
    $History.replace = (url) => {
      if (!$History.dispatch()) {
        $History.dispatch(true);
        if ($History.router[url]) {
          $this.state.subPages.pop();
          $this.state.subPages.push({url: url, ...$History.router[url]});
          $this.setState({
            subPages: $this.state.subPages,
          });
          window.history.replaceState(null, null, $History.prefix + url);
          const t = setTimeout(() => {
            window.clearTimeout(t);
            $History.efficacy('replace');
          }, 0)
        } else {
          message.error('History replace fail!');
        }
      }
    }
  }
}


export default $History;