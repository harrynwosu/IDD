import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import '../styles/SearchMap.css';

const containerStyle = {
    width: '100%',
    height: '800px',
};

// Chicago coordinates
const center = {
    lat: 41.8781,
    lng: -87.6298,
};

const SearchMap = () => {
    return (
        <div className='map-container'>
            {window.google === undefined ? (
                <LoadScript
                    googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                >
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={13}
                    >
                        <Marker position={center} />
                    </GoogleMap>
                </LoadScript>
            ) : (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={13}
                >
                    <Marker position={center} />
                </GoogleMap>
            )}
        </div>
    );
};

export default SearchMap;
