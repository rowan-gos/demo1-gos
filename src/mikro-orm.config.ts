import 'dotenv/config';
import { defineConfig } from '@mikro-orm/postgresql';
import { CustomNamingStrategy } from './common/naming-strategy';
export default defineConfig({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,

  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],

  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    allOrNothing: true,
    transactional: true,
    safe: process.env.NODE_ENV === 'production',
    fileName: (timestamp) => `${timestamp}-migration.js`,
  },
  namingStrategy: CustomNamingStrategy,
  validate: process.env.NODE_ENV === 'development',
  strict: true,
  debug: process.env.NODE_ENV !== 'production',
});
