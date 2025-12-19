import { promises as fs } from 'node:fs';
import path from 'node:path';

import { drizzle } from 'drizzle-orm/libsql';

import { activities, activityKinds } from '../src/db/schemas.js';
import { getConfig } from '../src/utils/config.js';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDataDirectory() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log(`Export directory created or verified: ${DATA_DIR}`);
  } catch (error) {
    console.error('Error ensuring export directory:', error);
    throw error;
  }
}

/**
 * Exports data from the database tables to JSON files.
 */
async function exportDatabase() {
  console.log('📦 Starting database export...');

  try {
    await ensureDataDirectory();
    const cnf = getConfig();
    const db = drizzle(cnf.dbConnection);

    // --- Fetch Data from Drizzle Tables ---

    // A. Fetch Kinds
    console.log('Fetching ActivityKind data...');
    const kindList = await db
      .select()
      .from(activityKinds)
      .orderBy(activityKinds.createdAt);
    console.log(`Found ${kindList.length} ActivityKinds.`);

    // B. Fetch Activities
    console.log('Fetching Activities data...');
    const activitiesList = await db
      .select()
      .from(activities)
      .orderBy(activities.createdAt);
    console.log(`Found ${activitiesList.length} Activities.`);

    // --- Write Data to JSON Files ---

    // Helper function to serialize and write data
    const writeData = async (data, filename) => {
      if (data.length === 0) {
        console.log(`Skipping export for ${filename}: No data found.`);
        return;
      }

      // Convert the array of objects to a formatted JSON string (null, 2 for indentation)
      const jsonString = JSON.stringify(data, null, 2);
      const filePath = path.join(DATA_DIR, filename);

      await fs.writeFile(filePath, jsonString, 'utf-8');
      console.log(
        `✅ Successfully exported ${data.length} records to ${filename}`,
      );
    };

    // Write datasets
    await writeData(kindList, 'kinds.json');
    await writeData(activitiesList, 'activities.json');

    console.log('🎉 Database export complete!');
  } catch (error) {
    console.error('❌ FATAL EXPORT ERROR:', error);
    process.exit(1);
  }
}

// Execute the main function
exportDatabase().then(() => {
  // Ensure the Node.js process exits after export is done
  process.exit(0);
});
