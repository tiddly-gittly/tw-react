const Widget = require('$:/plugins/linonetwo/tw-react/widget.js').widget;
const React = require('$:/plugins/linonetwo/tw-react/react.js');
const ReactDom = require('$:/plugins/linonetwo/tw-react/react-dom.js');

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}

class LikeButtonWidget extends Widget {

}
exports.likeButtonExampleWidget = LikeButtonWidget;