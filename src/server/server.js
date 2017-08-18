import path from 'path';
import express from 'express';
import {HTTPS as https} from 'express-sslify';
import next from 'next';

export default () => {
  const dev = process.env.NODE_ENV !== 'production';
  const dir = path.resolve(__dirname, '..');

  const app = next({dev, dir});
  const handle = app.getRequestHandler();

  app.prepare()
    .then(() => {
      const server = express();
      const port = process.env.PORT || 3000;

      if (!dev) {
        server.use(https({trustProtoHeader: true}));
      }

      server.get('*', (req, res) => {
        return handle(req, res);
      });

      server.listen(port, err => {
        if (err) {
          throw err;
        }
        console.info(`🌎  Listening on port ${port}`);
      });
    });
};
