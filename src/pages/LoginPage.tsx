import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useFormValidation } from '../hooks/useFormValidation';
import { loginSchema, registerSchema } from '../lib/validation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  const setAuth = useAuthStore((state) => state.setAuth);
  const showToast = useToastStore((state) => state.showToast);
  const navigate = useNavigate();

  const validation = useFormValidation(isLogin ? loginSchema : registerSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    validation.clearErrors();

    // Validate form
    if (!validation.validate(formData)) {
      return;
    }

    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await login({
          email: formData.email,
          password: formData.password,
        });
        setAuth(response.user, response.token);
        showToast('Zalogowano pomyślnie!', 'success');
      } else {
        response = await register({
          email: formData.email,
          password: formData.password,
          name: formData.name || undefined,
          phone: formData.phone || undefined,
        });
        setAuth(response.user, response.token);
        showToast('Konto utworzone pomyślnie!', 'success');
      }

      // Redirect based on user role
      if (response.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to authenticate';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (validation.touched[field]) {
      validation.validateField(field, value);
    }
  };

  const handleFieldBlur = (field: string) => {
    validation.setFieldTouched(field);
    validation.validateField(field, formData[field as keyof typeof formData]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-pink-100">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-yellow-400 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-4">
            PŻ
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Witaj ponownie!' : 'Załóż konto'}
          </h2>
          <p className="text-gray-600">
            {isLogin
              ? 'Zaloguj się, aby kontynuować zakupy'
              : 'Stwórz konto, aby rozpocząć zakupy'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imię i nazwisko
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onBlur={() => handleFieldBlur('name')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    validation.getFieldError('name')
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-pink-500'
                  }`}
                />
                {validation.getFieldError('name') && (
                  <p className="mt-1 text-sm text-red-600">{validation.getFieldError('name')}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  placeholder="+48 123 456 789"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  onBlur={() => handleFieldBlur('phone')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    validation.getFieldError('phone')
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-pink-500'
                  }`}
                />
                {validation.getFieldError('phone') && (
                  <p className="mt-1 text-sm text-red-600">{validation.getFieldError('phone')}</p>
                )}
              </div>
            </>
          )}

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
                validation.getFieldError('email')
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-pink-500'
              }`}
            />
            {validation.getFieldError('email') && (
              <p className="mt-1 text-sm text-red-600">{validation.getFieldError('email')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hasło *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={isLogin ? 'Wprowadź hasło' : 'Minimum 6 znaków'}
                value={formData.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                onBlur={() => handleFieldBlur('password')}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  validation.getFieldError('password')
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-pink-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {validation.getFieldError('password') && (
              <p className="mt-1 text-sm text-red-600">{validation.getFieldError('password')}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || validation.hasErrors}
            className="group relative w-full px-6 py-3.5 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-xl font-bold hover:from-pink-700 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0"></div>
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin relative z-10" />
                <span className="relative z-10">Przetwarzanie...</span>
              </>
            ) : (
              <span className="relative z-10">{isLogin ? 'Zaloguj się' : 'Załóż konto'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              validation.clearErrors();
              setFormData({ email: '', password: '', name: '', phone: '' });
            }}
            className="w-full text-center text-pink-600 hover:text-pink-700 font-semibold transition-colors py-2 rounded-lg hover:bg-pink-50"
          >
            {isLogin
              ? 'Nie masz konta? Załóż je tutaj'
              : 'Masz już konto? Zaloguj się'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm transition-colors font-medium"
          >
            ← Wróć do strony głównej
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
