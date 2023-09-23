/* eslint-disable unicorn/no-null */
import { RefObject, useContext, useEffect } from 'react';
import { ParentWidgetContext } from './context';

interface IOptions {
  /** skip rendering for this time useEffect executes */
  skip?: boolean;
}
export function useRenderTiddler(tiddlerTitle: string, containerReference: RefObject<HTMLDivElement>, options?: IOptions) {
  const parentWidget = useContext(ParentWidgetContext);
  useEffect(() => {
    const domNode = containerReference.current;
    if (domNode === null) {
      return;
    }
    if (parentWidget === undefined) {
      throw new Error(
        'Your plugin have a bug: `parentWidget` is undefined, you should use `<ParentWidgetContext.Provider value={props.parentWidget}>`, see tw-react for document.',
      );
    }
    if (options?.skip === true) {
      return;
    }
    const id = String(Math.random());
    const transcludeWidgetNode = $tw.wiki.makeTranscludeWidget(tiddlerTitle, {
      document,
      parentWidget,
      recursionMarker: 'yes',
      mode: 'block',
      importPageMacros: true,
      variables: { 'use-widget-id': id },
    });
    const tiddlerContainer = document.createElement('div');
    domNode.append(tiddlerContainer);
    transcludeWidgetNode.render(tiddlerContainer, null);
    parentWidget.children.push(transcludeWidgetNode);
    return () => {
      parentWidget.children = parentWidget.children.filter((child) => child.getVariable('use-widget-id') !== id);
      if (domNode === null) {
        return;
      }
      domNode.textContent = '';
    };
  }, [tiddlerTitle, containerReference, parentWidget, options?.skip]);
}
