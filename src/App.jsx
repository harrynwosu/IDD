import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ResourcesPage from './pages/ResourcesPage';
import ContactPage from './pages/ContactPage';
import SupportPage from './pages/SupportPage';
import Footer from './components/Footer';
import './App.css';

function App() {
    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route
                        path='/'
                        exact
                        element={<HomePage />}
                    />
                    <Route
                        path='/about'
                        element={<AboutPage />}
                    />
                    <Route
                        path='/services'
                        element={<ServicesPage />}
                    />
                    <Route
                        path='/resources'
                        element={<ResourcesPage />}
                    />
                    <Route
                        path='/contact'
                        element={<ContactPage />}
                    />
                    <Route
                        path='/support'
                        element={<SupportPage />}
                    />
                </Routes>
                <Footer />
            </Router>
        </>
    );
}

export default App;
