import { fileURLToPath } from 'url';
import { migrateFromCSV } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(
    __dirname,
    'data',
    'updated_service_providers.csv'
);

await migrateFromCSV(csvFilePath);
