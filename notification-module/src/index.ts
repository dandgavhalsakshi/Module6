import { createRoot, Root } from 'react-dom/client';
import { renderApp, unmountApp } from '../src/bootstrap';
import { NotificationCenter } from './components/NotificationCenter';
import type { MountProps } from './types/index';

const rootMap = new Map<Element, Root>();

export function mount(el: HTMLElement, props: MountProps) {
  const root = createRoot(el);
  rootMap.set(el, root);
  renderApp(el, props);
}

export function unmount(el: HTMLElement) {
  const root = rootMap.get(el);
  if (root) {
    root.unmount();
    rootMap.delete(el);
  } else {
    unmountApp(el);
  }
}

// Export the embeddable NotificationCenter for use in external app shells
export { NotificationCenter };
