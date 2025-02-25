import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// import { getZipCodeCoordinates } from '../providerService';
import ProviderListView from './utils/ProviderListView';

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
    // const [providers, setProviders] = useState([]);
    // const [filteredProviders, setFilteredProviders] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    // const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [filters, setFilters] = useState({
    //     service: '',
    //     zipCode: '',
    //     radius: 10,
    // });

    // Calculate distance between two points
    // const calculateDistance = useCallback((coords1, coords2) => {
    //     if (!coords1 || !coords2) return Infinity;

    //     const R = 3963; // Earth's radius in miles
    //     const lat1 = (coords1[0] * Math.PI) / 180;
    //     const lat2 = (coords2[0] * Math.PI) / 180;
    //     const dLat = ((coords2[0] - coords1[0]) * Math.PI) / 180;
    //     const dLon = ((coords2[1] - coords1[1]) * Math.PI) / 180;

    //     const a =
    //         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //         Math.cos(lat1) *
    //             Math.cos(lat2) *
    //             Math.sin(dLon / 2) *
    //             Math.sin(dLon / 2);

    //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     return R * c;
    // }, []);

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
            // setIsLoading(true);
            setError(null);

            try {
                const geocodedProviders = await fetch(
                    '/data/geocoded-providers.json'
                );
                const geocodedProvidersJSON = await geocodedProviders.json();

                console.log('geocodedProviders', geocodedProvidersJSON);
                // setProviders(geocodedProvidersJSON);
                setFilteredProviders(geocodedProvidersJSON);
            } catch (error) {
                console.error('Provider loading error:', error);
                setError(error.message);
            } finally {
                // setIsLoading(false);
            }
        };

        loadProviders();
    }, [setFilteredProviders]);

    // Filter providers
    // const filterProviders = useCallback(async () => {
    //     setIsLoading(true);
    //     try {
    //         let filtered = [...providers];

    //         if (filters.service) {
    //             filtered = filtered.filter((provider) =>
    //                 provider.services?.includes(filters.service)
    //             );
    //         }

    //         if (filters.zipCode) {
    //             const zipCoords = await getZipCodeCoordinates(filters.zipCode);
    //             if (zipCoords) {
    //                 filtered = filtered.filter(
    //                     (provider) =>
    //                         provider.coordinates &&
    //                         calculateDistance(
    //                             provider.coordinates,
    //                             zipCoords
    //                         ) <= filters.radius
    //                 );
    //             } else {
    //                 setError('Invalid ZIP code');
    //             }
    //         }

    //         setFilteredProviders(filtered);
    //     } catch (error) {
    //         console.error('Filtering error:', error);
    //         setError('Failed to apply filters');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, [filters, providers, calculateDistance]);

    const onProviderSelect = () => {
        return;
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
            {/* Add your list view content here */}
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
                                    <h3>{provider.provider_name}</h3>
                                    <p>
                                        {provider.street_address},{' '}
                                        {provider.county} County
                                    </p>
                                    <p>Service: {provider.service_type}</p>
                                    <p>Phone: {provider.phone_number}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
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
