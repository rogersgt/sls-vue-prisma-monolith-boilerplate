import { App } from 'vue';
import { renderToString } from 'vue/server-renderer';

export async function vueHtml(view: App) {
  const viewHtml =  await renderToString(view);
  return `<DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vue SSR Boilerplate</title>
        </head>
        <body>
          <div id="app">${viewHtml}</div>
        </body>      
    </html>`
}
