import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Toast from './utils/Toast';
import ProviderListView from './utils/ProviderListView';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

import '../styles/SearchMap.css';

// Constants
const DEFAULT_CENTER = [41.8781, -87.6298]; // Chicago coordinates
const USER_LOCATION_KEY = 'user_location';
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// Custom marker icon
const defaultIcon = L.icon({
    iconUrl: '/marker-icon.png',
    iconSize: [48, 48],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const SearchMap = ({ activeView, filteredProviders, setFilteredProviders }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);

    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success',
        key: 0, // Add a key to force remounting
    });

    // Load user location
    useEffect(() => {
        const getFromCache = (key) => {
            try {
                const item = localStorage.getItem(key);
                if (!item) return null;
                const { value, timestamp } = JSON.parse(item);
                if (Date.now() - timestamp > CACHE_DURATION) {
                    localStorage.removeItem(key);
                    return null;
                }
                return value;
            } catch {
                return null;
            }
        };

        const savedLocation = getFromCache(USER_LOCATION_KEY);
        if (savedLocation) {
            setUserLocation(savedLocation);
        }

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = [
                        position.coords.latitude,
                        position.coords.longitude,
                    ];
                    setUserLocation(location);
                    localStorage.setItem(
                        USER_LOCATION_KEY,
                        JSON.stringify({
                            value: location,
                            timestamp: Date.now(),
                        })
                    );
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setError('Failed to get user location');
                }
            );
        }
    }, []);

    // Load providers
    useEffect(() => {
        const loadProviders = async () => {
            setError(null);

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_BASE_URL}/api/providers`
                );

                if (!response.ok) {
                    throw new Error('Failed to load providers');
                }

                const providers = await response.json();
                setFilteredProviders(providers);
            } catch (error) {
                console.error('Provider loading error:', error);
                setError(error.message);
            }
        };

        loadProviders();
    }, [setFilteredProviders]);

    const onProviderSelect = () => {
        return;
    };

    const showToast = (message, type = 'success') => {
        setToast({
            visible: true,
            message,
            type,
            key: toast.key + 1,
        });
    };

    const hideToast = () => {
        setToast({ ...toast, visible: false });
    };

    const handleGoodRating = async (providerId) => {
        try {
            const response = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_BASE_URL
                }/api/providers/rate/good/${providerId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update rating');
            }

            showToast('Thank you for your positive feedback!');
        } catch (error) {
            console.error('Error updating rating:', error);
            showToast(
                'Failed to submit your feedback. Please try again.',
                'error'
            );
        }
    };

    const handleBadRating = async (providerId) => {
        try {
            const response = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_BASE_URL
                }/api/providers/rate/bad/${providerId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update rating');
            }

            showToast(
                'Thank you for your feedback. We appreciate your honesty.'
            );
        } catch (error) {
            console.error('Error updating rating:', error);
            showToast(
                'Failed to submit your feedback. Please try again.',
                'error'
            );
        }
    };

    const toTitleCase = (str) =>
        str
            .toLowerCase()
            .replace(
                /\b\w+('\w)?/g,
                (word) => word.charAt(0).toUpperCase() + word.slice(1)
            );

    const formatPhoneNumber = (phoneNumber) => {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');

        // Check if we have a 10-digit number
        if (cleaned.length === 10) {
            return `(${cleaned.substring(0, 3)}) ${cleaned.substring(
                3,
                6
            )}-${cleaned.substring(6, 10)}`;
        }

        // For 11-digit numbers that start with 1
        if (cleaned.length === 11 && cleaned.charAt(0) === '1') {
            return `(${cleaned.substring(1, 4)}) ${cleaned.substring(
                4,
                7
            )}-${cleaned.substring(7, 11)}`;
        }

        console.warn(`Unable to format phone number: ${phoneNumber}`);
        return phoneNumber;
    };

    if (error) {
        return (
            <div className='error-container'>
                <p className='error-message'>Error: {error}</p>
                <button onClick={() => setError(null)}>Dismiss</button>
            </div>
        );
    }

    return activeView === 'list' ? (
        <div className='list-container'>
            {/* <p>List View Content</p> */}
            <ProviderListView
                providers={filteredProviders}
                onProviderSelect={onProviderSelect}
            />
        </div>
    ) : (
        <div className='map-container'>
            <MapContainer
                center={userLocation || DEFAULT_CENTER}
                zoom={13}
                style={{ width: '100%', height: '800px' }}
            >
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {filteredProviders.map((provider, index) => {
                    if (!(provider.lat || provider.lon)) {
                        console.warn(
                            `Provider ${provider.name} has no coordinates`
                        );
                        return null;
                    }

                    const coords = [
                        parseFloat(provider.lat),
                        parseFloat(provider.lon),
                    ];

                    return (
                        <Marker
                            key={`${provider.name}-${index}`}
                            position={coords}
                            icon={defaultIcon}
                        >
                            <Popup>
                                <div className='provider-popup'>
                                    <h3
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            marginBottom: '10px',
                                            paddingBottom: '5px',
                                            borderBottom: '1px solid #000',
                                        }}
                                    >
                                        {toTitleCase(provider.provider_name)}
                                    </h3>

                                    <div>
                                        <p
                                            style={{
                                                fontWeight: 'bold',
                                                marginBottom: '2px',
                                            }}
                                        >
                                            Address:
                                        </p>
                                        <p style={{ marginTop: '0' }}>
                                            {toTitleCase(
                                                provider.street_address
                                            )}
                                            <br />
                                            {toTitleCase(provider.city)},{' '}
                                            {provider.state} {provider.zipcode}
                                        </p>
                                    </div>

                                    <div>
                                        <p
                                            style={{
                                                fontWeight: 'bold',
                                                marginBottom: '2px',
                                            }}
                                        >
                                            Phone:
                                        </p>
                                        <p style={{ marginTop: '0' }}>
                                            {formatPhoneNumber(
                                                provider.phone_number
                                            )}
                                        </p>
                                    </div>

                                    <div
                                        style={{
                                            marginTop: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span>How was your experience?</span>
                                        <div
                                            style={{
                                                display: 'flex',
                                                marginLeft: '10px',
                                                gap: '5px',
                                            }}
                                        >
                                            <button
                                                aria-label='Thumbs up'
                                                className='thumbs-up-icon'
                                                onClick={() =>
                                                    handleGoodRating(
                                                        provider.id
                                                    )
                                                }
                                            >
                                                <ThumbsUp />
                                            </button>
                                            <button
                                                aria-label='Thumbs down'
                                                className='thumbs-down-icon'
                                                onClick={() =>
                                                    handleBadRating(provider.id)
                                                }
                                            >
                                                <ThumbsDown />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                <div className='toast-container'>
                    {toast.visible && (
                        <Toast
                            key={toast.key}
                            message={toast.message}
                            type={toast.type}
                            onClose={hideToast}
                        />
                    )}
                </div>
            </MapContainer>
        </div>
    );
};

SearchMap.propTypes = {
    activeView: PropTypes.string.isRequired,
    filteredProviders: PropTypes.array.isRequired,
    setFilteredProviders: PropTypes.func.isRequired,
};

export default SearchMap;
