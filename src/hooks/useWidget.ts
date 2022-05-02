import { RefObject, useContext, useEffect } from 'react';
import { IParseTreeNode } from 'tiddlywiki';
import { ParentWidgetContext } from './context';

export function useWidget(parseTreeNode: IParseTreeNode, containerRef: RefObject<HTMLDivElement>) {
  const parentWidget = useContext(ParentWidgetContext);
  useEffect(() => {
    if (containerRef.current === null) {
      return;
    }
    if (parentWidget === undefined) {
      throw new Error(
        'Your plugin have a bug: `parentWidget` is undefined, you should use `<ParentWidgetContext.Provider value={props.parentWidget}>`, see tw-react for document.',
      );
    }
    const newWidgetNode = parentWidget.makeChildWidget(parseTreeNode, {});

    newWidgetNode.render(containerRef.current, null);
    parentWidget.children.push(newWidgetNode);
  }, [parseTreeNode, containerRef.current]);
}
