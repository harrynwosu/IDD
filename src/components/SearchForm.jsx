import { useState } from 'react';
import '../styles/SearchForm.css';

const SearchForm = () => {
    const [keyword, setKeyword] = useState('');
    const [county, setCounty] = useState('');
    const [zipCode, setZipCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // TODO: implement search functionality
    };

    return (
        <form
            className='search-form'
            onSubmit={handleSubmit}
        >
            <h2>
                To Help Locate What You Are Looking For Please Enter The
                Following:
            </h2>
            <div className='form-row'>
                <div className='form-group'>
                    <label htmlFor='keyword'>What Are You Looking For</label>
                    <input
                        type='text'
                        id='keyword'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='county'>County</label>
                    <input
                        type='text'
                        id='county'
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                    />
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
            <button type='submit'>Submit</button>
        </form>
    );
};

export default SearchForm;
