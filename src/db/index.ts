import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

// Initialize the SQLite database connection
const sqlite = new Database('sqlite.db');

// Pass the connection and schema to Drizzle
export const db = drizzle(sqlite, { schema });