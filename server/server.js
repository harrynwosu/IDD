import express from 'express';
import cors from 'cors';
import { getGeocodedData } from './geocodeJob.js';

const app = express();
const PORT = 4000;

app.use(cors());

// Endpoint for serving geocoded data
app.get('/api/providers', async (req, res) => {
    try {
        const data = await getGeocodedData();
        res.json(data); // Send the array of providers (with lat/lng)
    } catch (error) {
        console.error('Error returning provider data:', error);
        res.status(500).json({ error: 'Could not retrieve providers' });
    }
});

// Start the cron job that automatically updates data daily/weekly
// If needed, uncomment the next line
// startGeocodeCron();

// Serve React build
// app.use(express.static(path.join(__dirname, '../client/build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
