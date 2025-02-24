import { Search, Info } from 'lucide-react';

import '../styles/ContactPage.css';

const categories = [
    {
        title: 'My Account',
        description:
            'Manage your account.',
    },
    {
        title: 'FAQ',
        description:
            'Have a question? Click here to see answers to our frequently asked questions.',
    },
    {
        title: 'Language & Accessibility',
        description:
            'Customize your experience with language and accessibility options to ensure seamless navigation and inclusive access for all users.',
    },
    {
        title: 'Privacy & Security',
        description:
            'Protecting your data is our priority. Manage your privacy settings and learn how we keep your information secure.',
    },
];

const ContactPage = () => {
    return (
        <div className='help-center'>
            <div className='contact-hero'>
                <div className='contact-hero-content'>
                    <h1 className='contact-hero-title'>How can we help you?</h1>

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

export default ContactPage;
