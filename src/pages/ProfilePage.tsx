import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { getUserOrders } from '../api/orders';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Package, User, ArrowLeft } from 'lucide-react';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    product: {
      namePl: string;
      image?: string;
    };
    weight: number;
    quantity: number;
    price: number;
  }>;
}

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [isAuthenticated, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders();
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Wróć do strony głównej
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-pink-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name || 'Użytkownik'}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                {user.phone && <p className="text-gray-600">{user.phone}</p>}
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
            >
              <LogOut size={20} />
              Wyloguj się
            </button>
          </div>
        </div>

        {/* Orders History */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package size={24} />
            Historia zamówień
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Ładowanie...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 mb-4">Nie masz jeszcze żadnych zamówień</p>
              <Link
                to="/products"
                className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors"
              >
                Rozpocznij zakupy
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-gray-900">
                        Zamówienie #{order.id.slice(0, 8)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-pink-600">
                        {order.total.toFixed(2)} zł
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {order.status}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.items.length} {order.items.length === 1 ? 'produkt' : 'produktów'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
