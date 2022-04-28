import type * as ReactType from 'react';
type ReactType = typeof ReactType;
import type * as ReactDomType from 'react-dom';
import type * as ReactDomClientType from 'react-dom/client';
type ReactDomType = typeof ReactDomType & typeof ReactDomClientType;
import type { Widget as IWidget, IChangedTiddlers } from 'tiddlywiki';

const Widget = require('$:/core/modules/widgets/widget.js').widget as typeof IWidget;
const ReactDom: ReactDomType = require('react-dom');
const React: ReactType = require('react');

export interface IDefaultWidgetProps {
  parentWidget?: IWidget;
}
export class ReactWidget<
  IUserProps extends Record<string, any> = {},
  IProps extends IUserProps & IDefaultWidgetProps = IDefaultWidgetProps & Record<string, any> & any,
> extends Widget {
  private root: ReturnType<typeof ReactDom.createRoot> | undefined;
  private containerElement: HTMLDivElement | undefined;

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
  protected reactComponent:
    | ReactType.ClassType<any, ReactType.ClassicComponent<any, ReactType.ComponentState>, ReactType.ClassicComponentClass<any>>
    | ReactType.FunctionComponent<any>
    | ReactType.ComponentClass<any>
    | null = null;

  protected getProps: () => IProps = () => ({ parentWidget: this } as unknown as IProps);

  /**
   * Lifecycle method: Render this widget into the DOM
   */
  render(parent: Node, nextSibling: Node) {
    this.parentDomNode = parent;
    this.computeAttributes();
    this.execute();
    if (!this.reactComponent) {
      return;
    }
    const currentProps = this.getProps() ?? {};
    if (typeof currentProps.parentWidget === undefined || currentProps.parentWidget === null) {
      currentProps.parentWidget = this;
    }
    // TODO: is this useful?
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
}

exports.widget = ReactWidget;
export type IReactWidget = typeof ReactWidget;
