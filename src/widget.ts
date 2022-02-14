import type * as ReactType from 'react';
type ReactType = typeof ReactType;
import type * as ReactDomType from 'react-dom';
type ReactDomType = typeof ReactDomType;
import { Widget as IWidget } from 'tiddlywiki'

const Widget: IWidget = require('$:/core/modules/widgets/widget.js').widget;
const ReactDom: ReactDomType = require('react-dom');
const React: ReactType = require('react');

export class ReactWidget extends Widget {
  constructor(parseTreeNode: any, options: any) {
    super(parseTreeNode, options);
  }

  protected reactComponent:
    | ReactType.ClassType<any, ReactType.ClassicComponent<any, ReactType.ComponentState>, ReactType.ClassicComponentClass<any>>
    | ReactType.FunctionComponent<any>
    | ReactType.ComponentClass<any>
    | null = null;

  protected getProps: () => any = () => ({});

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
    const currentProps = this.getProps();

    const containerElement = document.createElement('div');
    ReactDom.render(React.createElement(this.reactComponent, currentProps), containerElement);
    this.domNodes.push(containerElement);
    parent.appendChild(containerElement);
  }
}

exports.widget = ReactWidget;
