import type * as ReactType from 'react';
type ReactType = typeof ReactType;
import type * as ReactDomType from 'react-dom';
import type * as ReactDomClientType from 'react-dom/client';
type ReactDomType = typeof ReactDomType & typeof ReactDomClientType;
import type { IChangedTiddlers } from 'tiddlywiki';
import type { IReactWidget, ITWReactProps, ITWReactPropsDefault } from './type';

import { widget as Widget } from '$:/core/modules/widgets/widget.js';
const ReactDom: ReactDomType = require('react-dom');
const React: ReactType = require('react');
if (typeof window !== 'undefined') {
  window.React = React;
} else if (typeof global !== 'undefined') {
  global.React = React;
}

// TODO: remove this hack after https://github.com/Jermolene/TiddlyWiki5/pull/6699 merged
/*
Remove any DOM nodes created by this widget or its children
*/
// @ts-expect-error Type '(parentRemoved: boolean) => void' is not assignable to type '() => void'.ts(2322)
Widget.prototype.removeChildDomNodes = function(parentRemoved: boolean) {
  // If this widget has directly created DOM nodes, delete them and exit. This assumes that any child widgets are contained within the created DOM nodes, which would normally be the case
  // If parent has already detatch its dom node from the document, we don't need to do it again.
  if (this.domNodes.length > 0 && !parentRemoved) {
    $tw.utils.each(this.domNodes, function(domNode) {
      domNode?.parentNode?.removeChild(domNode);
    });
    this.domNodes = [];
    // inform child widget to do some custom cleanup in a overrided sub-class method, and tell child widget that parent has already done the update, so children don't need to do anything.
    parentRemoved = true;
  }
  // If parentRemoved is unset or false, will ask the child widgets to delete their DOM nodes
  $tw.utils.each(this.children, function(childWidget) {
    // @ts-expect-error Expected 0 arguments, but got 1.ts(2554)
    childWidget?.removeChildDomNodes(parentRemoved);
  });
};

class ReactWidgetImpl<
  IProps extends ITWReactProps = ITWReactPropsDefault,
> extends Widget implements IReactWidget<IProps> {
  root: ReturnType<typeof ReactDom.createRoot> | undefined;
  containerElement: HTMLDivElement | undefined;

  constructor(parseTreeNode: any, options: any) {
    super(parseTreeNode, options);
  }

  refresh(changedTiddlers: IChangedTiddlers) {
    // we don't need to refresh mount point of react-dom
    return false;
  }

  /**
   * User of tw-react need to assign his react component to this property.
   */
  reactComponent:
    | ReactType.ClassType<any, ReactType.ClassicComponent<any, ReactType.ComponentState>, ReactType.ClassicComponentClass<any>>
    | ReactType.FunctionComponent<any>
    | ReactType.ComponentClass<any>
    | null = null;

  getProps: () => IProps = () => ({ parentWidget: this } as unknown as IProps);

  /**
   * Lifecycle method: Render this widget into the DOM
   */
  render(parent: Element, nextSibling: Element | null) {
    this.parentDomNode = parent;
    this.computeAttributes();
    this.execute();
    if (!this.reactComponent) {
      return;
    }
    const currentProps = this.getProps() ?? {};
    if (currentProps.parentWidget === undefined || currentProps.parentWidget === null) {
      currentProps.parentWidget = this;
    }
    /** don't need this because we handle the initial render of child widget in the `useWidget` hook */
    // this.renderChildren(parent,nextSibling);

    if (this.root === undefined || this.containerElement === undefined) {
      this.containerElement = document.createElement('div');
      this.root = ReactDom.createRoot(this.containerElement);
    }
    this.domNodes.push(this.containerElement);
    parent.appendChild(this.containerElement);
    const reactElement = React.createElement(this.reactComponent, currentProps);
    this.root.render(reactElement);
  }

  refreshSelf() {
    var nextSibling = this.findNextSiblingDomNode();
    /** don't unmount root if we are just refresh tiddler, not closing it */
    // this.removeChildDomNodes();
    this.render(this.parentDomNode, nextSibling);
  }

  removeChildDomNodes() {
    super.removeChildDomNodes();
    this.root?.unmount?.();
  }
}

declare var exports: {
  widget: typeof ReactWidgetImpl;
};
exports.widget = ReactWidgetImpl;
