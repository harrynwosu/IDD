import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/FAQPage.css"; // Ensure you have CSS for styling

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null); // Track which FAQ is open

    const faqData = [
        {
            question: "How do I reset my password?",
            answer: "Click on the ‘Forgot Password’ link on the login page and follow the instructions.",
        },
        {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and Apple Pay.",
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index); // Toggle open state
    };

    return (
        <div className="faq-container">
            <h1>Here’s the Answer to Your Questions</h1>

            <div className="faq-section">
                {faqData.map((faq, index) => (
                    <div
                        key={index}
                        className={`faq-item ${openIndex === index ? "open" : "closed"}`}
                        onClick={() => toggleFAQ(index)}
                    >
                        <div className="faq-title">
                            {faq.question}
                            <span className="arrow">{openIndex === index ? "▲" : "▼"}</span>
                        </div>
                        {openIndex === index && <div className="faq-answer">{faq.answer}</div>}
                    </div>
                ))}
            </div>

            {/* Button to go back to Contact Page */}
            <Link to="/contact" className="back-button">Back to Contact</Link>
        </div>
    );
};

export default FAQPage;
