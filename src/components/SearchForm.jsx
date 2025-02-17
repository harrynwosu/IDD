import { useState } from 'react';
import '../styles/SearchForm.css';

const SearchForm = () => {
    const [keyword, setKeyword] = useState('');
    const [county, setCounty] = useState('');
    const [zipCode, setZipCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Keyword:', keyword);
        console.log('County:', county);

        // TODO: implement search functionality
    };

    return (
        <form
            className='search-form'
            onSubmit={handleSubmit}
        >
            <h2>Find Providers Near You</h2>
            <div className='form-row'>
                <div className='form-group'>
                    <label htmlFor='keyword'>What Are You Looking For</label>
                    <select
                        id='keyword'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    >
                        <option value=''>Select an option</option>
                        <option value='health'>Health</option>
                        <option value='education'>Education</option>
                        <option value='legal'>Legal</option>
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
                        <option value='county1'>County 1</option>
                        <option value='county2'>County 2</option>
                        <option value='county3'>County 3</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='zipCode'>Zip Code</label>
                    <input
                        type='text'
                        id='zipCode'
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                </div>
            </div>
            <button type='submit'>Search</button>
        </form>
    );
};

export default SearchForm;
