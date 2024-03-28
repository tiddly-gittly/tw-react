/* eslint-disable unicorn/no-null */
import { ConnectionObserver } from '@wessberg/connection-observer';
import type * as ReactType from 'react';
import type * as ReactDomType from 'react-dom';
import type * as ReactDomClientType from 'react-dom/client';
import type { IChangedTiddlers, IParseTreeNode, IWidgetInitialiseOptions } from 'tiddlywiki';
import type { IReactWidget, ITWReactProps, ITWReactPropsDefault } from './widget-type';

import { widget as Widget } from '$:/core/modules/widgets/widget.js';
const ReactDom = require('react-dom') as typeof ReactDomType & typeof ReactDomClientType;
const React = require('react') as typeof ReactType;
if (typeof window !== 'undefined') {
  window.React = React;
} else if (typeof global !== 'undefined') {
  global.React = React;
}

class ReactWidgetImpl<
  IProps extends ITWReactProps = ITWReactPropsDefault,
> extends Widget implements IReactWidget<IProps> {
  root: ReturnType<typeof ReactDom.createRoot> | undefined;
  containerElement: HTMLDivElement | undefined;
  connectionObserver: ConnectionObserver | undefined;

  constructor(parseTreeNode: IParseTreeNode, options?: IWidgetInitialiseOptions | undefined) {
    super(parseTreeNode, options);
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!$tw.browser) {
      return;
    }
    this.connectionObserver = new ConnectionObserver(entries => {
      for (const { connected } of entries) {
        if (!connected) {
          this.destroy();
          this.connectionObserver?.disconnect?.();
        }
      }
    });
  }

  refresh(changedTiddlers: IChangedTiddlers) {
    // we don't need to refresh mount point of react-dom
    // but you can override this method to do some custom refresh logic
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

  render(parent: Element, nextSibling: Element | null) {
    this.parentDomNode = parent;
    this.computeAttributes();
    this.execute();
    if (this.reactComponent === undefined || this.reactComponent === null) {
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
      let domToObserve = this.containerElement;
      // sometimes parent node isTiddlyWikiFakeDom, we can't use it.
      if (this.parentDomNode instanceof Node) {
        domToObserve = this.parentDomNode as HTMLDivElement;
      }
      this.connectionObserver?.observe?.(domToObserve);
    }
    this.domNodes.push(this.containerElement);
    try {
      parent.insertBefore(this.containerElement, nextSibling);
    } catch (error) {
      console.warn(`Error while inserting dom node in react widget, this might be cause by use transclude widget for the wikitext contains widget.`, error);
    }
    const reactElement = React.createElement(this.reactComponent, currentProps);
    this.root.render(reactElement);
  }

  refreshSelf() {
    if (this.reactComponent === undefined || this.reactComponent === null) {
      return;
    }
    if (this.root === undefined) {
      const nextSibling = this.findNextSiblingDomNode();
      this.render(this.parentDomNode, nextSibling);
      return;
    }
    this.computeAttributes();
    this.execute();
    const currentProps = this.getProps() ?? {};
    if (currentProps.parentWidget === undefined || currentProps.parentWidget === null) {
      currentProps.parentWidget = this;
    }
    const reactElement = React.createElement(this.reactComponent, currentProps);
    this.root.render(reactElement);
  }

  destroy() {
    this.root?.unmount?.();
  }
}

declare let exports: {
  widget: typeof Widget;
};
exports.widget = ReactWidgetImpl;
