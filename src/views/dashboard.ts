import { Request, Response } from 'express';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer'
import { wrapAppHtml } from './tools/htmlPage';

export default async function serveDashboard(_req: Request, res: Response) {
  const app = createSSRApp({
    template: `
      <div class="container">
        <h1 class="text-center">Home</h1>
      </div>`,
    data: () => ({}),
    methods: {}
  });

  const html = await renderToString(app);
  return res.send(wrapAppHtml(html));
}
