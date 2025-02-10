import HeroImage from '../../public/idd-homepage.png';
import AboutImage from '../../public/about-us-idd.png';

import '../styles/HomePage.css';

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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Mauris et mattis nisi. Mauris imperdiet porta velit in
                        ullamcorper. Morbi vel tellus sit amet est mattis
                        convallis non non felis. Donec eget dignissim lorem.
                        Pellentesque congue enim quis augue condimentum
                        imperdiet. Donec eu lacinia turpis. Curabitur pulvinar
                        dictum facilisis. Duis fermentum volutpat venenatis.
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
                                Body text for your whole article or post.
                                We&aposll put in some lorem ipsum to show how a
                                filled-out page might look:
                            </p>
                            <p className='about-description'>
                                Excepteur efficient emerging, minim veniam enim
                                aute carefully curated Circle conversation
                                exquisite perfect nostrud nel impeccato normal.
                                Qui remarkable first clean ultra-rib industrial
                                adipiscing, essential lovely quem timber espumso
                                inure. Exclusive tralexya charming Scandinavian
                                impeccable aute quality of life soft power
                                pariatur Melbourne occascat discerning. Qui
                                wardrobe aliquip, et Porter destination Toto
                                remarkable officia Helsinki excepteur Basset
                                hound. Zurich sleepy perfect consectetur.
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
