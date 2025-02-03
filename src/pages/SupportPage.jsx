import { Search, Info } from 'lucide-react';

import '../styles/SupportPage.css';

const categories = [
    {
        title: 'My Account',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
        title: 'FAQ',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
        title: 'Language & Accessibility',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
        title: 'Privacy & Security',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
];

const SupportPage = () => {
    return (
        <div className='help-center'>
            <div className='hero'>
                <div className='hero-content'>
                    <h1 className='hero-title'>How can we help you?</h1>

                    <div className='search-container'>
                        <input
                            type='text'
                            placeholder='Search'
                            className='search-input'
                        />
                        <Search
                            className='search-icon'
                            size={20}
                        />
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className='categories-grid'>
                <div className='grid'>
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className='category-card'
                        >
                            <div className='card-content'>
                                <div className='icon-circle'>
                                    <Info />
                                </div>
                                <div className='card-text'>
                                    <h2 className='card-title'>
                                        {category.title}
                                    </h2>
                                    <p className='card-description'>
                                        {category.description}
                                    </p>
                                    <button className='card-button'>Go</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
