import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useFormValidation } from '../hooks/useFormValidation';
import { checkoutStep1Schema, checkoutStep2Schema } from '../lib/validation';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArrowLeft, Check, Loader2, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { createOrder } from '../api/orders';
import { getSessionId } from '../utils/session';

const CheckoutPage = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const showToast = useToastStore((state) => state.showToast);
  const [step, setStep] = useState(1);

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Koszyk jest pusty</h2>
          <Link
            to="/cart"
            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors"
          >
            Wróć do koszyka
          </Link>
        </div>
      </div>
    );
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    name: user?.name || '',
    street: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
  });

  const total = getTotal();
  const shippingCost = total > 100 ? 0 : 15;
  const finalTotal = total + shippingCost;

  const step1Validation = useFormValidation(checkoutStep1Schema);
  const step2Validation = useFormValidation(checkoutStep2Schema);

  const handleStep1Next = () => {
    if (step1Validation.validate(formData)) {
      setStep(2);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (step === 1 && step1Validation.touched[field]) {
      step1Validation.validateField(field, value);
    }
    if (step === 2 && step2Validation.touched[field]) {
      step2Validation.validateField(field, value);
    }
  };

  const handleFieldBlur = (field: string) => {
    if (step === 1) {
      step1Validation.setFieldTouched(field);
      step1Validation.validateField(field, formData[field as keyof typeof formData]);
    }
    if (step === 2) {
      step2Validation.setFieldTouched(field);
      step2Validation.validateField(field, formData[field as keyof typeof formData]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!step2Validation.validate(formData)) {
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        weight: item.weight,
        quantity: item.quantity,
      }));

      const sessionId = getSessionId();

      await createOrder({
        items: orderItems,
        ...formData,
        sessionId: user ? undefined : sessionId,
        userId: user?.id,
      });

      clearCart();
      showToast('Zamówienie złożone pomyślnie!', 'success');
      setStep(3);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Zamówienie złożone!</h2>
          <p className="text-gray-600 mb-6">
            Dziękujemy za zakupy. Potwierdzenie zostało wysłane na adres email.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors"
          >
            Kontynuuj zakupy
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Sklep', path: '/products' },
            { label: 'Koszyk', path: '/cart' },
            { label: 'Kasa' },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {step === 1 ? 'Dane kontaktowe' : 'Adres dostawy'}
              </h2>

              {/* Progress indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex items-center gap-2 ${step >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
                      {step > 1 ? <Check size={16} /> : '1'}
                    </div>
                    <span className="text-sm font-medium">Kontakt</span>
                  </div>
                  <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-pink-600' : 'bg-gray-200'}`} />
                  <div className={`flex items-center gap-2 ${step >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
                      {step > 2 ? <Check size={16} /> : '2'}
                    </div>
                    <span className="text-sm font-medium">Dostawa</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="twoj@email.pl"
                        value={formData.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        onBlur={() => handleFieldBlur('email')}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          step1Validation.getFieldError('email')
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-pink-500'
                        }`}
                      />
                      {step1Validation.getFieldError('email') && (
                        <p className="mt-1 text-sm text-red-600">{step1Validation.getFieldError('email')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Smartphone size={16} />
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        placeholder="+48 123 456 789"
                        value={formData.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        onBlur={() => handleFieldBlur('phone')}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          step1Validation.getFieldError('phone')
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-pink-500'
                        }`}
                      />
                      {step1Validation.getFieldError('phone') && (
                        <p className="mt-1 text-sm text-red-600">{step1Validation.getFieldError('phone')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imię i nazwisko *
                      </label>
                      <input
                        type="text"
                        placeholder="Jan Kowalski"
                        value={formData.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        onBlur={() => handleFieldBlur('name')}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          step1Validation.getFieldError('name')
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-pink-500'
                        }`}
                      />
                      {step1Validation.getFieldError('name') && (
                        <p className="mt-1 text-sm text-red-600">{step1Validation.getFieldError('name')}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleStep1Next}
                      disabled={step1Validation.hasErrors}
                      className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Dalej
                      <ArrowLeft size={20} className="rotate-180" />
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Building2 size={16} />
                        Ulica i numer *
                      </label>
                      <input
                        type="text"
                        placeholder="ul. Przykładowa 123"
                        value={formData.street}
                        onChange={(e) => handleFieldChange('street', e.target.value)}
                        onBlur={() => handleFieldBlur('street')}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          step2Validation.getFieldError('street')
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-pink-500'
                        }`}
                      />
                      {step2Validation.getFieldError('street') && (
                        <p className="mt-1 text-sm text-red-600">{step2Validation.getFieldError('street')}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kod pocztowy *
                        </label>
                        <input
                          type="text"
                          placeholder="00-000"
                          value={formData.postalCode}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length > 2) {
                              value = value.slice(0, 2) + '-' + value.slice(2, 5);
                            }
                            handleFieldChange('postalCode', value);
                          }}
                          onBlur={() => handleFieldBlur('postalCode')}
                          maxLength={6}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                            step2Validation.getFieldError('postalCode')
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-pink-500'
                          }`}
                        />
                        {step2Validation.getFieldError('postalCode') && (
                          <p className="mt-1 text-sm text-red-600">{step2Validation.getFieldError('postalCode')}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Miasto *
                        </label>
                        <input
                          type="text"
                          placeholder="Warszawa"
                          value={formData.city}
                          onChange={(e) => handleFieldChange('city', e.target.value)}
                          onBlur={() => handleFieldBlur('city')}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                            step2Validation.getFieldError('city')
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-pink-500'
                          }`}
                        />
                        {step2Validation.getFieldError('city') && (
                          <p className="mt-1 text-sm text-red-600">{step2Validation.getFieldError('city')}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                        <CreditCard size={16} />
                        Sposób płatności *
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'card', label: 'Karta kredytowa', icon: '💳' },
                          { value: 'blik', label: 'BLIK', icon: '📱' },
                          { value: 'transfer', label: 'Przelew bankowy', icon: '🏦' },
                        ].map((method) => (
                          <label
                            key={method.value}
                            className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              formData.paymentMethod === method.value
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.value}
                              checked={formData.paymentMethod === method.value}
                              onChange={(e) => handleFieldChange('paymentMethod', e.target.value)}
                              className="w-4 h-4 text-pink-600"
                            />
                            <span className="text-xl">{method.icon}</span>
                            <span className="font-medium flex-1">{method.label}</span>
                          </label>
                        ))}
                      </div>
                      {step2Validation.getFieldError('paymentMethod') && (
                        <p className="mt-1 text-sm text-red-600">{step2Validation.getFieldError('paymentMethod')}</p>
                      )}
                    </div>
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        disabled={loading}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <ArrowLeft size={20} />
                        Wstecz
                      </button>
                      <button
                        type="submit"
                        disabled={loading || step2Validation.hasErrors}
                        className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Przetwarzanie...
                          </>
                        ) : (
                          <>
                            Zamów i zapłać
                            <CreditCard size={20} />
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Podsumowanie</h3>
              <div className="space-y-2 mb-4">
                {items.map((item) => {
                  const itemPrice =
                    (item.product.pricePer100g / 100) * item.weight * item.quantity;
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.namePl} ({item.weight}g × {item.quantity})
                      </span>
                      <span>{itemPrice.toFixed(2)} zł</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Produkty</span>
                  <span>{total.toFixed(2)} zł</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Dostawa</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Darmowa</span>
                    ) : (
                      `${shippingCost.toFixed(2)} zł`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Razem</span>
                  <span className="text-pink-600">{finalTotal.toFixed(2)} zł</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
