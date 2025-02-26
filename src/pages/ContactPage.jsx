import { useState } from 'react';
import { Search, Info } from 'lucide-react';
import Modal from '../components/utils/Modal';
import '../styles/ContactPage.css';

const categories = [
    {
        title: 'My Account',
        description: 'Manage your account.',
        modalContent: (
            <>
                <h3>My Account</h3>
                <p>
                    Here you can manage your account settings, update your
                    profile information, and change your password.
                </p>
                <ul>
                    <li>Update personal information</li>
                    <li>Change your password</li>
                    <li>Manage notification preferences</li>
                    <li>View account history</li>
                </ul>
            </>
        ),
    },
    {
        title: 'FAQ',
        description:
            'Have a question? Click here to see answers to our frequently asked questions.',
        modalContent: (
            <>
                <h3>Frequently Asked Questions</h3>
                <h4>How do I reset my password?</h4>
                <p>
                    You can reset your password by clicking the `Forgot
                    Password` link on the login page.
                </p>

                <h4>How long does shipping take?</h4>
                <p>
                    Standard shipping typically takes 3-5 business days. Express
                    shipping is 1-2 business days.
                </p>

                <h4>What payment methods do you accept?</h4>
                <p>We accept all major credit cards, PayPal, and Apple Pay.</p>
            </>
        ),
    },
    {
        title: 'Language & Accessibility',
        description:
            'Customize your experience with language and accessibility options to ensure seamless navigation and inclusive access for all users.',
        modalContent: (
            <>
                <h3>Language & Accessibility Options</h3>
                <p>
                    We&apos;re committed to making our platform accessible to
                    everyone.
                </p>

                <h4>Language Settings</h4>
                <p>
                    Select your preferred language from the dropdown menu below:
                </p>
                <select>
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                </select>

                <h4>Accessibility Features</h4>
                <ul>
                    <li>Screen reader compatibility</li>
                    <li>Text size adjustment</li>
                    <li>High contrast mode</li>
                    <li>Keyboard navigation</li>
                </ul>
            </>
        ),
    },
    {
        title: 'Privacy & Security',
        description:
            'Protecting your data is our priority. Manage your privacy settings and learn how we keep your information secure.',
        modalContent: (
            <>
                <h3>Privacy & Security</h3>
                <p>
                    Your data security is our top priority. Here&apos;s how we
                    protect your information:
                </p>

                <h4>Data Protection</h4>
                <p>
                    All data is encrypted using industry-standard protocols and
                    stored securely.
                </p>

                <h4>Privacy Settings</h4>
                <p>
                    You can control what information is shared and how it&apos;s
                    used in your account settings.
                </p>

                <h4>Security Tips</h4>
                <ul>
                    <li>Use a strong, unique password</li>
                    <li>Enable two-factor authentication</li>
                    <li>Be cautious of phishing attempts</li>
                    <li>Log out when using shared devices</li>
                </ul>
            </>
        ),
    },
];

const ContactPage = () => {
    // Create state to track which modal is open
    const [openModalIndex, setOpenModalIndex] = useState(null);

    // Open a specific modal by its index
    const openModal = (index) => {
        setOpenModalIndex(index);
    };

    // Close the currently open modal
    const closeModal = () => {
        setOpenModalIndex(null);
    };

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
                                    <button
                                        className='card-button'
                                        onClick={() => openModal(index)}
                                    >
                                        Go
                                    </button>
                                </div>
                            </div>

                            {/* Modal for this category */}
                            <Modal
                                isOpen={openModalIndex === index}
                                onClose={closeModal}
                                title={category.title}
                            >
                                {category.modalContent}
                            </Modal>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
