import { createContext } from 'react';
import { Widget } from 'tiddlywiki';

/**
 * A widget context for rendering child widgets
 *
 * > it will read the current context value from the closest matching Provider above it in the tree
 * > https://reactjs.org/docs/context.html#reactcreatecontext
 * so even multiple context is created in different react widget, the value may not collide, I think...
 */
export const ParentWidgetContext = createContext<Widget | undefined>(undefined);
