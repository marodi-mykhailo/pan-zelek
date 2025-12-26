import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const {
    items,
    removeItem,
    updateItemWeight,
    updateItemQuantity,
    clearCart,
    getTotal,
    getItemCount,
  } = useCartStore();
  const showToast = useToastStore((state) => state.showToast);

  const handleRemoveItem = (itemId: string, productName: string) => {
    removeItem(itemId);
    showToast(`${productName} usunięto z koszyka`, 'info');
  };

  const handleClearCart = () => {
    clearCart();
    showToast('Koszyk wyczyszczony', 'info');
  };

  const total = getTotal();
  const itemCount = getItemCount();
  const shippingCost = total > 100 ? 0 : 15; // Free shipping over 100 PLN
  const finalTotal = total + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Twój koszyk jest pusty</h2>
          <p className="text-gray-600 mb-6">Dodaj produkty do koszyka, aby kontynuować</p>
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-pink-600 text-white rounded-full font-bold hover:bg-pink-700 transition-colors"
          >
            Przejdź do sklepu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Wróć do sklepu
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Koszyk ({itemCount})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemPrice = (item.product.pricePer100g / 100) * item.weight * item.quantity;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                      {item.product.image || '🍬'}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {item.product.namePl}
                      </h3>

                      {/* Weight Selector */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-600">Waga:</span>
                        <div className="flex gap-1">
                          {[100, 200, 300, 500].map((weight) => (
                            <button
                              key={weight}
                              onClick={() => updateItemWeight(item.id, weight)}
                              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                item.weight === weight
                                  ? 'bg-pink-500 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {weight}g
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Ilość:</span>
                          <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-3 py-1 min-w-[3rem] text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-lg text-pink-600">
                            {itemPrice.toFixed(2)} zł
                          </div>
                          <div className="text-xs text-gray-500">
                            {(item.product.pricePer100g / 100 * item.weight).toFixed(2)} zł / szt
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id, item.product.namePl)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Usuń z koszyka"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Clear Cart Button */}
            <button
              onClick={handleClearCart}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              Wyczyść koszyk
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Podsumowanie</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Produkty ({itemCount})</span>
                  <span>{total.toFixed(2)} zł</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Dostawa</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-semibold">Darmowa</span>
                    ) : (
                      `${shippingCost.toFixed(2)} zł`
                    )}
                  </span>
                </div>
                {total < 100 && (
                  <div className="text-xs text-pink-600">
                    Dodaj jeszcze {(100 - total).toFixed(2)} zł dla darmowej dostawy!
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Razem</span>
                    <span className="text-pink-600">{finalTotal.toFixed(2)} zł</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
              >
                Przejdź do kasy
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
