// server/api/index.js
import express from 'express';
import cors from 'cors';
import providersRouter from '../routes/providers.js';

const app = express();

app.use(cors());
app.use(express.json());

// Mount the router
app.use('/api/providers', providersRouter);

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export for Vercel serverless
export default app;
