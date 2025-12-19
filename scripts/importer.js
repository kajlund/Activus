// seed.js
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { drizzle } from 'drizzle-orm/libsql';

import { getConfig } from '../src/utils/config.js';
import { activities, activityKinds } from '../src/db/schemas.js';

// Define the directory where your JSON files are stored
const DATA_DIR = path.join(process.cwd(), 'data');

// The JSON data structure MUST match your table schema fields (users.json and products.json)

/**
 * Reads and parses a JSON file.
 * @param {string} filename - The name of the JSON file (e.g., 'users.json').
 * @returns {Promise<Array<object>>} The parsed JSON data.
 */
async function loadJsonData(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    console.log(`Loading data from: ${filePath}`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
}

/**
 * Seeds the database tables from JSON files.
 */
async function seedDatabase() {
  console.log('🚀 Starting database seeding...');
  const cnf = getConfig();
  const db = drizzle(cnf.dbConnection);
  try {
    // --- 2.1 Load Data from JSON ---
    const kindData = await loadJsonData('kinds.json');
    const activityData = await loadJsonData('activities.json');

    // --- 2.2 Clear existing data (Optional, but recommended for clean seeding) ---
    await db.delete(activityKinds);
    await db.delete(activities);
    console.log('✅ Existing tables cleared successfully.');

    // --- 2.3 Insert Data into Drizzle Tables ---

    // Insert ActivityKinds
    if (kindData.length > 0) {
      console.log(`Inserting ${kindData.length} ActivityKinds...`);
      await db.insert(activityKinds).values(kindData); // Drizzle accepts an array of objects for bulk insert
      console.log('✅ ActivityKinds inserted.');
    } else {
      console.log('⚠️ No ActivityKind data found to insert.');
    }

    // Insert Activities
    if (activityData.length > 0) {
      console.log(`Inserting ${activityData.length} activities...`);
      await db.insert(activities).values(activityData);
      console.log('✅ Activities inserted.');
    } else {
      console.log('⚠️ No activity data found to insert.');
    }

    console.log('🎉 Database seeding complete!');
  } catch (error) {
    console.error('❌ FATAL SEEDING ERROR:', error);
    process.exit(1);
  }
}

// Execute the main function
seedDatabase().then(() => {
  // Ensure the Node.js process exits after seeding is done
  process.exit(0);
});
