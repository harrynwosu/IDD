import { useState } from 'react';
import '../styles/FAQPage.css';

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null); // Track which FAQ is open

    const faqData = [
        {
            question: 'How do I search for service providers',
            answer: 'You can use the search bar to find providers by name, location, or service type. A map view is also available.',
        },
        {
            question: 'Where does the provider information come from?',
            answer: 'Our data is collected from public sources and state agencies.',
        },
        {
            question: 'What if I find incorrect or outdated information?',
            answer: 'You can report incorrect details using the Thumbs up/down feature on provider pages.',
        },
        {
            question: 'Are all service providers licensed or verified?',
            answer: 'We aim to include only legitimate providers, but we encourage users to verify credentials before seeking services.',
        },
        {
            question: 'Can I filter providers by service type?',
            answer: 'Yes! You can filter results by categories such as resdential care, employment support, therapy services, etc.',
        },
        {
            question: 'How do I contact a service provider?',
            answer: 'Each provider listing includes contact details such as phone number and address.',
        },
        {
            question: "I'm having trouble using the website. Who do I contact?",
            answer: 'You can reach out via our Contact Us page for technical support.',
        },
        {
            question: 'Is my personal data safe on this website?',
            answer: 'We prioritize user privacy and do not collect personal information.',
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index); // Toggle open state
    };

    return (
        <div className='faq-container'>
            <h1>Frequently Asked Questions</h1>

            <div className='faq-section'>
                {faqData.map((faq, index) => (
                    <div
                        key={index}
                        className={`faq-item ${
                            openIndex === index ? 'open' : 'closed'
                        }`}
                        onClick={() => toggleFAQ(index)}
                    >
                        <div className='faq-title'>
                            {faq.question}
                            <span className='arrow'>
                                {openIndex === index ? '▲' : '▼'}
                            </span>
                        </div>
                        {openIndex === index && (
                            <div className='faq-answer'>{faq.answer}</div>
                        )}
                    </div>
                ))}
            </div>

            {/* Button to go back to Contact Page */}
            {/* <Link
                to='/contact'
                className='back-button'
            >
                Back to Contact
            </Link> */}
        </div>
    );
};

export default FAQPage;
