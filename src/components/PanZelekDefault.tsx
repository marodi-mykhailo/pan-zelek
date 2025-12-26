import { CheckCircle, Facebook, Gift, Heart, Instagram, Menu, ShoppingCart, Star, Truck, X } from 'lucide-react';
import React, { useState } from 'react';

// Мок-дані для товарів (польською мовою та в злотих)
const products = [
  { id: 1, name: 'Kwaśne Robaczki', price: 9, weight: '100g', image: '🐛', color: 'bg-green-100', tag: 'Hit' },
  { id: 2, name: 'Misie Mix', price: 8, weight: '100g', image: '🐻', color: 'bg-yellow-100', tag: null },
  { id: 3, name: 'Cola Bottles', price: 9, weight: '100g', image: '🥤', color: 'bg-red-100', tag: 'Classic' },
  { id: 4, name: 'Jagodowy Wybuch', price: 10, weight: '100g', image: '🫐', color: 'bg-purple-100', tag: 'New' },
  { id: 5, name: 'Rekiny Blue', price: 9, weight: '100g', image: '🦈', color: 'bg-blue-100', tag: null },
  { id: 6, name: 'Kwaśna Tęcza', price: 8, weight: '100g', image: '🌈', color: 'bg-pink-100', tag: '-10%' },
];

