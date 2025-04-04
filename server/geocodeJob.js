import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import Papa from 'papaparse';
import cron from 'node-cron';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to CSV file
const CSV_PATH = path.join(__dirname, 'data', 'updated_service_providers.csv');

// Path to store geocoded data in JSON
const OUTPUT_JSON = path.join(__dirname, 'data', 'geocoded-providers.json');

// Geocoding function using Nominatim by OpenStreetMaps
async function geocodeAddress(streetAddress, city) {
    if (!streetAddress || !city) return null;

    const params = new URLSearchParams({
        // In the case of conflicts, get only providers in illinois
        q: `${streetAddress}, ${city}, Illinois`,
        format: 'json',
        addressdetails: '1',
        polygon_geojson: '0',
    });

    try {
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

// Main function for processing data
async function geocodeAllProviders() {
    console.log('Starting geocode job...');
    try {
        // Read CSV file
        const csvText = fs.readFileSync(CSV_PATH, 'utf-8');

        // Parse CSV
        const result = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
        });

        const rawProviders = result.data;
        if (!rawProviders || !rawProviders.length) {
            console.warn('No providers found in CSV');
            return [];
        }

        // Geocode each provider
        const geocodedProviders = [];
        for (let i = 0; i < rawProviders.length; i++) {
            const provider = rawProviders[i];
            const street = provider.street_address;
            const city = provider.city;

            const coords = await geocodeAddress(street, city);

            if (coords) {
                geocodedProviders.push({
                    ...provider,
                    lat: coords[0],
                    lon: coords[1],
                });
            }

            // 1-second delay to respect Nominatim usage policy on rate limits
            await new Promise((res) => setTimeout(res, 1000));
        }

        const uniqueGeocodedProviders = new Map();

        geocodedProviders.forEach((provider) => {
            const uniqueKey = `${provider.street_address}, ${provider.city}`;
            if (!uniqueGeocodedProviders.has(uniqueKey)) {
                uniqueGeocodedProviders.set(uniqueKey, provider);
            }
        });

        // Save to JSON file
        fs.writeFileSync(
            OUTPUT_JSON,
            JSON.stringify(
                Array.from(uniqueGeocodedProviders.values()),
                null,
                2
            )
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

// In-memory store for serving data without re-reading from file
let cachedProviders = [];

// Refresh data from JSON file
function loadDataFromJSON() {
    try {
        if (fs.existsSync(OUTPUT_JSON)) {
            const raw = fs.readFileSync(OUTPUT_JSON, 'utf-8');
            const parsedData = JSON.parse(raw);

            const uniqueProviders = new Map();
            parsedData.forEach((provider) => {
                const uniqueKey = `${provider.street_address}, ${provider.city}`;
                if (!uniqueProviders.has(uniqueKey)) {
                    uniqueProviders.set(uniqueKey, provider);
                }
            });

            cachedProviders = Array.from(uniqueProviders.values());

            console.log(
                `Loaded ${cachedProviders.length} unique providers from JSON.`
            );
        } else {
            console.warn('No geocoded-providers.json file found yet.');
        }
    } catch (error) {
        console.error('Failed to load providers from JSON:', error);
        cachedProviders = [];
    }
}

/**
 * Callable function to get geocoded data
 */
export async function getGeocodedData() {
    // If you want to read from the file every time, you could do so here:
    loadDataFromJSON();

    // Or rely on a cached copy (already loaded at startup or after each cron job)
    return cachedProviders;
}

/**
 * Utility function for automated job running if needed
 */
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

// Run this job from the terminal with `node geocodeJob.js`
geocodeAllProviders();
