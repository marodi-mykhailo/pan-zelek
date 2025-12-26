import React, { useState } from 'react';
import PanZelekDefault from './components/PanZelekDefault';
import PanZelekCraft from './components/PanZelekCraft';
import PanZelekPremium from './components/PanZelekPremium';

type DesignVariant = 'default' | 'craft' | 'premium';

const App = () => {
  const [currentDesign, setCurrentDesign] = useState<DesignVariant>('default');

  const designs = [
    { id: 'default' as DesignVariant, name: 'Default', emoji: '🎨', description: 'Яскравий, веселий дизайн', color: 'bg-pink-500' },
    { id: 'craft' as DesignVariant, name: 'Craft', emoji: '✨', description: 'Крафтова, тепла тема', color: 'bg-amber-600' },
    { id: 'premium' as DesignVariant, name: 'Premium', emoji: '👑', description: 'Мінімалістичний, елегантний', color: 'bg-gray-700' },
  ];

  const currentIndex = designs.findIndex(d => d.id === currentDesign);

  const renderDesign = () => {
    switch (currentDesign) {
      case 'default':
        return <PanZelekDefault />;
      case 'craft':
        return <PanZelekCraft />;
      case 'premium':
        return <PanZelekPremium />;
      default:
        return <PanZelekDefault />;
    }
  };

  return (
    <div className="relative">
      {/* Design Switcher - Improved vertical column */}
      <div className="fixed bottom-4 right-4 z-[100] bg-white/95 backdrop-blur-lg border border-gray-200/60 rounded-xl shadow-xl overflow-hidden">
        {/* Animated background indicator */}
        <div
          className={`absolute left-1 top-1 w-[calc(100%-0.5rem)] h-[calc(33.333%-0.25rem)] ${designs[currentIndex].color} rounded-lg transition-all duration-500 ease-in-out`}
          style={{
            transform: `translateY(calc(${currentIndex} * (100% + 0.25rem)))`,
          }}
        />

        <div className="relative px-3 py-2 flex flex-col gap-1">
          {designs.map((design, index) => {
            const isActive = currentDesign === design.id;
            return (
              <button
                key={design.id}
                onClick={() => setCurrentDesign(design.id)}
                className={`
                  relative z-10 px-4 py-2.5 rounded-lg text-xs font-semibold
                  transition-all duration-300 whitespace-nowrap
                  flex items-center gap-2
                  ${isActive
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                  }
                `}
                title={design.description}
              >
                <span className="text-sm">{design.emoji}</span>
                <span>{design.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render current design */}
      {renderDesign()}
    </div>
  );
};

export default App;
