import type { ReactWidget as ReactWidgetType } from './widget';
// use `typeof` to avoid "Type 'ReactWidget' is not a constructor function type.ts(2507)"
const Widget: typeof ReactWidgetType = require('$:/plugins/linonetwo/tw-react/widget.js').widget;
import type * as ReactType from 'react';
type ReactType = typeof ReactType;
import type * as ReactDomType from 'react-dom';
type ReactDomType = typeof ReactDomType;

// TODO: use rollup external instead
const ReactDom: ReactDomType = require('react-dom');
const React: ReactType = require('react');

const e = React.createElement;

interface IProps {
  /**
   * Tiddler to contain the serialized JSON component state
   */
  stateTiddler: string;
}
interface IState {
  liked: boolean;
}
class LikeButton extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const defaultState: IState = { liked: false };
    // deserialize state from tiddlywiki
    try {
      this.state = JSON.parse($tw.wiki.getTiddlerText(this.props.stateTiddler, '{}')) ?? defaultState;
    } catch {
      this.state = defaultState;
    }
  }

  setState(nextState: IState) {
    super.setState(nextState);
    // serialize state to tiddlywiki
    $tw.wiki.setText(this.props.stateTiddler, 'text', undefined, JSON.stringify(nextState));
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e('button', { onClick: () => this.setState({ liked: true }) }, 'Like');
  }
}

class LikeButtonWidget extends Widget {
  reactComponent = LikeButton;
  getProps = () => ({ stateTiddler: this.getAttribute('stateTiddler') });
}
exports.likeButtonExampleWidget = LikeButtonWidget;
