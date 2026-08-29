import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { sites } from './schema';
import path from 'path';

const sqlitePath = path.join(process.cwd(), 'heatshield.db');

export const client = createClient({ url: `file:${sqlitePath}` });
export const db = drizzle(client, { schema });

export async function initDb() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS sites (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      siteType TEXT NOT NULL,
      operatingHours TEXT,
      notes TEXT,
      createdAt INTEGER NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      siteId TEXT NOT NULL,
      severity TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      resolvedAt INTEGER
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS system_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed default sites only once on fresh database setup
  try {
    const metaCheck = await client.execute(`SELECT value FROM system_meta WHERE key = 'has_seeded'`);
    if (!metaCheck.rows || metaCheck.rows.length === 0) {
      const existing = await db.select().from(sites);
      if (existing.length === 0) {
        const defaultSites = [
          {
            id: 'site-phoenix-1',
            name: 'Phoenix Downtown Tower A',
            city: 'Phoenix',
            state: 'AZ',
            lat: 33.4484,
            lng: -112.0740,
            siteType: 'Construction',
            operatingHours: '06:00 - 16:00',
            notes: 'Main commercial high-rise excavation site',
            createdAt: Date.now()
          },
          {
            id: 'site-dallas-2',
            name: 'Dallas Solar Array Hub',
            city: 'Dallas',
            state: 'TX',
            lat: 32.7767,
            lng: -96.7970,
            siteType: 'Energy',
            operatingHours: '07:00 - 17:00',
            notes: 'Utility-scale PV solar field project',
            createdAt: Date.now()
          },
          {
            id: 'site-miami-3',
            name: 'Miami Metro Extension',
            city: 'Miami',
            state: 'FL',
            lat: 25.7617,
            lng: -80.1918,
            siteType: 'Infrastructure',
            operatingHours: '05:00 - 15:00',
            notes: 'Transit rail track expansion work zone',
            createdAt: Date.now()
          }
        ];

        for (const siteItem of defaultSites) {
          await db.insert(sites).values(siteItem);
        }
        console.log('Seeded initial default sites into database');
      }
      await client.execute(`INSERT OR REPLACE INTO system_meta (key, value) VALUES ('has_seeded', 'true')`);
    }
  } catch (err) {
    console.error('Error initializing DB seed state:', err);
  }
}
