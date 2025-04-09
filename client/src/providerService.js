const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Fetch geocoded providers from the API
export const fetchGeocodedProviders = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/providers`);
        if (!response.ok) {
            throw new Error('Failed to fetch provider data');
        }
        const providers = await response.json();

        // Transform the lat/lon format to coordinates array format expected by the map
        return providers.map((provider) => ({
            ...provider,
            coordinates:
                provider.lat && provider.lon
                    ? [provider.lat, provider.lon]
                    : null,
        }));
    } catch (error) {
        console.error('Error fetching providers:', error);
        throw error;
    }
};

// Get coordinates for a ZIP code
export const getZipCodeCoordinates = async (zipCode) => {
    if (!zipCode) return null;

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${zipCode}`
        );
        if (!response.ok) throw new Error('ZIP code geocoding failed');

        const data = await response.json();
        if (data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
        return null;
    } catch (error) {
        console.error('ZIP code geocoding error:', error);
        return null;
    }
};
