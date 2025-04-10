import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
    Outlet,
    useNavigate,
} from 'react-router-dom';

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
function ProviderList({ authToken }) {
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
            const response = await fetch(`${API_URL}/admin/providers/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Basic ${authToken}`,
                },
            });

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='provider-list'>
            <div className='provider-list-header'>
                <h2>Service Providers</h2>
                <div>
                    <button onClick={handleStartGeocoding}>
                        Start Geocoding
                    </button>
                    <Link to='/admin/add'>
                        <button>Add New Provider</button>
                    </Link>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Service Type</th>
                        <th>Geocoded</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {providers.map((provider) => (
                        <tr key={provider.id}>
                            <td>{provider.provider_name}</td>
                            <td>{provider.street_address}</td>
                            <td>{provider.city}</td>
                            <td>{provider.state}</td>
                            <td>{provider.service_type}</td>
                            <td>
                                {provider.lat && provider.lon ? 'Yes' : 'No'}
                            </td>
                            <td>
                                <Link to={`/admin/edit/${provider.id}`}>
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(provider.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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

    useEffect(() => {
        if (providerId) {
            const fetchProvider = async () => {
                try {
                    const response = await fetch(
                        `${API_URL}/api/providers/admin/providers/${providerId}`,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const method = providerId ? 'PUT' : 'POST';
            const url = providerId
                ? `${API_URL}/api/providers/admin/providers/${providerId}`
                : `${API_URL}/api/providers/admin/providers`;

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

    if (loading) return <div>Loading...</div>;

    return (
        <div className='provider-form'>
            <h2>{providerId ? 'Edit Provider' : 'Add New Provider'}</h2>
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
                    <label>Service Type:</label>
                    <input
                        type='text'
                        name='service_type'
                        value={provider.service_type}
                        onChange={handleChange}
                    />
                </div>

                <div className='form-buttons'>
                    <button type='submit'>
                        {providerId ? 'Update Provider' : 'Add Provider'}
                    </button>
                    <Link to='/admin'>
                        <button type='button'>Cancel</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}

// Migration Component
export function Migration({ authToken }) {
    const [csvPath, setCsvPath] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(
                `${API_URL}/api/providers/admin/migrate`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Basic ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ csvFilePath: csvPath }),
                }
            );

            if (!response.ok) throw new Error('Migration failed');

            setSuccess('Data migration completed successfully');
            setCsvPath('');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='migration-form'>
            <h2>Migrate Data from CSV</h2>
            <p>
                Use this tool to import providers from a CSV file on the server.
            </p>
            {error && <div className='error'>{error}</div>}
            {success && <div className='success'>{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>CSV File Path:</label>
                    <input
                        type='text'
                        value={csvPath}
                        onChange={(e) => setCsvPath(e.target.value)}
                        placeholder='/path/to/your/csv/file.csv'
                        required
                    />
                </div>
                <button
                    type='submit'
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Start Migration'}
                </button>
            </form>

            <div className='back-link'>
                <Link to='/admin'>Back to Provider List</Link>
            </div>
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
        <Routes>
            <Route
                path='/'
                element={<ProviderList authToken={authToken} />}
            />
            <Route
                path='/add'
                element={<ProviderForm authToken={authToken} />}
            />
            <Route
                path='/edit/:id'
                element={
                    <ProviderForm
                        authToken={authToken}
                        providerId={window.location.pathname.split('/').pop()}
                    />
                }
            />
            <Route
                path='/migrate'
                element={<Migration authToken={authToken} />}
            />
        </Routes>
    );
}