const PanZelekDefault = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">

      {/* --- HEADER --- */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transform hover:scale-110 transition-transform">
                PŻ
              </div>
              <span className="font-bold text-2xl tracking-tight text-pink-600">
                Pan <span className="text-yellow-500">Żelek</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 font-medium text-gray-600">
              <a href="#" className="hover:text-pink-500 transition-colors">Strona Główna</a>
              <a href="#shop" className="hover:text-pink-500 transition-colors">Sklep</a>
              <a href="#box" className="hover:text-pink-500 transition-colors">Nasze Pudełko</a>
              <a href="#reviews" className="hover:text-pink-500 transition-colors">Opinie</a>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button className="text-gray-500 hover:text-pink-500 transition-colors">
                <Heart size={24} />
              </button>
              <button className="relative text-gray-500 hover:text-pink-500 transition-colors group">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-500"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4">
            <a href="#" className="block text-gray-700 hover:text-pink-500 font-medium">Strona Główna</a>
            <a href="#shop" className="block text-gray-700 hover:text-pink-500 font-medium">Sklep</a>
            <a href="#box" className="block text-gray-700 hover:text-pink-500 font-medium">Nasze Pudełko</a>
            <a href="#contact" className="block text-gray-700 hover:text-pink-500 font-medium">Kontakt</a>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative overflow-hidden bg-gradient-to-r from-pink-50 to-yellow-50 pt-16 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center">

          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-100 text-pink-600 font-semibold text-sm mb-4">
              🍬 Najsłodszy sklep w sieci
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Twój ulubiony <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
                Żelkowy Raj
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto md:mx-0">
              Tworzymy boksy, od których serce rośnie! 😍 Stwórz własny mix lub wybierz gotowy zestaw na prezent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="px-8 py-4 bg-pink-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-pink-700 hover:scale-105 transition-all">
                Do sklepu
              </button>
              <button className="px-8 py-4 bg-white text-pink-600 border-2 border-pink-100 rounded-full font-bold text-lg hover:bg-pink-50 transition-all">
                Stwórz MIX
              </button>
            </div>
          </div>

          <div className="md:w-1/2 relative">
             {/* Abstract blobs for background */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>

            {/* Hero Image Placeholder */}
            <div className="relative z-10 transform md:rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-white">
                   <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 to-yellow-100 rounded-2xl flex items-center justify-center text-8xl">
                     🍭🍬🐻
                   </div>
                   <div className="mt-4 text-center font-bold text-gray-400">Tu będzie zdjęcie waszego top boxa</div>
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- FEATURES --- */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Szybka dostawa</h3>
              <p className="text-gray-500 text-sm">Wysyłka w 24h</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow">
            <div className="p-3 bg-pink-100 text-pink-600 rounded-full">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">100% Świeżości</h3>
              <p className="text-gray-500 text-sm">Tylko najświeższe żelki</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
              <Gift size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Idealne na Prezent</h3>
              <p className="text-gray-500 text-sm">Zapakujemy jak dla siebie</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CATALOG GRID --- */}
      <section id="shop" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nasze Hity 🔥</h2>
            <p className="text-gray-600">Wybierz to, co kochasz, lub zmiksuj wszystko razem</p>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {['Wszystkie', 'Kwaśne', 'Słodkie', 'Lukrecja', 'Mixy', 'Box'].map((filter) => (
                <button key={filter} className="px-6 py-2 rounded-full border border-gray-200 bg-white hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-colors font-medium">
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group relative">

                {/* Tag */}
                {product.tag && (
                  <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full z-10
                    ${product.tag === 'Hit' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    {product.tag}
                  </span>
                )}

                {/* Image Container */}
                <div className={`aspect-square ${product.color} rounded-xl mb-4 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300`}>
                  {product.image}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{product.weight}</p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-pink-600">{product.price} zł</span>
                    <button
                      onClick={addToCart}
                      className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-full font-bold hover:bg-gray-900 hover:text-white transition-colors">
              Pokaż więcej pyszności
            </button>
          </div>
        </div>
      </section>

      {/* --- THE BOX SECTION (USER'S BOX) --- */}
      <section id="box" className="py-20 bg-gradient-to-b from-purple-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
             <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500 rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">

            <div className="md:w-1/2 order-2 md:order-1">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Pudełko pełne emocji 🎁</h2>
                <p className="text-indigo-200 text-lg mb-6 leading-relaxed">
                  Długo pracowaliśmy nad designem, abyś otrzymał nie tylko żelki, ale prawdziwy prezent.
                  Nasze firmowe pudełko "Pan Żelek" zostało stworzone, aby zachwycać jeszcze przed otwarciem.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Star className="text-yellow-400" />
                    <span>Ekologiczne materiały</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="text-yellow-400" />
                    <span>Design, który aż prosi się o zdjęcie na Insta</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="text-yellow-400" />
                    <span>Idealne na prezent (również dla siebie)</span>
                  </li>
                </ul>
                <button className="w-full sm:w-auto px-8 py-4 bg-yellow-400 text-indigo-900 font-bold rounded-full hover:bg-yellow-300 transition-colors">
                  Zamów BOX
                </button>
              </div>
            </div>

            <div className="md:w-1/2 order-1 md:order-2 flex justify-center">
              {/* Box Placeholder - Here we would use the user's uploaded image */}
              <div className="relative w-80 h-80 bg-gray-200 rounded-xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 flex items-center justify-center overflow-hidden border-8 border-white/10">
                 <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-indigo-500 opacity-80"></div>
                 <span className="relative z-10 text-white font-bold text-center px-4">
                    [TU BĘDZIE ZDJĘCIE WASZEGO PUDEŁKA] <br/>
                    <span className="text-sm font-normal opacity-75">Wstaw image_cb21c8.jpg tutaj</span>
                 </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">PŻ</div>
                  <span className="font-bold text-xl">Pan Żelek</span>
                </div>
                <p className="text-gray-500 text-sm">
                  Najsmaczniejszy sklep z żelkami w Twoim telefonie. Dajemy radość z każdym misiem.
                </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Dla Klienta</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-pink-500">Dostawa i płatność</a></li>
                <li><a href="#" className="hover:text-pink-500">Regulamin</a></li>
                <li><a href="#" className="hover:text-pink-500">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Kontakt</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>+48 123 456 789</li>
                <li>hello@panzelek.pl</li>
                <li>Warszawa, ul. Słodka 1</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Obserwuj nas</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pink-500 hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 text-center text-gray-400 text-sm">
            © 2024 Pan Żelek. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PanZelekDefault;
