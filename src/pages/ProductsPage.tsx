import { useState, useEffect } from 'react';
import { getProducts, Product } from '../api/products';
import { ShoppingCart, AlertCircle, ArrowLeft, Search } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'sour', 'sweet', 'classic', 'fruit'];

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {};
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }
      if (searchQuery) {
        filters.search = searchQuery;
      }

      const data = await getProducts(filters);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.showToast);
  const [selectedWeight, setSelectedWeight] = useState<{ [key: string]: number }>({});

  const handleAddToCart = (product: Product) => {
    const weight = selectedWeight[product.id] || 100; // Default 100g
    addItem(
      {
        id: product.id,
        namePl: product.namePl,
        image: product.image,
        pricePer100g: product.pricePer100g,
      },
      weight
    );
    showToast(`${product.namePl} (${weight}g) dodano do koszyka!`, 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-gray-600 font-medium">Ładowanie produktów...</p>
          <p className="mt-2 text-sm text-gray-500">Proszę czekać</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Błąd ładowania</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors"
          >
            Spróbuj ponownie
          </button>
        </div>
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

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nasze Hity 🔥
          </h2>
          <p className="text-gray-600">Wybierz to, co kochasz, lub zmiksuj wszystko razem</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Szukaj produktów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full border transition-colors font-medium ${
                  selectedCategory === category
                    ? 'bg-pink-500 text-white border-pink-500'
                    : 'border-gray-200 bg-white hover:bg-pink-50 hover:border-pink-200'
                }`}
              >
                {category === 'all' ? 'Wszystkie' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group relative"
            >
              {/* Image Container */}
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-yellow-100 rounded-xl mb-4 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                {product.image || '🍬'}
              </div>

              {/* Info */}
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 line-clamp-1">
                  {product.namePl}
                </h3>
                <p className="text-sm text-gray-500">
                  {product.category}
                </p>

                <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                  {/* Weight Selector */}
                  <div className="flex gap-1 flex-wrap">
                    {[100, 200, 300, 500].map((weight) => (
                      <button
                        key={weight}
                        onClick={() => setSelectedWeight({ ...selectedWeight, [product.id]: weight })}
                        className={`px-2 py-1 text-xs rounded-md transition-colors ${
                          selectedWeight[product.id] === weight
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {weight}g
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-pink-600">
                        {product.pricePer100g} zł / 100g
                      </span>
                      {selectedWeight[product.id] && (
                        <div className="text-xs text-gray-500">
                          {(product.pricePer100g / 100 * selectedWeight[product.id]).toFixed(2)} zł
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      disabled={!product.inStock}
                      title={product.inStock ? 'Dodaj do koszyka' : 'Brak w magazynie'}
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>

                {!product.inStock && (
                  <p className="text-xs text-red-500 text-center">Brak w magazynie</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nie znaleziono produktów
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery || selectedCategory !== 'all'
                ? 'Spróbuj zmienić kryteria wyszukiwania lub filtry'
                : 'Brak dostępnych produktów w tej kategorii'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors"
              >
                Wyczyść filtry
              </button>
            )}
            {!searchQuery && selectedCategory === 'all' && (
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors"
              >
                Wróć do strony głównej
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
