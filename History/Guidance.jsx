import './Guidance.less';
import React, {Component} from 'react';
import {Tabs} from 'antd';
import {History} from "../index";

class Guidance extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    return (
      <div className="guidance">
        <Tabs
          type="editable-card"
          hideAdd={true}
          size="default"
          onChange={(activeKey) => {
            const tag = History.state.subPages[activeKey];
            History.replace(tag.url);
          }}
        >
          {History.state.subPages.map((sub, idx) => (
            <Tabs.TabPane tab={sub.label} key={idx} closable={true}/>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default Guidance;
