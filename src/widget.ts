import type * as ReactType from 'react';
type ReactType = typeof ReactType;
import type * as ReactDomType from 'react-dom';
type ReactDomType = typeof ReactDomType;

const Widget = require('$:/core/modules/widgets/widget.js').widget;
const ReactDom: ReactDomType = require('react-dom');

class ReactWidget extends Widget {
  protected reactComponent: ReactType.DOMElement<ReactType.DOMAttributes<Element>, Element> | null = null;

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
    ReactDom.render(this.reactComponent, containerElement);
    this.domNodes.push(containerElement);
  }
}

exports.widget = ReactWidget;
