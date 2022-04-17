import type * as ReactType from 'react';
type ReactType = typeof ReactType;
import type * as ReactDomType from 'react-dom';
import type * as ReactDomClientType from 'react-dom/client';
type ReactDomType = typeof ReactDomType & typeof ReactDomClientType;
import type { Widget as IWidget, IChangedTiddlers } from 'tiddlywiki';

const Widget = require('$:/core/modules/widgets/widget.js').widget as typeof IWidget;
const ReactDom: ReactDomType = require('react-dom');
const React: ReactType = require('react');

export class ReactWidget<P extends {} = Record<string, any>> extends Widget {
  constructor(parseTreeNode: any, options: any) {
    super(parseTreeNode, options);
  }

  refresh(changedTiddlers: IChangedTiddlers) {
    // we don't need to refresh mount point of react-dom
    return false;
  }

  protected reactComponent:
    | ReactType.ClassType<any, ReactType.ClassicComponent<any, ReactType.ComponentState>, ReactType.ClassicComponentClass<any>>
    | ReactType.FunctionComponent<any>
    | ReactType.ComponentClass<any>
    | null = null;

  protected getProps: () => P = () => ({} as P);

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
    const root = ReactDom.createRoot(containerElement);
    const reactElement = React.createElement(this.reactComponent, currentProps);
    root.render(reactElement);
    this.domNodes.push(containerElement);
    parent.appendChild(containerElement);
  }
}

exports.widget = ReactWidget;
export type IReactWidget = typeof ReactWidget;
