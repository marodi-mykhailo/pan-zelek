import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../store/toastStore';
import { getAdminStats, getAdminOrders, updateOrderStatus, Order } from '../api/admin';
import { Package, ShoppingBag, Users, TrendingUp, Loader2, CheckCircle, XCircle, Clock, Truck, Eye, Download } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AdminLayout } from '../components/AdminLayout';
import ProductsAdmin from './admin/ProductsAdmin';
import UsersAdmin from './admin/UsersAdmin';
import OrderDetailModal from './admin/OrderDetailModal';
import StatsChart from './admin/StatsChart';

const AdminPage = () => {
  const showToast = useToastStore((state) => state.showToast);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTab, setSelectedTab] = useState<'stats' | 'orders' | 'products' | 'users'>('stats');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { isAuthenticated, isAdmin } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    if (!isAdmin()) {
      showToast('Brak uprawnień administratora', 'error');
      navigate('/');
      return;
    }
    loadData();
  }, [isAuthenticated, isAdmin, navigate, showToast]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, ordersData] = await Promise.all([
        getAdminStats(),
        getAdminOrders(),
      ]);
      setStats(statsData);
      setOrders(ordersData.orders);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      showToast('Nie udało się załadować danych', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast('Status zamówienia zaktualizowany', 'success');
      loadData();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Nie udało się zaktualizować statusu',
        'error'
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'CANCELLED':
        return <XCircle size={16} className="text-red-600" />;
      case 'SHIPPED':
      case 'PROCESSING':
        return <Truck size={16} className="text-blue-600" />;
      default:
        return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-gray-600">Ładowanie danych...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout selectedTab={selectedTab} setSelectedTab={setSelectedTab}>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel Administracyjny</h1>
              <p className="text-gray-600 mt-1">Zarządzaj sklepem i zamówieniami</p>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <Loader2 size={16} className={loading ? 'animate-spin' : ''} />
              Odśwież
            </button>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden mb-6 border-b border-gray-200">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedTab('stats')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  selectedTab === 'stats'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Statystyki
              </button>
              <button
                onClick={() => setSelectedTab('orders')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  selectedTab === 'orders'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Zamówienia ({orders.length})
              </button>
              <button
                onClick={() => setSelectedTab('products')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  selectedTab === 'products'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Produkty
              </button>
              <button
                onClick={() => setSelectedTab('users')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  selectedTab === 'users'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Użytkownicy
              </button>
            </div>
          </div>

        {selectedTab === 'stats' && (
          <>
            {/* Export Button */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => {
                  const csv = [
                    ['Metryka', 'Wartość'],
                    ['Zamówienia', stats.totalOrders],
                    ['Produkty', stats.totalProducts],
                    ['Użytkownicy', stats.totalUsers],
                    ['Przychód (zł)', stats.totalRevenue.toFixed(2)],
                  ]
                    .map((row) => row.join(','))
                    .join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `statystyki-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  showToast('Eksportowano statystyki', 'success');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Eksportuj CSV
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Zamówienia</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <ShoppingBag size={32} className="text-pink-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produkty</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <Package size={32} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Użytkownicy</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users size={32} className="text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Przychód</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toFixed(2)} zł</p>
              </div>
              <TrendingUp size={32} className="text-yellow-500" />
            </div>
          </div>
        </div>

            {/* Charts */}
            <StatsChart orders={orders} />
          </>
        )}

        {selectedTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Export Button */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => {
                  const csv = [
                    ['ID', 'Email', 'Telefon', 'Produkty', 'Kwota', 'Status', 'Data'],
                    ...orders.map((order) => [
                      order.id.slice(0, 8),
                      order.email,
                      order.phone || '',
                      order.items.length.toString(),
                      order.total.toFixed(2),
                      order.status,
                      new Date(order.createdAt).toLocaleDateString('pl-PL'),
                    ]),
                  ]
                    .map((row) => row.map((cell) => `"${cell}"`).join(','))
                    .join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `zamowienia-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  showToast('Eksportowano zamówienia', 'success');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Eksportuj CSV
              </button>
            </div>

            <div className="overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Klient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produkty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kwota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{order.user?.name || order.email}</div>
                          {order.phone && (
                            <div className="text-gray-500 text-xs">{order.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.items.length} {order.items.length === 1 ? 'produkt' : 'produktów'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.total.toFixed(2)} zł
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Zobacz szczegóły"
                          >
                            <Eye size={16} />
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {orders.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Brak zamówień
                </h3>
                <p className="text-gray-600">
                  Nie ma jeszcze żadnych zamówień w systemie
                </p>
              </div>
            )}
            </div>
          </div>
        )}

        {selectedTab === 'products' && <ProductsAdmin />}

        {selectedTab === 'users' && <UsersAdmin />}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
