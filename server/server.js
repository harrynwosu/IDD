import express from 'express';
import cors from 'cors';
import { getGeocodedData, startGeocodeCron } from './geocodeJob.js';

const app = express();
const PORT = 4000;

app.use(cors());

// 1) Serve geocoded data via an endpoint
app.get('/api/providers', async (req, res) => {
    try {
        // This reads from a DB or from an in-memory / JSON store
        const data = await getGeocodedData();
        res.json(data); // Send the array of providers (with lat/lng)
    } catch (error) {
        console.error('Error returning provider data:', error);
        res.status(500).json({ error: 'Could not retrieve providers' });
    }
});

// 2) Start the cron job that updates data daily/weekly
startGeocodeCron();

// Optionally serve your React build
// app.use(express.static(path.join(__dirname, '../client/build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
