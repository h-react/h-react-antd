import {message} from "antd";
import nanoid from "nanoid";
import {Parse} from "../index";

const AntdLangs = {
  "en_us": "en_US",
  "ja_jp": "ja_JP",
  "ko_kr": "ko_KR",
  "zh_cn": "zh_CN",
  "zh_hk": "zh_HK",
  "zh_tw": "zh_TW"
};

const BraftEditorLangs = {
  "en_us": "en",
  "ja_jp": "jpn",
  "ko_kr": "kr",
  "zh_cn": "zh",
  "zh_hk": "zh-hant",
  "zh_tw": "zh-hant"
};

const $History = {
  prefix: '',
  dispatching: false,
  dispatch: null,
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
          const key = nanoid(10);
          $History.state.subPages.push({key: key, url: location.url});
          $History.setState({
            subPages: $History.state.subPages,
            tabsActiveKey: key,
            currentUrl: location.url,
          });
          window.history.replaceState(null, null, $History.prefix + location.url);
        } else {
          message.error('History push fail:' + url);
        }
      }
    }
    $History.singleton = (url) => {
      if (!$History.dispatch()) {
        $History.dispatch(true);
        const location = Parse.urlDispatch(url);
        if ($History.state.router[location.pathname]) {
          const key = nanoid(10);
          $History.state.subPages = [{key: key, url: location.url}];
          $History.setState({
            subPages: $History.state.subPages,
            tabsActiveKey: key,
            currentUrl: location.url,
          });
          window.history.replaceState(null, null, $History.prefix + location.url);
        } else {
          message.error('History singleton fail:' + url);
        }
      }
    }
    $History.remove = (key) => {
      if (!$History.dispatch()) {
        if ($History.state.subPages.length < 2) {
          return;
        }
        $History.dispatch(true);
        let nextIdx = null;
        let delIdx = null;
        for (let i in $History.state.subPages) {
          i = Number.parseInt(i, 10);
          if (key === $History.state.subPages[i].key) {
            delIdx = i;
            if (key === $History.state.tabsActiveKey) {
              if (i === 0) {
                nextIdx = 0;
              } else {
                nextIdx = i - 1;
              }
            }
            break;
          }
        }
        if (delIdx === null) {
          return;
        }
        $History.state.subPages.splice(delIdx, 1);
        $History.setState({
          subPages: $History.state.subPages,
        });
        if (nextIdx !== null) {
          const next = $History.state.subPages[nextIdx];
          if (next !== null) {
            $History.setState({
              tabsActiveKey: next.key,
              currentUrl: next.url,
            });
            window.history.replaceState(null, null, $History.prefix + next.url);
          }
        }
      }
    }
    $History.replace = (url) => {
      if (!$History.dispatch()) {
        $History.dispatch(true);
        let idx = null;
        for (let i in $History.state.subPages) {
          if ($History.state.tabsActiveKey === $History.state.subPages[i].key) {
            idx = i;
            break;
          }
        }
        const key = nanoid(10);
        $History.state.subPages[idx] = {key: key, url: url};
        $History.setState({
          subPages: $History.state.subPages,
          tabsActiveKey: key,
          currentUrl: url,
        });
        window.history.replaceState(null, null, $History.prefix + url);
      }
    }
    $History.change = (key) => {
      if (!$History.dispatch()) {
        $History.dispatch(true);
        let url = null;
        for (let i in $History.state.subPages) {
          if (key === $History.state.subPages[i].key) {
            url = $History.state.subPages[i].url;
            break;
          }
        }
        $History.setState({
          tabsActiveKey: key,
          currentUrl: url,
        });
        window.history.replaceState(null, null, $History.prefix + url);
      }
    }
    // other
    $History.i18nAntd = () => {
      let l = AntdLangs[$History.state.i18n.lang];
      if (l === undefined) {
        l = AntdLangs.en_us
      }
      const obj = require(`antd/es/locale/${l}.js`);
      return obj.default;
    }
    $History.i18nBraftEditor = () => {
      return BraftEditorLangs[$History.state.i18n.lang];
    }
  },
}


export default $History;