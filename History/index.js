import {message} from "antd";
import {Parse} from "../index";

const AntdLangs = {
  "en_us": "en_US",
  "ja_jp": "ja_JP",
  "ko_kr": "ko_KR",
  "zh_cn": "zh_CN",
  "zh_hk": "zh_TW",
  "zh_tw": "zh_TW"
};

const $History = {
  prefix: '',
  dispatching: false,
  dispatch: null,
  i18nAntd: () => {
    let l = AntdLangs[$History.state.i18n.lang];
    if (l === undefined) {
      l = AntdLangs.en_us
    }
    const obj = require(`antd/es/locale/${l}.js`);
    return obj.default;
  },
  efficacy: (action, idx = 0) => {
    idx = Number.parseInt(idx, 10);
    const subs = document.querySelectorAll(".subPages >.subs > div");
    switch (action) {
      case 'init':
        subs[subs.length - 1].className = 'show';
        break;
      case 'push':
        for (let i = 0; i < subs.length - 1; i++) {
          subs[i].className = 'hide';
        }
        subs[subs.length - 1].className = 'show';
        break;
      case 'remove':
      case 'change':
        for (let i = 0; i < subs.length; i++) {
          subs[i].className = (i === idx) ? 'show' : 'hide';
        }
        break;
    }
  },
  link: ($this) => {
    $History.app = $this;
    $History.state = $this.state;
    $History.setState = (data) => {
      for (let i in data) {
        $History.state[i] = data[i];
      }
      $History.app.setState($History.state);
    };
    $History.getState = (key, callValue) => {
      return Parse.objGet($History.state, key, '.', callValue);
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
        }, 200)
      }
    }
    $History.push = (url) => {
      if (!$History.dispatch()) {
        $History.dispatch(true);
        const location = Parse.urlDispatch(url);
        if ($History.state.router[location.pathname]) {
          $History.state.subPages.push(location.url);
          $History.setState({
            subPages: $History.state.subPages,
            tabsActiveKey: '' + ($History.state.subPages.length - 1),
            currentUrl: location.url,
          });
          window.history.replaceState(null, null, $History.prefix + location.url);
          const t = setTimeout(() => {
            window.clearTimeout(t);
            $History.efficacy('push');
          }, 50)
        } else {
          message.error('History push fail:' + url);
        }
      }
    }
    $History.remove = (idx, next) => {
      if (!$History.dispatch()) {
        if ($this.state.subPages.length < 2) {
          return;
        }
        $History.dispatch(true);
        $History.state.subPages.splice(idx, 1);
        $History.setState({
          subPages: $this.state.subPages,
          tabsActiveKey: '' + next,
          currentUrl: $History.state.subPages[next],
        });
        window.history.replaceState(null, null, $History.prefix + $History.state.subPages[next]);
        $History.efficacy('remove', next);
      }
    }
    $History.change = (idx) => {
      if (!$History.dispatch()) {
        $History.dispatch(true);
        $History.efficacy('change', idx);
        $History.setState({
          tabsActiveKey: '' + idx,
          currentUrl: $this.state.subPages[idx],
        });
        window.history.replaceState(null, null, $History.prefix + $History.state.subPages[idx]);
      }
    }
  },
}


export default $History;