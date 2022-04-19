import { join } from 'path';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, NODE_ENV, DATABASE_URL } from '@config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource(getDbConnection());

function getDbConnection(): PostgresConnectionOptions {
  const connectionOptions: PostgresConnectionOptions = {
    type: 'postgres',
    url: DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
    subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber',
    },
  }
  if (NODE_ENV === 'production') {
    (connectionOptions as any).ssl = { rejectUnauthorized: false}
  }

  return connectionOptions;
}
