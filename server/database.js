import fs from 'fs';
import pg from 'pg';
import fetch from 'node-fetch';
import cron from 'node-cron';
import dotenv from 'dotenv';
import Papa from 'papaparse';

dotenv.config();

// Database connection
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Geocoding function using Nominatim by OpenStreetMaps
async function geocodeAddress(streetAddress, city) {
    if (!streetAddress || !city) return null;

    const params = new URLSearchParams({
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
export async function geocodeAllProviders() {
    console.log('Starting geocode job...');
    const client = await pool.connect();

    try {
        // Get all providers that need geocoding
        const result = await client.query(
            `SELECT * FROM service_providers 
       WHERE lat IS NULL OR lon IS NULL
       OR last_geocoded < NOW() - INTERVAL '30 days'`
        );

        console.log('query result', result);

        const providers = result.rows;
        console.log(`Found ${providers.length} providers to geocode`);

        // Geocode each provider
        for (const provider of providers) {
            const street = provider.street_address;
            const city = provider.city;

            const coords = await geocodeAddress(street, city);

            if (coords) {
                await client.query(
                    `UPDATE service_providers 
           SET lat = $1, lon = $2, last_geocoded = NOW()
           WHERE id = $3`,
                    [coords[0], coords[1], provider.id]
                );
                console.log(
                    `Updated coordinates for: ${provider.provider_name}`
                );
            }

            // 1-second delay to respect Nominatim usage policy
            await new Promise((res) => setTimeout(res, 1000));
        }

        console.log('Geocode job complete.');
    } catch (error) {
        console.error('Error in geocodeAllProviders:', error);
    } finally {
        client.release();
    }
}

// Get geocoded data
export async function getGeocodedData() {
    try {
        const result = await pool.query(
            `SELECT * FROM service_providers
       WHERE lat IS NOT NULL AND lon IS NOT NULL`
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching geocoded data:', error);
        return [];
    }
}

// Add a new provider
export async function addProvider(providerData) {
    try {
        const {
            provider_name,
            street_address,
            city,
            county,
            state,
            zipcode,
            phone_number,
            service_type,
        } = providerData;

        const result = await pool.query(
            `INSERT INTO service_providers 
       (provider_name, street_address, city, county, state, zipcode, 
       phone_number, service_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
            [
                provider_name,
                street_address,
                city,
                county,
                state,
                zipcode,
                phone_number,
                service_type,
            ]
        );

        return result.rows[0].id;
    } catch (error) {
        console.error('Error adding provider:', error);
        throw error;
    }
}

// Update a provider
export async function updateProvider(id, providerData) {
    try {
        const {
            provider_name,
            street_address,
            city,
            county,
            state,
            zipcode,
            phone_number,
            service_type,
        } = providerData;

        // If address changed, reset geocoding data
        const result = await pool.query(
            `UPDATE service_providers 
       SET provider_name = $1, 
           street_address = $2,
           city = $3, 
           county = $4,
           state = $5, 
           zipcode = $6,
           phone_number = $7, 
           service_type = $8,
           lat = CASE 
             WHEN street_address <> $2 OR city <> $3 THEN NULL 
             ELSE lat 
           END,
           lon = CASE 
             WHEN street_address <> $2 OR city <> $3 THEN NULL 
             ELSE lon 
           END,
           last_geocoded = CASE 
             WHEN street_address <> $2 OR city <> $3 THEN NULL 
             ELSE last_geocoded 
           END
       WHERE id = $9
       RETURNING *`,
            [
                provider_name,
                street_address,
                city,
                county,
                state,
                zipcode,
                phone_number,
                service_type,
                id,
            ]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Error updating provider:', error);
        throw error;
    }
}

// Delete a provider
export async function deleteProvider(id) {
    try {
        await pool.query('DELETE FROM service_providers WHERE id = $1', [id]);
        return true;
    } catch (error) {
        console.error('Error deleting provider:', error);
        throw error;
    }
}

// Get a single provider by ID
export async function getProviderById(id) {
    try {
        const result = await pool.query(
            'SELECT * FROM service_providers WHERE id = $1',
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching provider:', error);
        throw error;
    }
}

// Get all providers (for admin panel)
export async function getAllProviders() {
    try {
        const result = await pool.query('SELECT * FROM service_providers');
        return result.rows;
    } catch (error) {
        console.error('Error fetching providers:', error);
        return [];
    }
}

export async function getPaginatedProviders(limit, offset) {
    try {
        const providersQuery = await pool.query(
            'SELECT * FROM service_providers ORDER BY provider_name LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        const countQuery = await pool.query(
            'SELECT COUNT(*) FROM service_providers'
        );
        const totalCount = parseInt(countQuery.rows[0].count);

        return {
            providers: providersQuery.rows,
            totalCount: totalCount,
        };
    } catch (error) {
        console.error('Database error in getPaginatedProviders:', error);
        throw error;
    }
}

// Utility function for automated job running
export async function startGeocodeCron() {
    // Run daily at 2:00 AM
    // cron.schedule('0 2 * * *', async () => {
    //     console.log('Running daily geocode job...');
    //     await geocodeAllProviders();
    // });
    await geocodeAllProviders();
}

export async function migrateFromCSV(csvFilePath) {
    try {
        const csvText = fs.readFileSync(csvFilePath, 'utf-8');
        const result = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
        });

        const providers = result.data;
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            for (const provider of providers) {
                await client.query(
                    `INSERT INTO service_providers 
           (provider_name, street_address, city, county, state, zipcode, 
           phone_number, service_type)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
                    [
                        provider.provider_name,
                        provider.street_address,
                        provider.city,
                        provider.county,
                        provider.state,
                        provider.zipcode,
                        provider.phone_number,
                        provider.service_type,
                    ]
                );
            }

            await client.query('COMMIT');
            console.log(`Migrated ${providers.length} providers from CSV`);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error migrating from CSV:', error);
        throw error;
    }
}

export async function removeDuplicateProviders() {
    const client = await pool.connect();

    try {
        // Identify duplicate provider_name values
        const result = await client.query(
            `SELECT provider_name, COUNT(*) 
             FROM service_providers
             GROUP BY provider_name
             HAVING COUNT(*) > 1`
        );

        const duplicates = result.rows;
        console.log(`Found ${duplicates.length} provider_name duplicates`);

        // Iterate through each duplicate and remove them
        for (const duplicate of duplicates) {
            const provider_name = duplicate.provider_name;

            // Select the first row based on id to keep
            const { rows: duplicateRows } = await client.query(
                `SELECT id FROM service_providers
                 WHERE provider_name = $1
                 ORDER BY id ASC`,
                [provider_name]
            );

            // Keep the first row, delete the rest
            const idsToDelete = duplicateRows.slice(1).map((row) => row.id);

            // Delete the duplicates
            if (idsToDelete.length > 0) {
                await client.query(
                    `DELETE FROM service_providers WHERE id = ANY($1)`,
                    [idsToDelete]
                );
                console.log(
                    `Deleted duplicates for provider: ${provider_name}`
                );
            }
        }

        console.log('Duplicate removal completed.');
    } catch (error) {
        console.error('Error during duplicate removal:', error.message);
    } finally {
        client.release();
    }
}
