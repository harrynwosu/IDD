import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import SearchMap from '../components/SearchMap';
import PillToggle from '../components/utils/PillToggle';

const ServicesPage = () => {
    const [activeView, setActiveView] = useState('map');

    return (
        <>
            <SearchForm />
            <PillToggle
                activeView={activeView}
                setActiveView={setActiveView}
            />
            <SearchMap activeView={activeView} />
        </>
    );
};

export default ServicesPage;
