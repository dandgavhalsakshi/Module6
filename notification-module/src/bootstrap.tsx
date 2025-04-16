import { createRoot, Root } from 'react-dom/client';
import App from './App';
import type { MountProps } from './types/index';

const rootMap = new Map<Element, Root>();

export function renderApp(el: HTMLElement, props: MountProps) {
  const root = createRoot(el);
  rootMap.set(el, root);
  root.render(<App {...props} />);
}

export function unmountApp(el: HTMLElement) {
  const root = rootMap.get(el);
  if (root) {
    root.unmount();
    rootMap.delete(el);
  }
}
