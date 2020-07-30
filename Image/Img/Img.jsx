import React, {Component} from 'react';
import Image from '../index';

class Img extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = () => {
    if (typeof this.props.href === 'string') {
      this.props.history.push(this.props.href);
    }
  };

  render() {
    return (
      <img
        src={Image.adapt(this.props.src)}
        alt={this.props.alt || 'image'}
        style={this.props.style}
        onClick={this.onClick}
      />
    );
  }
}

export default Img;
