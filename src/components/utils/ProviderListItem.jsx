import PropTypes from 'prop-types';
import '../../styles/ProviderListItem.css';

const ProviderItem = ({ provider, onClick }) => {
    const handleMouseEnter = (e) => {
        e.currentTarget.classList.add('provider-item-hover');
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.classList.remove('provider-item-hover');
    };

    return (
        <li
            className='provider-item'
            onClick={() => onClick && onClick(provider)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className='provider-item-name'>{provider.provider_name}</div>

            <div className='provider-item-info-row'>
                <span className='provider-item-label'>Address:</span>
                <span className='provider-item-value'>
                    {provider.street_address}
                </span>
            </div>

            <div className='provider-item-info-row'>
                <span className='provider-item-label'>Phone:</span>
                <span className='provider-item-value'>
                    {provider.phone_number}
                </span>
            </div>

            <div className='provider-item-info-row'>
                <span className='provider-item-label'>Service:</span>
                <span className='provider-item-badge'>
                    {provider.service_type}
                </span>
            </div>
        </li>
    );
};

ProviderItem.propTypes = {
    provider: PropTypes.shape({
        provider_name: PropTypes.string.isRequired,
        street_address: PropTypes.string.isRequired,
        phone_number: PropTypes.string.isRequired,
        service_type: PropTypes.string.isRequired,
    }).isRequired,
    onClick: PropTypes.func,
};

export default ProviderItem;
