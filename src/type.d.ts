declare module '$:/plugins/linonetwo/tw-react/widget.js' {
  import type { widget as Widget } from '$:/core/modules/widgets/widget.js';
  import type * as ReactType from 'react';
  import type * as ReactDomType from 'react-dom';
  import type * as ReactDomClientType from 'react-dom/client';

  export abstract class widget<
    IProps extends ITWReactProps = ITWReactPropsDefault,
  > extends Widget implements IReactWidget<IProps> {
    root?: ReturnType<ReactDomType['createRoot']> | undefined;
    containerElement?: HTMLDivElement | undefined;
    getProps?: () => IProps;
    /**
     * User of tw-react need to assign his react component to this property.
     */
    reactComponent:
      | ReactType.ClassType<any, ReactType.ClassicComponent<any, ReactType.ComponentState>, ReactType.ClassicComponentClass<any>>
      | ReactType.FunctionComponent<any>
      | ReactType.ComponentClass<any>
      | null;
  }
}
