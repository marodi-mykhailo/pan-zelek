import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Home, BarChart3, Package, ShoppingBag, Users } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  selectedTab?: 'stats' | 'orders' | 'products' | 'users';
  setSelectedTab?: (tab: 'stats' | 'orders' | 'products' | 'users') => void;
}

export const AdminLayout = ({ children, selectedTab, setSelectedTab }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const isActive = (tab: 'stats' | 'orders' | 'products' | 'users') => {
    if (selectedTab) {
      return selectedTab === tab;
    }
    // Fallback to URL-based detection
    if (tab === 'stats') return location.pathname === '/admin';
    if (tab === 'orders') return location.pathname.includes('/admin/orders') || location.search.includes('tab=orders');
    if (tab === 'products') return location.pathname.includes('/admin/products') || location.search.includes('tab=products');
    if (tab === 'users') return location.pathname.includes('/admin/users') || location.search.includes('tab=users');
    return false;
  };

  const handleTabClick = (tab: 'stats' | 'orders' | 'products' | 'users') => {
    if (setSelectedTab) {
      setSelectedTab(tab);
    } else {
      // Fallback to URL navigation
      if (tab === 'stats') {
        navigate('/admin');
      } else {
        navigate(`/admin?tab=${tab}`);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  A
                </div>
                <span className="font-bold text-xl text-gray-900">Admin Panel</span>
              </Link>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user?.name || 'Admin'}</div>
                  <div className="text-gray-500 text-xs">{user?.email}</div>
                </div>
              </div>
              <Link
                to="/"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Home size={18} />
                <span className="font-medium">Sklep</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden md:inline font-medium">Wyloguj</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => handleTabClick('stats')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('stats')
                  ? 'bg-purple-50 text-purple-700 font-semibold border-l-4 border-purple-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 size={20} />
              <span>Statystyki</span>
            </button>
            <button
              onClick={() => handleTabClick('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('orders')
                  ? 'bg-purple-50 text-purple-700 font-semibold border-l-4 border-purple-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ShoppingBag size={20} />
              <span>Zamówienia</span>
            </button>
            <button
              onClick={() => handleTabClick('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('products')
                  ? 'bg-purple-50 text-purple-700 font-semibold border-l-4 border-purple-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Package size={20} />
              <span>Produkty</span>
            </button>
            <button
              onClick={() => handleTabClick('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('users')
                  ? 'bg-purple-50 text-purple-700 font-semibold border-l-4 border-purple-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users size={20} />
              <span>Użytkownicy</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
