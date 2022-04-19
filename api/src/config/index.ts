import { config } from 'dotenv';

config({ path: `${process.env.NODE_ENV === 'production' ? 'api/' : ''}.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DATABASE_URL,
  CLIENT_SECRET,
  CLIENT_ID,
  REDIRECT_URI,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  COOKIE_SECRET
} = process.env;
