import type { IReactWidgetConstructor } from './widget-type';

const Widget = (require('$:/plugins/linonetwo/tw-react/widget.js') as { widget: IReactWidgetConstructor }).widget;
import type * as ReactType from 'react';
type ReactType = typeof ReactType;
import type * as ReactDomType from 'react-dom';
import { ExampleFunction } from './exampleFunction';
type ReactDomType = typeof ReactDomType;

// you should set these to external in your build tool like `external: ['$:/*', 'react', 'react-dom'],`
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

    return (
      <button onClick={() => this.setState({ liked: true })}>
        Like <ExampleFunction />
      </button>
    );
  }
}

class LikeButtonWidget extends Widget {
  reactComponent = LikeButton;
  getProps = () => ({ stateTiddler: this.getAttribute('stateTiddler') });
}
exports.likeButtonExampleWidget = LikeButtonWidget;
