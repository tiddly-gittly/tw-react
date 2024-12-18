/* eslint-disable security-node/detect-insecure-randomness */
import { RefObject, useContext, useEffect } from 'react';
import { IParseTreeNode } from 'tiddlywiki';
import { ParentWidgetContext } from './context';

interface IOptions {
  /** skip rendering for this time useEffect executes */
  skip?: boolean;
}
export function useWidget(parseTreeNode: IParseTreeNode, containerReference: RefObject<HTMLDivElement>, options?: IOptions) {
  const parentWidget = useContext(ParentWidgetContext);
  useEffect(() => {
    const domNode = containerReference.current;
    if (domNode === null) {
      return;
    }
    if (parentWidget === undefined) {
      throw new Error(
        'Your plugin have a bug: `parentWidget` is undefined, you should use `<ParentWidgetContext value={props.parentWidget}>`, see tw-react for document.',
      );
    }
    if (options?.skip === true) {
      return;
    }
    const id = String(Math.random());
    // FIXME: this is wrong, see zx-script's latest version
    const newWidgetNode = parentWidget.makeChildWidget(parseTreeNode, { variables: { 'use-widget-id': id } });

    // eslint-disable-next-line unicorn/no-null
    newWidgetNode.render(domNode, null);
    parentWidget.children.push(newWidgetNode);
    return () => {
      parentWidget.children = parentWidget.children.filter((child) => child.getVariable('use-widget-id') !== id);
      if (domNode === null) {
        return;
      }
      domNode.textContent = '';
    };
  }, [parseTreeNode, containerReference, parentWidget, options?.skip]);
}
