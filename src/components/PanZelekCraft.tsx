import { Check, Facebook, Heart, Instagram, Menu, Package, Scroll, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';

// Мок-дані (Крафтова версія)
const products = [
  { id: 1, name: 'Naturalne Robaczki', price: 9, weight: '100g', image: '🐛', tag: 'Bestseller' },
  { id: 2, name: 'Misie Tradycyjne', price: 8, weight: '100g', image: '🐻', tag: null },
  { id: 3, name: 'Cola Retro', price: 9, weight: '100g', image: '🥤', tag: 'Klasyk' },
  { id: 4, name: 'Leśne Jagody', price: 10, weight: '100g', image: '🫐', tag: 'Nowość' },
  { id: 5, name: 'Rekiny Morskie', price: 9, weight: '100g', image: '🦈', tag: null },
  { id: 6, name: 'Kwaśne Paski', price: 8, weight: '100g', image: '🎗️', tag: '-10%' },
];

const PanZelekCraft = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    // Використовуємо теплий фон "під папір" (stone-50) та кольори землі/дерева (amber/stone)
    <div className="min-h-screen bg-[#fcfaf7] font-serif text-stone-800 selection:bg-amber-200 selection:text-amber-900">

      {/* --- HEADER --- */}
      <nav className="sticky top-0 z-50 bg-[#fcfaf7]/95 backdrop-blur-sm border-b-2 border-dashed border-amber-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-800 text-amber-50 rounded-lg flex items-center justify-center font-serif text-2xl font-bold border-2 border-amber-900 shadow-[2px_2px_0px_0px_rgba(120,53,15,0.3)]">
                PŻ
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl tracking-tight text-amber-900 leading-none">
                  Pan Żelek
                </span>
                <span className="text-xs text-amber-700 tracking-widest uppercase mt-1 font-sans">
                  Manufaktura Słodyczy
                </span>
              </div>
            </div>

            {/* Desktop Menu - Sans-serif for readability */}
            <div className="hidden md:flex space-x-8 font-sans font-medium text-stone-600 text-sm tracking-wide uppercase">
              <a href="#" className="hover:text-amber-700 transition-colors border-b-2 border-transparent hover:border-amber-400 pb-1">O nas</a>
              <a href="#shop" className="hover:text-amber-700 transition-colors border-b-2 border-transparent hover:border-amber-400 pb-1">Sklepik</a>
              <a href="#box" className="hover:text-amber-700 transition-colors border-b-2 border-transparent hover:border-amber-400 pb-1">Pakowanie</a>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-5">
              <button className="text-stone-500 hover:text-amber-700 transition-colors">
                <Heart size={24} strokeWidth={1.5} />
              </button>
              <button className="relative text-stone-500 hover:text-amber-700 transition-colors group">
                <ShoppingCart size={24} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-700 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                className="md:hidden text-stone-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#fcfaf7] border-t-2 border-dashed border-amber-200 p-6 space-y-4 font-sans text-center">
            <a href="#" className="block text-stone-800 font-bold hover:text-amber-700">O NAS</a>
            <a href="#shop" className="block text-stone-800 font-bold hover:text-amber-700">SKLEPIK</a>
            <a href="#box" className="block text-stone-800 font-bold hover:text-amber-700">PAKOWANIE</a>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-16 pb-24 overflow-hidden">
        {/* Paper texture overlay simulation */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#a8a29e_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">

          <div className="md:w-1/2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-amber-200 bg-amber-50 rounded text-amber-800 text-xs font-sans tracking-wider uppercase">
              <Scroll size={14} />
              <span>Polska Jakość od 2024</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-amber-950 mb-6 leading-tight">
              Słodkości <br/>
              <span className="italic font-light text-amber-700">z duszą.</span>
            </h1>

            <p className="text-lg text-stone-600 mb-8 max-w-md mx-auto md:mx-0 font-sans leading-relaxed">
              Nie jesteśmy fabryką. Jesteśmy Pan Żelek. Pakujemy każdą paczkę ręcznie, dbając o to, byś poczuł się wyjątkowo otwierając nasze pudełko.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start font-sans">
              <button className="px-8 py-4 bg-amber-800 text-white rounded font-medium shadow-md hover:bg-amber-900 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                <span>Zobacz Ofertę</span>
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-stone-300 text-stone-700 rounded font-medium hover:border-amber-800 hover:text-amber-800 transition-colors">
                Skomponuj Zestaw
              </button>
            </div>
          </div>

          <div className="md:w-1/2 relative flex justify-center">
             {/* Frame Effect */}
            <div className="relative p-4 bg-white shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500 border border-stone-100 max-w-sm w-full">
                {/* Tape effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-amber-100/80 backdrop-blur-sm rotate-1 shadow-sm border-l border-r border-white/50"></div>

                <div className="aspect-[4/5] bg-stone-100 relative overflow-hidden flex flex-col items-center justify-center border border-stone-200">
                   <div className="text-8xl mb-4 opacity-80">🐻</div>
                   <p className="font-serif text-2xl text-stone-400 italic">Zdjęcie Boxa</p>
                </div>

                <div className="mt-4 text-center font-handwriting">
                   <p className="font-serif italic text-stone-500">Nasz bestsellerowy zestaw</p>
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- VALUES / STAMPS --- */}
      <section className="py-12 bg-amber-50 border-y border-dashed border-amber-200">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 border-2 border-stone-200 rounded-lg bg-white/50">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 mb-4">
              <Package size={32} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif font-bold text-xl text-amber-900 mb-2">Bezpieczna Paczka</h3>
            <p className="font-sans text-sm text-stone-600">Solidny karton, ekologiczne wypełnienie.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 border-2 border-stone-200 rounded-lg bg-white/50">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 mb-4">
              <Check size={32} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif font-bold text-xl text-amber-900 mb-2">Świeży Produkt</h3>
            <p className="font-sans text-sm text-stone-600">Długa data ważności, miękkie żelki.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 border-2 border-stone-200 rounded-lg bg-white/50">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 mb-4">
              <Heart size={32} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif font-bold text-xl text-amber-900 mb-2">Robione z Sercem</h3>
            <p className="font-sans text-sm text-stone-600">Mała rodzinna firma, wielka pasja.</p>
          </div>
        </div>
      </section>

      {/* --- SHOP SHELF --- */}
      <section id="shop" className="py-20 bg-[#fcfaf7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-amber-600 text-sm tracking-widest uppercase font-bold">Nasza Witryna</span>
            <h2 className="text-4xl font-serif font-bold text-stone-800 mt-2 mb-6">Wybierz coś pysznego</h2>
            <div className="w-24 h-1 bg-amber-800 mx-auto rounded-full opacity-20"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products.map((product) => (
              <div key={product.id} className="group bg-white p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] hover:shadow-xl transition-all duration-300 border border-stone-100 hover:border-amber-200 rounded-sm relative">

                {/* Sticker / Tag */}
                {product.tag && (
                  <div className="absolute -top-3 -right-3 bg-amber-800 text-white text-xs font-sans font-bold px-3 py-1 shadow-md rotate-3 z-10">
                    {product.tag}
                  </div>
                )}

                {/* Image Area */}
                <div className="aspect-square bg-stone-50 mb-6 flex items-center justify-center text-7xl relative overflow-hidden border border-stone-100">
                  <div className="absolute inset-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:12px_12px] opacity-30"></div>
                  <span className="group-hover:scale-110 transition-transform duration-500 drop-shadow-md">{product.image}</span>
                </div>

                {/* Details */}
                <div className="text-center">
                  <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">{product.name}</h3>
                  <div className="flex justify-center items-baseline gap-2 mb-4 font-sans">
                    <span className="text-sm text-stone-400 font-medium">{product.weight}</span>
                    <span className="text-amber-800 text-lg font-bold">{product.price} zł</span>
                  </div>

                  <button
                    onClick={addToCart}
                    className="w-full py-3 border border-stone-300 text-stone-600 font-sans text-sm font-bold uppercase tracking-wide hover:bg-amber-800 hover:text-white hover:border-amber-800 transition-colors"
                  >
                    Dodaj do koszyka
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
             <a href="#" className="inline-block border-b-2 border-stone-800 pb-1 text-stone-800 font-serif italic text-lg hover:text-amber-700 hover:border-amber-700 transition-colors">
               Zobacz cały asortyment &rarr;
             </a>
          </div>
        </div>
      </section>

      {/* --- THE BOX SECTION (Craft Style) --- */}
      <section id="box" className="py-24 bg-stone-100 border-t border-stone-200 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="bg-white p-8 md:p-12 shadow-2xl border border-stone-200 relative">
            {/* Background pattern inside the card */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] opacity-40 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
               <div className="md:w-1/2">
                 <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-sans font-bold uppercase tracking-wide mb-4 rounded-full">
                    Eco Friendly
                 </div>
                 <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 mb-6">
                   To nie jest zwykłe pudełko.
                 </h2>
                 <p className="text-stone-600 font-sans leading-relaxed mb-6">
                   Nasze opakowanie "Pan Żelek" (widoczne na zdjęciu) zostało zaprojektowane tak, by cieszyć oko i dbać o planetę.
                   Sztywny karton, minimalistyczny nadruk i ta radość przy rozpakowywaniu...
                 </p>
                 <ul className="space-y-3 font-sans text-stone-700 mb-8">
                   <li className="flex items-center gap-2">
                     <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center text-amber-800"><Check size={12} /></div>
                     <span>Idealne na prezent (nie trzeba pakować)</span>
                   </li>
                   <li className="flex items-center gap-2">
                     <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center text-amber-800"><Check size={12} /></div>
                     <span>Wytrzymała konstrukcja</span>
                   </li>
                 </ul>
                 <button className="px-8 py-3 bg-stone-800 text-white font-sans font-bold uppercase tracking-widest hover:bg-stone-700 transition-colors">
                   Chcę taki Box
                 </button>
               </div>

               <div className="md:w-1/2 w-full flex justify-center">
                  <div className="relative w-full max-w-sm aspect-square bg-[#e6dccf] shadow-[10px_10px_20px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.5)] flex items-center justify-center p-4 rotate-1 border border-[#d6cbb8]">
                    {/* Simulated Cardboard Texture Color */}
                    <div className="text-center">
                        <p className="text-stone-500 font-serif italic mb-2">[Miejsce na zdjęcie boxa]</p>
                        <p className="text-xs font-mono text-stone-400 break-all">image_cb21c8.jpg</p>
                        <div className="mt-4 w-32 h-32 border-4 border-dashed border-stone-400/30 mx-auto rounded-full flex items-center justify-center">
                            <Package className="text-stone-400 opacity-50" size={48} />
                        </div>
                    </div>
                    {/* Stamp decoration */}
                    <div className="absolute bottom-4 right-4 w-20 h-20 border-2 border-red-800/60 rounded-full flex items-center justify-center rotate-[-15deg] opacity-70 mask-image:url(...)">
                        <span className="text-red-800/80 font-bold text-xs uppercase text-center leading-tight">100%<br/>Original<br/>Quality</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#292524] text-[#a8a29e] pt-16 pb-8 border-t-4 border-amber-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
               <div className="flex items-center gap-2 mb-6">
                  <div className="text-white font-serif text-2xl font-bold">Pan Żelek</div>
                </div>
                <p className="text-sm font-sans leading-relaxed max-w-xs">
                  Tradycja, smak i nowoczesne podejście. Dziękujemy, że jesteś z nami i wspierasz polską markę.
                </p>
            </div>

            <div className="flex flex-col gap-4">
               <h4 className="text-white font-serif font-bold uppercase tracking-widest text-sm">Kontakt</h4>
               <p className="font-sans text-sm">ul. Słodka 12/4, Warszawa</p>
               <p className="font-sans text-sm">tel: +48 123 456 789</p>
               <p className="font-sans text-sm">email: sklep@panzelek.pl</p>
            </div>

            <div>
              <h4 className="text-white font-serif font-bold uppercase tracking-widest text-sm mb-4">Śledź nas</h4>
              <div className="flex gap-4">
                <a href="#" className="p-2 border border-[#a8a29e] rounded-full hover:border-white hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="p-2 border border-[#a8a29e] rounded-full hover:border-white hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#44403c] pt-8 text-center text-xs font-sans uppercase tracking-widest">
            &copy; 2024 Pan Żelek. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PanZelekCraft;
