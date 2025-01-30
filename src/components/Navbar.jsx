import { Link } from 'react-router-dom';

import '../styles/NavBar.css';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='/about'>About</Link>
                </li>
                <li>
                    <Link to='/services'>Services</Link>
                </li>
                <li>
                    <Link to='/resources'>Resources</Link>
                </li>
                <li>
                    <Link to='/contact'>Contact</Link>
                </li>
                <li>
                    <Link to='/support'>Support</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
