import { useState, useEffect } from 'react';
import { getProducts, Product, createProduct, updateProduct, deleteProduct } from '../../api/products';
import { useToastStore } from '../../store/toastStore';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const ProductsAdmin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      showToast('Nie udało się załadować produktów', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.namePl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten produkt?')) return;

    try {
      await deleteProduct(id);
      showToast('Produkt usunięty', 'success');
      loadProducts();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Nie udało się usunąć produktu',
        'error'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Produkty</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Dodaj produkt
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj produktów..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produkt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cena / 100g</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{product.image || '🍬'}</div>
                      <div>
                        <div className="font-medium text-gray-900">{product.namePl}</div>
                        <div className="text-sm text-gray-500">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product.pricePer100g} zł
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.inStock ? 'W magazynie' : 'Brak'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edytuj"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Usuń"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'Nie znaleziono produktów' : 'Brak produktów'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Spróbuj zmienić kryteria wyszukiwania'
                : 'Dodaj pierwszy produkt, aby rozpocząć'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors"
              >
                Dodaj pierwszy produkt
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            loadProducts();
            setShowAddModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}

const ProductModal = ({ product, onClose, onSave }: ProductModalProps) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    namePl: product?.namePl || '',
    description: product?.description || '',
    descriptionPl: product?.descriptionPl || '',
    category: product?.category || 'sweet',
    pricePer100g: product?.pricePer100g || 0,
    inStock: product?.inStock ?? true,
    stockWeight: product?.stockWeight || 0,
    image: product?.image || '',
  });
  const [saving, setSaving] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (product) {
        await updateProduct(product.id, formData);
        showToast('Produkt zaktualizowany', 'success');
      } else {
        await createProduct(formData);
        showToast('Produkt dodany', 'success');
      }
      onSave();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Nie udało się zapisać produktu',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {product ? 'Edytuj produkt' : 'Dodaj produkt'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nazwa (EN) *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nazwa (PL) *
              </label>
              <input
                type="text"
                required
                value={formData.namePl}
                onChange={(e) => setFormData({ ...formData, namePl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategoria *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="sweet">Sweet</option>
              <option value="sour">Sour</option>
              <option value="classic">Classic</option>
              <option value="fruit">Fruit</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cena / 100g (zł) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.pricePer100g}
                onChange={(e) => setFormData({ ...formData, pricePer100g: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waga w magazynie (g)
              </label>
              <input
                type="number"
                min="0"
                value={formData.stockWeight}
                onChange={(e) => setFormData({ ...formData, stockWeight: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4 text-pink-600"
              />
              <span className="text-sm font-medium text-gray-700">W magazynie</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emoji / Ikona
            </label>
            <input
              type="text"
              placeholder="🍬"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                'Zapisz'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductsAdmin;
