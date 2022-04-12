import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import session from 'express-session';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { dataSource } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import path from 'path';
import { TypeormStore } from 'connect-typeorm';
import { Session } from './entities/session.entity';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.env !== 'test' && this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    dataSource
      .initialize()
      .then(() => {
        console.log("Data Source has been initialized!")
      })
      .catch((err) => {
        console.error("Error during Data Source initialization:", err)
      });
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "http: data:", "https: data:"]
      }
    }));
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.initSessionMiddleware();
  }

  private initSessionMiddleware() {
    const sessionRepository = dataSource.getRepository(Session);

    const sessionConfig = {
      secret: 'my-secret-key',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false
      },
      store: new TypeormStore({
        cleanupLimit: 2,
        ttl: 86400
      }).connect(sessionRepository),
    };

    if (this.app.get('env') === 'production') {
      this.app.set('trust proxy', 1);
      sessionConfig.cookie.secure = true; 
    }

    this.app.use(session(sessionConfig));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/api', route.router);
    });
    this.app.use(express.static(path.join(__dirname, '../dist/public')));
    this.app.use('*', express.static(path.join(__dirname, '../dist/public')));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
