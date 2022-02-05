import type * as ReactType from 'react';
type ReactType = typeof ReactType;
import type * as ReactDomType from 'react-dom';
type ReactDomType = typeof ReactDomType;

const Widget = require('$:/core/modules/widgets/widget.js').widget;
const ReactDom: ReactDomType = require('react-dom');
const React: ReactType = require('react');

class ReactWidget extends Widget {
  protected reactComponent:
    | ReactType.ClassType<any, ReactType.ClassicComponent<any, ReactType.ComponentState>, ReactType.ClassicComponentClass<any>>
    | ReactType.FunctionComponent<any>
    | null = null;

  /**
   * Lifecycle method: Render this widget into the DOM
   */
  render(parent: Node, nextSibling: Node) {
    this.parentDomNode = parent;
    this.execute();
    if (!this.reactComponent) {
      return;
    }
    this.computeAttributes();

    const containerElement = document.createElement('div');
    ReactDom.render(React.createElement(this.reactComponent, {}), containerElement);
    // DEBUG: console
    console.log(`this.reactComponent`, this.reactComponent);
    // DEBUG: console
    console.log(`containerElement`, containerElement);
    this.domNodes.push(containerElement);
    parent.appendChild(containerElement);
  }
}

exports.widget = ReactWidget;
