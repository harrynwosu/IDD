import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import SearchMap from '../components/SearchMap';
import PillToggle from '../components/utils/PillToggle';

const ServicesPage = () => {
    const [activeView, setActiveView] = useState('map');
    const [filteredProviders, setFilteredProviders] = useState([]);

    return (
        <>
            <SearchForm setFilteredProviders={setFilteredProviders} />
            <PillToggle
                activeView={activeView}
                setActiveView={setActiveView}
            />
            <SearchMap
                activeView={activeView}
                filteredProviders={filteredProviders}
                setFilteredProviders={setFilteredProviders}
            />
        </>
    );
};

export default ServicesPage;
