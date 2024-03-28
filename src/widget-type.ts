import type { widget as Widget } from '$:/core/modules/widgets/widget.js';
import type * as ReactType from 'react';
import type * as ReactDomType from 'react-dom';
import type * as ReactDomClientType from 'react-dom/client';
export type IReactDomType = typeof ReactDomType & typeof ReactDomClientType;

export interface IReactWidget<
  IProps extends ITWReactProps = ITWReactPropsDefault,
> extends Widget {
  containerElement: HTMLDivElement | undefined;
  getProps: () => IProps;

  /**
   * User of tw-react need to assign his react component to this property.
   */
  reactComponent:
    | ReactType.ClassType<any, ReactType.ClassicComponent<any, ReactType.ComponentState>, ReactType.ClassicComponentClass<any>>
    | ReactType.FunctionComponent<any>
    | ReactType.ComponentClass<any>
    | null;

  root: ReturnType<IReactDomType['createRoot']> | undefined;
}
export interface IReactWidgetConstructor extends IReactWidget {
  new(parseTreeNode: any, options: any): IReactWidget;
}

export interface IDefaultWidgetProps {
  parentWidget?: Widget;
}
export type ITWReactUserProps = Record<string, any>;
export type ITWReactProps = ITWReactUserProps & IDefaultWidgetProps;
export type ITWReactPropsDefault = IDefaultWidgetProps & Record<string, any> & any;
