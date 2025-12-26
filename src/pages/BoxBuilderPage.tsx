import { useState, useEffect } from 'react';
import { getProducts, Product } from '../api/products';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { saveBoxTemplate } from '../api/boxTemplates';
import { Plus, Minus, Trash2, Package, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BoxItem {
  productId: string;
  product: Product;
  weight: number;
}

const BoxBuilderPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [boxItems, setBoxItems] = useState<BoxItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedWeight, setSelectedWeight] = useState(100);
  const [totalWeight, setTotalWeight] = useState(0);
  const [boxName, setBoxName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const total = boxItems.reduce((sum, item) => sum + item.weight, 0);
    setTotalWeight(total);
  }, [boxItems]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToBox = () => {
    if (!selectedProduct) return;

    const existingIndex = boxItems.findIndex(
      (item) => item.productId === selectedProduct.id
    );

    if (existingIndex >= 0) {
      // Update existing item weight
      const updated = [...boxItems];
      updated[existingIndex].weight += selectedWeight;
      setBoxItems(updated);
    } else {
      // Add new item
      setBoxItems([
        ...boxItems,
        {
          productId: selectedProduct.id,
          product: selectedProduct,
          weight: selectedWeight,
        },
      ]);
    }

    setSelectedProduct(null);
    setSelectedWeight(100);
  };

  const handleRemoveFromBox = (productId: string) => {
    setBoxItems(boxItems.filter((item) => item.productId !== productId));
  };

  const handleUpdateWeight = (productId: string, newWeight: number) => {
    if (newWeight <= 0) {
      handleRemoveFromBox(productId);
      return;
    }
    setBoxItems(
      boxItems.map((item) =>
        item.productId === productId ? { ...item, weight: newWeight } : item
      )
    );
  };

  const calculateTotalPrice = () => {
    return boxItems.reduce((total, item) => {
      return total + (item.product.pricePer100g / 100) * item.weight;
    }, 0);
  };

  const handleAddToCart = () => {
    if (boxItems.length === 0) {
      showToast('Dodaj produkty do boxa', 'error');
      return;
    }
    boxItems.forEach((item) => {
      addItem(
        {
          id: item.product.id,
          namePl: item.product.namePl,
          image: item.product.image,
          pricePer100g: item.product.pricePer100g,
        },
        item.weight
      );
    });
    showToast(`BOX (${totalWeight}g) dodano do koszyka!`, 'success');
    // Clear box
    setBoxItems([]);
    setBoxName('');
  };

  const handleSaveTemplate = async () => {
    if (!isAuthenticated()) {
      showToast('Musisz być zalogowany, aby zapisać szablon', 'error');
      return;
    }

    if (!boxName.trim()) {
      showToast('Podaj nazwę boxa', 'error');
      return;
    }

    setSaving(true);
    try {
      await saveBoxTemplate(
        boxName,
        boxItems.map((item) => ({
          productId: item.productId,
          weight: item.weight,
        }))
      );
      showToast(`Box "${boxName}" zapisany pomyślnie!`, 'success');
      setBoxItems([]);
      setBoxName('');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Nie udało się zapisać boxa',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Wróć do strony głównej
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Stwórz własny BOX</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Wybierz produkty
              </h2>

              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedProduct?.id === product.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-200'
                    }`}
                  >
                    <div className="text-4xl mb-2">{product.image || '🍬'}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {product.namePl}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {product.pricePer100g} zł / 100g
                    </div>
                  </button>
                ))}
              </div>

              {/* Weight Selector */}
              {selectedProduct && (
                <div className="bg-pink-50 rounded-lg p-4">
                  <div className="mb-3">
                    <span className="font-medium text-gray-900">
                      Wybrano: {selectedProduct.namePl}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Waga:</span>
                    <div className="flex gap-2">
                      {[50, 100, 200, 300, 500].map((weight) => (
                        <button
                          key={weight}
                          onClick={() => setSelectedWeight(weight)}
                          className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            selectedWeight === weight
                              ? 'bg-pink-500 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {weight}g
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleAddToBox}
                      className="ml-auto px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Dodaj
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Box Preview */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Twój BOX ({totalWeight}g)
              </h2>

              {boxItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Twój BOX jest pusty
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Wybierz produkty z listy powyżej i dodaj je do swojego boxa
                  </p>
                  <p className="text-sm text-gray-500">
                    Możesz łączyć różne żelki w jednym boxie!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {boxItems.map((item) => {
                    const itemPrice =
                      (item.product.pricePer100g / 100) * item.weight;
                    return (
                      <div
                        key={item.productId}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="text-3xl">{item.product.image || '🍬'}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {item.product.namePl}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.product.pricePer100g} zł / 100g
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateWeight(item.productId, item.weight - 50)
                            }
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-16 text-center font-medium">
                            {item.weight}g
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateWeight(item.productId, item.weight + 50)
                            }
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-pink-600">
                            {itemPrice.toFixed(2)} zł
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromBox(item.productId)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Podsumowanie BOX
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Waga:</span>
                  <span className="font-medium">{totalWeight}g</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Produkty:</span>
                  <span className="font-medium">{boxItems.length}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Razem:</span>
                    <span className="text-pink-600">
                      {calculateTotalPrice().toFixed(2)} zł
                    </span>
                  </div>
                </div>
              </div>

              {boxItems.length > 0 && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nazwa boxa (opcjonalnie)
                    </label>
                    <input
                      type="text"
                      value={boxName}
                      onChange={(e) => setBoxName(e.target.value)}
                      placeholder="np. Mój idealny mix"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  {isAuthenticated() && boxName.trim() && (
                    <button
                      onClick={handleSaveTemplate}
                      disabled={saving}
                      className="w-full mb-3 px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Save size={20} />
                      {saving ? 'Zapisywanie...' : 'Zapisz szablon'}
                    </button>
                  )}

                  {!isAuthenticated() && (
                    <div className="mb-3 text-sm text-gray-600 text-center">
                      <Link to="/login" className="text-pink-600 hover:text-pink-700">
                        Zaloguj się
                      </Link>
                      {' '}aby zapisać szablon
                    </div>
                  )}

                  <button
                    onClick={handleAddToCart}
                    className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Package size={20} />
                    Dodaj BOX do koszyka
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxBuilderPage;
