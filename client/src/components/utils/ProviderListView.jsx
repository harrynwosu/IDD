import PropTypes from 'prop-types';
import ProviderListItem from './ProviderListItem';

import '../../styles/ProviderListView.css';

const ProviderListView = ({ providers, onProviderSelect }) => {
    if (!providers || providers.length === 0) {
        return (
            <div className='provider-list-container'>
                <div className='provider-list-no-results'>
                    No providers found. Try adjusting your search criteria.
                </div>
            </div>
        );
    }

    return (
        <div className='provider-list-container'>
            <ul className='provider-list'>
                {providers.map((provider, index) => (
                    <ProviderListItem
                        key={`${provider.provider_name}-${index}`}
                        provider={provider}
                        onClick={onProviderSelect}
                    />
                ))}
            </ul>
        </div>
    );
};

ProviderListView.propTypes = {
    providers: PropTypes.arrayOf(
        PropTypes.shape({
            provider_name: PropTypes.string.isRequired,
            street_address: PropTypes.string.isRequired,
            phone: PropTypes.string.isRequired,
            service_type: PropTypes.string.isRequired,
        })
    ).isRequired,
    onProviderSelect: PropTypes.func,
};

export default ProviderListView;
