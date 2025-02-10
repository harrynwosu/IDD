import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';
import './App.css';

// Component to handle scroll to top on route change
const ScrollToTop = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return null;
};

function App() {
    return (
        <>
            <Router>
                <Navbar />
                <ScrollToTop />
                <Routes>
                    <Route
                        path='/'
                        exact
                        element={<HomePage />}
                    />
                    <Route
                        path='/services'
                        element={<ServicesPage />}
                    />
                    <Route
                        path='/contact'
                        element={<ContactPage />}
                    />
                </Routes>
                <Footer />
            </Router>
        </>
    );
}

export default App;
