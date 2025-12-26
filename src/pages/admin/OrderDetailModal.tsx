import { Order } from '../../api/admin';
import { X, MapPin, User, Package, Calendar } from 'lucide-react';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

const OrderDetailModal = ({ order, onClose }: OrderDetailModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Szczegóły zamówienia #{order.id.slice(0, 8)}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User size={18} />
                Informacje o kliencie
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{order.email}</span>
                </div>
                {order.phone && (
                  <div>
                    <span className="text-gray-600">Telefon:</span>
                    <span className="ml-2 font-medium">{order.phone}</span>
                  </div>
                )}
                {order.user?.name && (
                  <div>
                    <span className="text-gray-600">Imię:</span>
                    <span className="ml-2 font-medium">{order.user.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin size={18} />
                Adres dostawy
              </h4>
              <div className="text-sm space-y-1">
                <div className="font-medium">{order.shippingAddress.street}</div>
                <div>
                  {order.shippingAddress.postalCode} {order.shippingAddress.city}
                </div>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar size={18} />
              Informacje o zamówieniu
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium">{order.status}</span>
              </div>
              <div>
                <span className="text-gray-600">Płatność:</span>
                <span className="ml-2 font-medium">{order.paymentStatus}</span>
              </div>
              <div>
                <span className="text-gray-600">Data:</span>
                <span className="ml-2 font-medium">
                  {new Date(order.createdAt).toLocaleString('pl-PL')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Dostawa:</span>
                <span className="ml-2 font-medium">{order.shippingCost.toFixed(2)} zł</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Package size={18} />
              Produkty ({order.items.length})
            </h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.product.namePl}</div>
                    <div className="text-sm text-gray-600">
                      {item.weight}g × {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{item.price.toFixed(2)} zł</div>
                    <div className="text-sm text-gray-600">
                      {(item.price / (item.weight * item.quantity) * 100).toFixed(2)} zł / 100g
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Razem:</span>
              <span className="text-2xl font-bold text-pink-600">{order.total.toFixed(2)} zł</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
