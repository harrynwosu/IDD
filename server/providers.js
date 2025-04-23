// server/routes/providers.js
import express from 'express';
import { Buffer } from 'buffer';
import {
    getAllProviders,
    getProviderById,
    getPaginatedProviders,
    addProvider,
    updateProvider,
    deleteProvider,
    geocodeAllProviders,
    incrementGoodRatings,
    incrementBadRatings,
} from './database.js';

const router = express.Router();

// Basic auth middleware for admin routes
const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'utf-8'
    );
    const [username, password] = credentials.split(':');

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        next();
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};

// Public API - Get all geocoded providers
router.get('/', async (req, res) => {
    try {
        const providers = await getAllProviders();
        res.json(providers);
    } catch (error) {
        console.error('Error returning provider data:', error);
        res.status(500).json({ error: 'Failed to fetch providers' });
    }
});

// Feeback routes
// Good feeback ✅
router.post('/rate/good/:id', async (req, res) => {
    try {
        const providerId = req.params.id;
        const updatedProvider = await incrementGoodRatings(providerId);
        res.status(200).json(updatedProvider);
    } catch (error) {
        console.error('Error incrementing good rating:', error);
        res.status(500).json({ error: 'Failed to update rating' });
    }
});

// Bad feedback ❌
router.post('/rate/bad/:id', async (req, res) => {
    try {
        const providerId = req.params.id;
        const updatedProvider = await incrementBadRatings(providerId);
        res.status(200).json(updatedProvider);
    } catch (error) {
        console.error('Error incrementing bad rating:', error);
        res.status(500).json({ error: 'Failed to update rating' });
    }
});

// ADMIN ROUTES - Protected by basic auth

// Get all providers for admin
// router.get('/admin', adminAuth, async (req, res) => {
//     try {
//         const providers = await getAllProviders();
//         res.json(providers);
//     } catch (error) {
//         console.error('Error returning provider data:', error);
//         res.status(500).json({ error: 'Failed to fetch providers' });
//     }
// });

// Updated from above to include pagination
router.get('/admin', adminAuth, async (req, res) => {
    try {
        // Extract pagination parameters from query string
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 50; // Default to 50 items per page

        const offset = (page - 1) * limit;

        const { providers, totalCount } = await getPaginatedProviders(
            limit,
            offset
        );

        res.setHeader('X-Total-Count', totalCount);

        res.json(providers);
    } catch (error) {
        console.error('Error returning provider data:', error);
        res.status(500).json({ error: 'Failed to fetch providers' });
    }
});

// Get a specific provider
router.get('/admin/:id', adminAuth, async (req, res) => {
    try {
        const provider = await getProviderById(req.params.id);
        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }
        res.json(provider);
    } catch (error) {
        console.error('Error fetching provider data:', error);
        res.status(500).json({ error: 'Failed to fetch provider' });
    }
});

// Add a new provider
router.post('/admin', adminAuth, async (req, res) => {
    try {
        const providerId = await addProvider(req.body);
        res.status(201).json({
            id: providerId,
            message: 'Provider added successfully',
        });
    } catch (error) {
        console.error('Error adding provider:', error);
        res.status(500).json({ error: 'Failed to add provider' });
    }
});

// Update a provider
router.put('/admin/:id', adminAuth, async (req, res) => {
    try {
        const provider = await updateProvider(req.params.id, req.body);
        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }
        res.json({ message: 'Provider updated successfully', provider });
    } catch (error) {
        console.error('Error updating provider:', error);
        res.status(500).json({ error: 'Failed to update provider' });
    }
});

// Delete a provider
router.delete('/admin/:id', adminAuth, async (req, res) => {
    try {
        await deleteProvider(req.params.id);
        res.json({ message: 'Provider deleted successfully' });
    } catch (error) {
        console.error('Error deleting provider:', error);
        res.status(500).json({ error: 'Failed to delete provider' });
    }
});

// Trigger geocoding manually
router.post('/admin/geocode', adminAuth, async (req, res) => {
    try {
        // Run geocoding in the background
        geocodeAllProviders().catch((err) =>
            console.error('Background geocoding failed:', err)
        );
        res.json({ message: 'Geocoding job started' });
    } catch (error) {
        console.error('Error: Failed to complete geocoding process:', error);
        res.status(500).json({ error: 'Failed to start geocoding' });
    }
});

export default router;
