import { RefObject, useContext, useEffect } from 'react';
import { ParentWidgetContext } from './context';

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
