import { ArrowRight, Facebook, Instagram, Menu, Search, ShoppingBag, X } from 'lucide-react';
import React, { useState } from 'react';

// Мок-дані (Premium версія)
const products = [
  { id: 1, name: 'Sour Worms', price: 9, weight: '100g', image: '🐛', category: 'Sour Collection' },
  { id: 2, name: 'Golden Bears', price: 12, weight: '100g', image: '🐻', category: 'Signature' },
  { id: 3, name: 'Cola Vintage', price: 9, weight: '100g', image: '🥤', category: 'Classic' },
  { id: 4, name: 'Forest Berry', price: 10, weight: '100g', image: '🫐', category: 'Fruit Edition' },
  { id: 5, name: 'Ocean Sharks', price: 9, weight: '100g', image: '🦈', category: 'Limited' },
  { id: 6, name: 'Rainbow Belt', price: 8, weight: '100g', image: '🎗️', category: 'Sour Collection' },
];

const PanZelekPremium = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white">

      {/* --- HEADER --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center h-20">

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 -ml-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Menu (Left) */}
            <div className="hidden md:flex space-x-8 text-xs font-bold tracking-[0.2em] uppercase">
              <a href="#" className="hover:text-gray-500 transition-colors">Kolekcje</a>
              <a href="#shop" className="hover:text-gray-500 transition-colors">Sklep</a>
            </div>

            {/* Logo (Centered) */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <span className="font-bold text-2xl tracking-widest uppercase font-serif">Pan Żelek</span>
              <span className="text-[0.6rem] text-gray-400 tracking-[0.3em] uppercase mt-1">Est. 2024</span>
            </div>

            {/* Icons (Right) */}
            <div className="flex items-center gap-6">
              <button className="hidden md:block hover:text-gray-500 transition-colors">
                <Search size={20} strokeWidth={1} />
              </button>
              <button className="relative hover:text-gray-500 transition-colors group" onClick={addToCart}>
                <ShoppingBag size={20} strokeWidth={1} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-medium w-3.5 h-3.5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-8 flex flex-col items-center space-y-6 text-sm font-bold tracking-widest uppercase animate-in slide-in-from-top-5">
            <a href="#" className="hover:text-gray-500">Kolekcje</a>
            <a href="#shop" className="hover:text-gray-500">Sklep</a>
            <a href="#box" className="hover:text-gray-500">Gift Box</a>
            <a href="#" className="hover:text-gray-500">O Marce</a>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

          <div className="md:col-span-5 md:order-last relative">
            {/* Minimalist Image Placeholder */}
            <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center text-gray-200 text-9xl">
                  🐻
               </div>
               {/* Subtle overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent"></div>
            </div>
            {/* Floating label */}
            <div className="absolute bottom-8 -left-8 bg-white px-6 py-4 shadow-xl hidden md:block">
               <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Bestseller</p>
               <p className="font-serif text-lg">Golden Bears Edition</p>
            </div>
          </div>

          <div className="md:col-span-7">
            <h1 className="text-5xl md:text-8xl font-medium tracking-tight text-black mb-8 leading-[0.9]">
              Smak <br/>
              <span className="font-serif italic text-gray-400">Absolutny.</span>
            </h1>

            <p className="text-lg text-gray-600 mb-12 max-w-md font-light leading-relaxed">
              Odkryj nową definicję słodyczy. Wyselekcjonowane składniki, unikalne receptury i design, który zachwyca.
            </p>

            <div className="flex gap-6">
              <button className="px-10 py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors">
                Kup Teraz
              </button>
              <button className="px-10 py-4 border border-gray-200 text-black text-xs font-bold uppercase tracking-[0.2em] hover:border-black transition-colors">
                Zobacz Boxy
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* --- DIVIDER --- */}
      <div className="w-full border-t border-gray-100"></div>

      {/* --- PHILOSOPHY (Minimal Text) --- */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-6">Filozofia</span>
          <p className="text-2xl md:text-4xl font-light leading-snug text-gray-800 font-serif">
            "Wierzymy, że żelki to nie tylko słodycze. To małe dzieła sztuki, które powinny smakować tak samo dobrze, jak wyglądają."
          </p>
        </div>
      </section>

      {/* --- CATALOG GRID --- */}
      <section id="shop" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-3xl font-medium tracking-tight">Kolekcja</h2>
            <a href="#" className="text-xs font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors hidden md:block">
              Wszystkie produkty
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-white mb-6 relative overflow-hidden transition-all duration-500 group-hover:shadow-2xl">
                   {/* Product Image Placeholder */}
                   <div className="absolute inset-0 flex items-center justify-center text-8xl bg-gray-100/30 group-hover:scale-105 transition-transform duration-700">
                      {product.image}
                   </div>

                   {/* Quick Add Button (appears on hover) */}
                   <button
                      onClick={(e) => { e.stopPropagation(); addToCart(); }}
                      className="absolute bottom-0 left-0 w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                   >
                      Do Koszyka — {product.price} zł
                   </button>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  </div>
                  <span className="text-lg font-medium">{product.price} zł</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center md:hidden">
             <button className="text-xs font-bold uppercase tracking-[0.2em] border-b border-black pb-1">
              Wszystkie produkty
            </button>
          </div>
        </div>
      </section>

      {/* --- THE BOX SECTION (Premium Presentation) --- */}
      <section id="box" className="py-32 px-6 bg-white text-black relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
             <div className="aspect-square bg-gray-100 relative z-10 p-12">
                <div className="w-full h-full border border-gray-300 p-8 flex items-center justify-center bg-white shadow-sm">
                    <div className="text-center">
                        <span className="text-gray-300 text-6xl block mb-4">🎁</span>
                        <span className="text-xs text-gray-400 font-mono">[image_cb21c8.jpg]</span>
                        <p className="mt-4 font-serif italic text-gray-500">Premium Packaging</p>
                    </div>
                </div>
             </div>
             {/* Decorative element */}
             <div className="absolute -top-12 -left-12 w-64 h-64 border border-gray-100 -z-0 hidden lg:block"></div>
          </div>

          {/* Text Side */}
          <div className="order-1 lg:order-2 lg:pl-12">
             <h2 className="text-4xl md:text-6xl font-serif italic mb-6">The Gift Box.</h2>
             <div className="w-12 h-0.5 bg-black mb-8"></div>

             <p className="text-gray-600 font-light leading-relaxed mb-8 text-lg">
               Minimalizm w każdym detalu. Nasze pudełko zostało stworzone, by robić wrażenie bez zbędnych słów.
               Idealna geometria, matowe wykończenie i wnętrze pełne smaku.
             </p>

             <ul className="space-y-4 mb-12">
               <li className="flex items-center gap-4 text-sm font-medium tracking-wide">
                 <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                 Ekskluzywny Design
               </li>
               <li className="flex items-center gap-4 text-sm font-medium tracking-wide">
                 <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                 Personalizowany List
               </li>
               <li className="flex items-center gap-4 text-sm font-medium tracking-wide">
                 <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                 Satynowe Wstążki
               </li>
             </ul>

             <button className="flex items-center gap-4 group">
               <span className="text-xs font-bold uppercase tracking-[0.2em] group-hover:mr-2 transition-all">Skonfiguruj Box</span>
               <ArrowRight size={16} />
             </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER (Minimal) --- */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">

          <div className="mb-12 text-center">
             <span className="font-bold text-3xl tracking-widest uppercase font-serif block mb-2">Pan Żelek</span>
             <span className="text-[10px] tracking-[0.4em] text-gray-400 uppercase">Warsaw / Poland</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16 text-xs font-bold uppercase tracking-[0.15em]">
            <a href="#" className="hover:text-gray-500 transition-colors">Sklep</a>
            <a href="#" className="hover:text-gray-500 transition-colors">O Nas</a>
            <a href="#" className="hover:text-gray-500 transition-colors">Kontakt</a>
            <a href="#" className="hover:text-gray-500 transition-colors">Wysyłka</a>
            <a href="#" className="hover:text-gray-500 transition-colors">FAQ</a>
          </div>

          <div className="flex gap-8 mb-12 text-gray-400">
             <a href="#" className="hover:text-black transition-colors"><Instagram size={20} /></a>
             <a href="#" className="hover:text-black transition-colors"><Facebook size={20} /></a>
          </div>

          <div className="text-gray-300 text-[10px] tracking-widest text-center">
            &copy; 2024 PAN ŻELEK GROUP. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PanZelekPremium;
