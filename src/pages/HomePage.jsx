import HeroImage from '/idd-homepage.png';
import AboutImage from '/about-us-idd.png';

import '../styles/Homepage.css';

const HomePage = () => {
    return (
        <div className='landing-page'>
            <section className='home-hero'>
                <img
                    src={HeroImage}
                    alt='Hero image'
                />
            </section>

            <section className='content-section'>
                <div className='content-container'>
                    <h2 className='content-title'>Keystone Alliance</h2>
                    <p className='content-text'>
                        Accessing essential services for individuals with Intellectual and Developmental Disabilities (IDD) 
                    can be a complex and time-consuming process. This website is designed to streamline this experience by 
                    providing a centralized platform to locate and connect with verified support services, 
                    including healthcare, therapy, education, employment assistance, and community programs.
                    </p>
                    <button className='learn-more-button'>LEARN MORE</button>
                </div>
            </section>

            <section className='about-section'>
                <div className='about-container'>
                    <h2 className='about-title'>About Us</h2>
                    <p className='about-subtitle'>We are here to help.</p>

                    <div className='about-content'>
                        <div className='about-text'>
                            <h3 className='about-heading'>Our Mission</h3>
                            <p className='about-description'>
                                Our goal is to enhace accessibility, promote independence, and improve
                                the quality of life for individuals with IDD and their families.
                            </p>
                            <p className='about-description'>
                                The Keystone Alliance team has decades of nonprofit experience and a demonstrated track record of strengthening the financial and mission performance of its client organizations. 
                            From regular weekly check-ins with your team to share updates and report on results, to an embedded Keystone liaison to work on-site at your organization so your team has an expert-on-hand to support your operations and serve as a sounding board for new ideas.  
                            We work together with our customer organization to create and deliver innovative, long-term solutions that make a real and lasting mission impact.
                            </p>
                        </div>
                        <div className='about-image'>
                            {/* Placeholder for image */}
                            <img
                                src={AboutImage}
                                alt='about us'
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
