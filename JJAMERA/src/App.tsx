/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import OurStory from './pages/OurStory';
import Contact from './pages/Contact';
import FullMenu from './pages/FullMenu';
import Deals from './pages/Deals';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Signatures from './pages/Signatures';
import Locations from './pages/Locations';
import Blog from './pages/Blog';
import { CartProvider } from './context/CartContext';
import { Cart } from './components/Cart';

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="story" element={<OurStory />} />
        <Route path="contact" element={<Contact />} />
        <Route path="menu" element={<FullMenu />} />
        <Route path="deals" element={<Deals />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="signatures" element={<Signatures />} />
        <Route path="locations" element={<Locations />} />
        <Route path="blog" element={<Blog />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <CartProvider>
        <Layout>
          <AppRoutes />
        </Layout>
        <Cart />
      </CartProvider>
    </Router>
  );
}
