import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Modal from '../components/utils/Modal';

import '../styles/AdminPage.css';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL;

// Login Component
export function Login({ setAuthToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = btoa(`${username}:${password}`);

        try {
            // Test the credentials against the admin API
            const response = await fetch(`${API_URL}/api/providers/admin`, {
                headers: {
                    Authorization: `Basic ${token}`,
                },
            });

            if (response.ok) {
                setAuthToken(token);
                localStorage.setItem('authToken', token);
                navigate('/admin');
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            console.log('Login error:', error);
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className='login-container'>
            <h2>Admin Login</h2>
            {error && <div className='error'>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Username:</label>
                    <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label>Password:</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type='submit'>Login</button>
            </form>
        </div>
    );
}

// Provider List Component
function ProviderList({
    authToken,
    onAddProvider,
    onEditProvider,
    handleLogout,
}) {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProviders, setTotalProviders] = useState(0);
    const providersPerPage = 50;

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${API_URL}/api/providers/admin?page=${currentPage}&limit=${providersPerPage}`,
                    {
                        headers: {
                            Authorization: `Basic ${authToken}`,
                        },
                    }
                );

                if (!response.ok) throw new Error('Failed to fetch providers');

                const data = await response.json();
                setProviders(data.providers || data); // Handle both formats depending on your API

                // Get total count from headers or response body
                const totalCount =
                    response.headers.get('X-Total-Count') || data.totalCount;

                setTotalProviders(
                    totalCount
                        ? parseInt(totalCount)
                        : (data.providers || data).length
                );

                setLoading(false);
            } catch (error) {
                setError('Failed to load providers');
                setLoading(false);
            }
        };

        fetchProviders();
    }, [authToken, currentPage]);

    const handleStartGeocoding = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/geocode`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert(
                    'Geocoding job started. This process runs in the background.'
                );
            } else {
                throw new Error('Failed to start geocoding');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this provider?')) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/providers/admin/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Basic ${authToken}`,
                    },
                }
            );

            if (response.ok) {
                setProviders(
                    providers.filter((provider) => provider.id !== id)
                );

                // If we delete the last item on a page, go to previous page (unless we're on page 1)
                if (providers.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            } else {
                throw new Error('Failed to delete provider');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const totalPages = Math.ceil(totalProviders / providersPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const truncateText = (text, maxLength = 50) => {
        if (!text) return '';
        return text.length > maxLength
            ? text.slice(0, maxLength) + '...'
            : text;
    };

    if (loading) return <div className='spinner' />;
    if (error) return <div>{error}</div>;

    return (
        <div className='provider-list'>
            <div className='provider-list-header'>
                <h1>Service Providers</h1>
                <div className='admin-buttons'>
                    <button onClick={handleStartGeocoding}>
                        Start Geocoding
                    </button>
                    <button onClick={onAddProvider}>Add New Provider</button>
                    <button
                        className='logout-button'
                        onClick={handleLogout}
                    >
                        Log out
                    </button>
                </div>
            </div>

            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Service Type</th>
                            <th>Good Reviews</th>
                            <th>Bad Reviews</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {providers.map((provider) => (
                            <tr key={provider.id}>
                                <td style={{ textAlign: 'left' }}>
                                    {provider.provider_name}
                                </td>
                                <td>{provider.street_address}</td>
                                <td>{provider.city}</td>
                                <td>{provider.state}</td>
                                <td>{truncateText(provider.service_type)}</td>
                                <td>{provider.good_ratings}</td>
                                <td>{provider.bad_ratings}</td>

                                <td>
                                    <button
                                        className='edit-provider-button'
                                        onClick={() =>
                                            onEditProvider(provider.id)
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className='delete-provider-button'
                                        onClick={() =>
                                            handleDelete(provider.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className='pagination'>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    <span className='page-info'>
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

// Provider Form Component (used for both Add and Edit)
export function ProviderForm({ authToken, providerId = null }) {
    const [provider, setProvider] = useState({
        provider_name: '',
        street_address: '',
        city: '',
        county: '',
        state: '',
        zipcode: '',
        phone_number: '',
        service_type: '',
    });
    const [loading, setLoading] = useState(providerId ? true : false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const serviceTypeOptions = [
        'Adaptive Equipment/Assistive Technology Services',
        'Adult Day Health Services',
        'Behavior Intervention and Treatment',
        'Community Day Services',
        'Community Integrated Living Arrangement Services',
        'Community Living Facility Services',
        'Home and Vehicle Modification Services',
        'Intermediate Care Facility Services',
        'Psychotherapy and Counseling Services',
    ];

    useEffect(() => {
        if (providerId) {
            console.log(`${API_URL}/api/providers/admin/${providerId}`);
            const fetchProvider = async () => {
                try {
                    const response = await fetch(
                        `${API_URL}/api/providers/admin/${providerId}`,
                        {
                            headers: {
                                Authorization: `Basic ${authToken}`,
                            },
                        }
                    );

                    if (!response.ok)
                        throw new Error('Failed to fetch provider');

                    const data = await response.json();
                    setProvider(data);
                    setLoading(false);
                } catch (error) {
                    setError('Failed to load provider details');
                    setLoading(false);
                }
            };

            fetchProvider();
        }
    }, [authToken, providerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProvider({
            ...provider,
            [name]: value,
        });
    };

    const handleServiceTypeChange = (e) => {
        const { name, options } = e.target;
        const selectedValues = Array.from(options)
            .filter((option) => option.selected)
            .map((option) => option.value)
            .join(',');

        setProvider((prev) => ({
            ...prev,
            [name]: selectedValues,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const method = providerId ? 'PUT' : 'POST';
            const url = providerId
                ? `${API_URL}/api/providers/admin/${providerId}`
                : `${API_URL}/api/providers/admin/`;

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Basic ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(provider),
            });

            if (!response.ok) throw new Error('Failed to save provider');

            setSuccess(
                providerId
                    ? 'Provider updated successfully'
                    : 'Provider added successfully'
            );

            if (!providerId) {
                // Clear form after adding
                setProvider({
                    provider_name: '',
                    street_address: '',
                    city: '',
                    county: '',
                    state: '',
                    zipcode: '',
                    phone_number: '',
                    service_type: '',
                });
            }
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <div className='spinner' />;

    return (
        <div className='provider-form'>
            {error && <div className='error'>{error}</div>}
            {success && <div className='success'>{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Provider Name:</label>
                    <input
                        type='text'
                        name='provider_name'
                        value={provider.provider_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label>Street Address:</label>
                    <input
                        type='text'
                        name='street_address'
                        value={provider.street_address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label>City:</label>
                    <input
                        type='text'
                        name='city'
                        value={provider.city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label>County:</label>
                    <input
                        type='text'
                        name='county'
                        value={provider.county}
                        onChange={handleChange}
                    />
                </div>

                <div className='form-group'>
                    <label>State:</label>
                    <input
                        type='text'
                        name='state'
                        value={provider.state}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label>Zipcode:</label>
                    <input
                        type='text'
                        name='zipcode'
                        value={provider.zipcode}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label>Phone Number:</label>
                    <input
                        type='text'
                        name='phone_number'
                        value={provider.phone_number}
                        onChange={handleChange}
                    />
                </div>

                <div className='form-group'>
                    <label className='service-type-label'>Service Type:</label>
                    <span className='service-type-sublabel'>
                        (Hold Ctrl/Cmd to select multiple options)
                    </span>
                    <select
                        name='service_type'
                        className='service-select'
                        multiple
                        value={
                            provider.service_type
                                ? provider.service_type.split(',')
                                : []
                        }
                        onChange={handleServiceTypeChange}
                    >
                        {serviceTypeOptions.map((type) => (
                            <option
                                key={type}
                                value={type}
                            >
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='form-buttons'>
                    <button type='submit'>
                        {providerId ? 'Update Provider' : 'Add Provider'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export function ProtectedRoute({ authToken }) {
    return authToken ? (
        <Outlet />
    ) : (
        <Navigate
            to='/admin-login'
            replace
        />
    );
}

export function AdminPage({ authToken, setAuthToken }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProviderId, setCurrentProviderId] = useState(null);

    const openAddModal = () => {
        setCurrentProviderId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (providerId) => {
        setCurrentProviderId(providerId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        setAuthToken('');
        localStorage.removeItem('authToken');
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken) {
            navigate('/admin-login');
        }
    }, [authToken, navigate]);

    return (
        <div>
            <ProviderList
                authToken={authToken}
                onAddProvider={openAddModal}
                onEditProvider={openEditModal}
                handleLogout={handleLogout}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={currentProviderId ? 'Edit Provider' : 'Add New Provider'}
            >
                <ProviderForm
                    authToken={authToken}
                    providerId={currentProviderId}
                    onSuccess={() => {
                        closeModal();
                        // TODO: Refresh the provider list here
                    }}
                />
            </Modal>
        </div>
    );
}
