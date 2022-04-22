import { createContext, RefObject, useContext, useEffect } from 'react';
import { Widget } from 'tiddlywiki';

/**
 * A widget context for rendering child widgets
 *
 * > it will read the current context value from the closest matching Provider above it in the tree
 * > https://reactjs.org/docs/context.html#reactcreatecontext
 * so even multiple context is created in different react widget, the value may not collide, I think...
 *
 *  */
export const ParentWidgetContext = createContext<Widget | undefined>(undefined);

export function useRenderTiddler(tiddlerTitle: string, containerRef: RefObject<HTMLDivElement>) {
  const parentWidget = useContext(ParentWidgetContext);
  useEffect(() => {
    if (containerRef.current === null || parentWidget === undefined) {
      return;
    }
    const transcludeWidgetNode = $tw.wiki.makeTranscludeWidget(tiddlerTitle, {
      document,
      parentWidget,
      recursionMarker: 'yes',
      mode: 'block',
      importPageMacros: true,
    });
    const tiddlerContainer = document.createElement('div');
    containerRef.current.append(tiddlerContainer);
    transcludeWidgetNode.render(tiddlerContainer, null);
    parentWidget.children.push(transcludeWidgetNode);
  }, [tiddlerTitle, containerRef.current]);
}
