import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PanZelekDefault from './components/PanZelekDefault';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import BoxBuilderPage from './pages/BoxBuilderPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import { ToastContainer } from './components/ToastContainer';
import { ErrorBoundary } from './components/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<PanZelekDefault />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/box-builder" element={<BoxBuilderPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
