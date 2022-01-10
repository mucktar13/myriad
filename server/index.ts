import next from 'next';

import * as dotenv from 'dotenv';
import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';
import path from 'path';
import serveIndex from 'serve-index';

dotenv.config();

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // security - like to not display the backend is built on express ;)
  server.disable('x-powered-by');

  server.use(
    '/docs',
    express.static(path.join(__dirname, '../docs')),
    serveIndex(path.join(__dirname, '../docs')),
  );

  server.use(
    /^\/api\/((?!auth|healthcheck).)+$/,
    createProxyMiddleware({
      target: process.env.MYRIAD_API_URL,
      pathRewrite: path => path.replace('/api', '/'),
      changeOrigin: true,
      headers: {
        Authorization: `Bearer ${process.env.MYRIAD_API_KEY}`,
      },
      logLevel: dev ? 'debug' : undefined,
    }),
  );

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    //tslint:disable-next-line:no-console
    console.log(
      `> Server listening at 'http://localhost:${port} as ${
        dev ? 'development' : process.env.NODE_ENV
      }`,
    );
  });
});
