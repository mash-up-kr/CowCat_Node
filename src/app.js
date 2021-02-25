import express from 'express';
import morgan from './middlewares/morgan.js';
import router from './routes/index.js';
import cors from 'cors';
import path from 'path';

export default class ExpressServer {
  constructor() {
    this.port = process.env.EXPRESS_PORT;
    this.app = express();

    this.setUpMiddlewares();
    this.listen();
  }
  setUpMiddlewares() {
    const __dirname = path.resolve();
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(morgan);
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(router);
    this.app.use((req, res, next) => {
      res.status(404).send('Not found');
    });
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Internal server error');
    });
  }
  listen() {
    this.app.listen(this.port, (err) => {
      if (err) {
        console.error(err);
        reutnr;
      }

      console.log(`🚀 Express Server ready at ${this.port}`);
    });
  }
};
