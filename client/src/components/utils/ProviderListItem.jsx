import PropTypes from 'prop-types';
import '../../styles/ProviderListItem.css';

const ProviderItem = ({ provider, onClick }) => {
    const handleMouseEnter = (e) => {
        e.currentTarget.classList.add('provider-item-hover');
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.classList.remove('provider-item-hover');
    };

    // Handle multiple service types
    const renderServiceTypes = () => {
        const serviceTypes = provider.service_type
            .split(',')
            .map((type) => type.trim());

        return serviceTypes.map((type, index) => (
            <span
                key={index}
                className='provider-item-badge'
            >
                {type}
            </span>
        ));
    };

    const toTitleCase = (str) =>
        str
            .toLowerCase()
            .replace(
                /\b\w+('\w)?/g,
                (word) => word.charAt(0).toUpperCase() + word.slice(1)
            );

    return (
        <div
            className='provider-item'
            onClick={() => onClick && onClick(provider)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className='provider-item-name'>
                {toTitleCase(provider.provider_name)}
            </div>
            <div className='provider-item-info-row'>
                <div className='provider-item-label'>Address:</div>
                <div className='provider-item-value'>
                    {`${provider.street_address}, ${provider.city}, ${provider.state}, ${provider.zipcode}.`}
                </div>
            </div>
            <div className='provider-item-info-row'>
                <div className='provider-item-label'>Phone:</div>
                <div className='provider-item-value'>
                    {provider.phone_number}
                </div>
            </div>
            <div className='provider-item-info-row'>
                <div className='provider-item-label'>Service:</div>
                <div className='provider-item-value provider-service-types'>
                    {renderServiceTypes()}
                </div>
            </div>
        </div>
    );
};

ProviderItem.propTypes = {
    provider: PropTypes.shape({
        provider_name: PropTypes.string.isRequired,
        street_address: PropTypes.string.isRequired,
        phone_number: PropTypes.string.isRequired,
        service_type: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.arrayOf(PropTypes.string).isRequired,
        ]),
    }).isRequired,
    onClick: PropTypes.func,
};

export default ProviderItem;
