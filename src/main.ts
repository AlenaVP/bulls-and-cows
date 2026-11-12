import { renderApp } from './ui/render-app.js';

const root = document.createElement('div');

root.id = 'app';

document.body.append(root);

renderApp(root);
