import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import Papa from 'papaparse';
import cron from 'node-cron';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your CSV
const CSV_PATH = path.join(__dirname, 'data', 'combined_service_providers.csv');

// Path to store geocoded data in JSON (if not using a DB)
const OUTPUT_JSON = path.join(__dirname, 'data', 'geocoded-providers.json');

// Simple geocoding function using Nominatim
async function geocodeAddress(streetAddress, city) {
    if (!streetAddress || !city) return null;

    // Build query string
    const params = new URLSearchParams({
        q: `${streetAddress}, ${city}`,
        format: 'json',
        addressdetails: '1',
        polygon_geojson: '0',
    });

    try {
        // Include a custom User-Agent or Nominatim may block requests
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${params.toString()}`,
            {
                headers: {
                    'User-Agent': 'MyGeocodingApp/1.0 (contact@myapp.com)',
                },
            }
        );
        if (!response.ok) {
            console.error(`Geocoding failed for: ${streetAddress}, ${city}`);
            return null;
        }

        const data = await response.json();
        if (data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
    } catch (error) {
        console.error('Geocode error:', error);
    }
    return null;
}

// Example job function: read CSV, geocode, save JSON
async function geocodeAllProviders() {
    console.log('Starting geocode job...');
    try {
        // 1) Read CSV file
        const csvText = fs.readFileSync(CSV_PATH, 'utf-8');

        // 2) Parse CSV
        const result = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
        });

        const rawProviders = result.data;
        if (!rawProviders || !rawProviders.length) {
            console.warn('No providers found in CSV');
            return [];
        }

        // 3) Geocode each row
        const geocodedProviders = [];
        for (let i = 0; i < rawProviders.length; i++) {
            const provider = rawProviders[i];
            const street = provider['Street Address'];
            const city = provider['City'];

            const coords = await geocodeAddress(street, city);

            if (coords) {
                geocodedProviders.push({
                    ...provider,
                    lat: coords[0],
                    lon: coords[1],
                });
            }

            // 1-second delay to respect Nominatim usage policy
            await new Promise((res) => setTimeout(res, 1000));
        }

        // 4) Save to JSON file
        fs.writeFileSync(
            OUTPUT_JSON,
            JSON.stringify(geocodedProviders, null, 2)
        );
        console.log(
            `Geocode job complete. Saved ${geocodedProviders.length} providers.`
        );
        return geocodedProviders;
    } catch (error) {
        console.error('Error in geocodeAllProviders:', error);
        return [];
    }
}

// Optional: keep an in-memory store so we can serve data without re-reading from file
let cachedProviders = [];

// Refresh data from JSON file
function loadDataFromJSON() {
    try {
        if (fs.existsSync(OUTPUT_JSON)) {
            const raw = fs.readFileSync(OUTPUT_JSON, 'utf-8');
            cachedProviders = JSON.parse(raw);
            console.log(
                `Loaded ${cachedProviders.length} providers from JSON.`
            );
        } else {
            console.warn('No geocoded-providers.json file found yet.');
        }
    } catch (error) {
        console.error('Failed to load providers from JSON:', error);
        cachedProviders = [];
    }
}

// 5) A function the server can call to get geocoded data
export async function getGeocodedData() {
    // If you want to read from the file every time, you could do so here:
    loadDataFromJSON();

    // Or rely on a cached copy (already loaded at startup or after each cron job)
    return cachedProviders;
}

export function startGeocodeCron() {
    // First, load existing data from JSON at startup
    loadDataFromJSON();

    // Example: run every day at 2:00 AM
    // Cron pattern: '0 2 * * *' -> 2:00 AM daily
    cron.schedule('0 2 * * *', async () => {
        console.log('Running daily geocode job...');
        const updatedProviders = await geocodeAllProviders();
        // Update our in-memory cache
        cachedProviders = updatedProviders;
    });
}

geocodeAllProviders();
