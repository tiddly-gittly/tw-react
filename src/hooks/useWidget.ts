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
    const newWidgetNode = new $tw.rootWidget.widgetClasses.widget(
      {
        type: 'widget',
        children: [parseTreeNode],
      } as IParseTreeNode,
      {
        wiki: $tw.wiki,
        document /* : typeof document !== 'undefined' ? document : $tw.fakeDocument */,
        parentWidget,
      },
    );

    newWidgetNode.render(containerRef.current, null);
    parentWidget.children.push(newWidgetNode);
  }, [parseTreeNode, containerRef.current]);
}
