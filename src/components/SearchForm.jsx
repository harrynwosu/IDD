import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import '../styles/SearchForm.css';

const SearchForm = ({ setFilteredProviders }) => {
    // Form fields states
    const [serviceType, setServiceType] = useState('');
    const [county, setCounty] = useState('');
    const [zipCode, setZipCode] = useState('');

    // Provider data states
    const [providers, setProviders] = useState([]);
    // const [filteredProviders, setFilteredProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dropdown options states
    const [serviceTypes, setServiceTypes] = useState('');
    const [counties, setCounties] = useState('');
    const [zipCodes, setZipCodes] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/geocoded-providers.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                setProviders(data);
                setFilteredProviders(data);

                const uniqueServiceTypes = [
                    ...new Set(data.map((item) => item.service_type)),
                ].sort();
                const uniqueCounties = [
                    ...new Set(
                        data
                            // first map to county or undefined
                            .map((item) => item.county)
                            // then filter out falsy values (e.g. "", undefined, null)
                            .filter(Boolean)
                    ),
                ].sort();
                const uniqueZipCodes = [
                    ...new Set(data.map((item) => item.zipcode)),
                ].sort();

                setServiceTypes(uniqueServiceTypes);
                setCounties(uniqueCounties);
                setZipCodes(uniqueZipCodes);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filterProviders = () => {
        return providers.filter((provider) => {
            // Check if provider matches all selected criteria
            const matchesServiceType =
                !serviceType ||
                provider.service_type.toString().toLowerCase() ===
                    serviceType.toLowerCase();
            const matchesCounty =
                !county ||
                provider.county.toString().toLowerCase() ===
                    county.toLowerCase();
            const matchesZipCode = !zipCode || provider.zipcode === zipCode;

            return matchesServiceType && matchesCounty && matchesZipCode;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const results = filterProviders();
        setFilteredProviders(results);
        console.log('Search results:', results);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <form
            className='search-form'
            onSubmit={handleSubmit}
        >
            <h2>Find Providers Near You</h2>
            <div className='form-row'>
                <div className='form-group'>
                    <label htmlFor='serviceType'>Provider Service Type</label>
                    <select
                        id='serviceType'
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                    >
                        <option value=''>Select an option</option>
                        {serviceTypes.map((type) => (
                            <option
                                key={type}
                                value={type}
                                className='capitalize'
                            >
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='county'>County</label>
                    <select
                        id='county'
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                    >
                        <option value=''>Select a county</option>
                        {counties.map((item) => {
                            const capitalizedCounty =
                                item.charAt(0).toUpperCase() +
                                item.slice(1).toLowerCase();

                            return (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {capitalizedCounty}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='zipCode'>Zip Code</label>
                    {/* <input
                        type='text'
                        id='zipCode'
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                    /> */}
                    <select
                        id='zipCode'
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                    >
                        <option value=''>Select a zip code</option>
                        {zipCodes.map((zip) => (
                            <option
                                key={zip}
                                value={zip}
                            >
                                {zip}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <button type='submit'>Search</button>
        </form>
    );
};

SearchForm.propTypes = {
    activeView: PropTypes.string.isRequired,
    // filteredProviders: PropTypes.array.isRequired,
    setFilteredProviders: PropTypes.func.isRequired,
};

export default SearchForm;
