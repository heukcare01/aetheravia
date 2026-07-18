'use client';

import { useState } from 'react';
import Image from 'next/image';

const ingredients = [
  {
    name: 'Multani Mitti',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB47P0KJePXXKyE549X8Gn_fzTbAlm9uwI7_YsFYqQIpvMyKahHnzXInP90AqlWRuNRy3Pvg0p0bURp-pfBPY8C4caJ4yEDy3MtAJJoU7aH8fmLuGr_dBwVTXG1U46kGX1IkPuuq2pTxsM1yV_GK1DQ6B-htRRk1a0BwXbmvQc1Y8BwIt5szEWJCCTYbahfnPppPDjVVuo9HNdJC8kKgzcK_UoZtA6uowhtjMlwRfsWe2yO4dwhg20dTY34nC9p3wiLvaojTSAzFFk5',
    description: "Fuller's Earth, the cooling clay that draws out impurities while preserving the skin's natural moisture barrier.",
  },
  {
    name: 'Reetha (Soapnut)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC04NUM7hOpQvhNLr_nnqhCZo2UwzQnx2ATVou2KlOFsAbuZjIJrB-_tvwopItVSpr31LKf96EqRCKVNdGeRS0Bo44kELeNSMZlMh3Otm2YQHvZyzB5W_geABAnwXEEVEZP7qQmkDuLBFdVgaVs8pd-Bn2rGVFJPE5t7JJhCVNlbyTD-6Xo4BpHpPnXG5W_63zL5JG0GrhOdQMUrlTW1ZqQR98I906Mk43kXFRpdWwO6MHDbkVS5309-J72XP8VNHzJepqI1BWhXxXP',
    description: "Soapnuts offer a chemical-free, natural surfactant that gently cleanses without stripping the skin's essential oils.",
  }
];

export default function FeaturedIngredients() {
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);

  const toggleIngredient = (name: string) => {
    setSelectedIngredient(prev => prev === name ? null : name);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-secondary/40 font-bold">Featured Ingredients</h3>
      </div>
      <div className="flex flex-col space-y-4 px-4">
        {ingredients.map((ingredient) => {
          const isActive = selectedIngredient === ingredient.name;
          return (
            <div key={ingredient.name} className="flex flex-col border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm">
              <button
                onClick={() => toggleIngredient(ingredient.name)}
                className={`flex items-center justify-between p-4 cursor-pointer w-full text-left transition-colors ${
                  isActive ? 'bg-primary/5' : 'hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${
                    isActive ? 'border-primary' : 'border-outline/30'
                  }`}>
                    <div className={`w-2.5 h-2.5 bg-primary rounded-sm transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}></div>
                  </div>
                  <span className={`text-sm transition-colors font-medium ${
                    isActive ? 'text-primary' : 'text-secondary/80'
                  }`}>
                    {ingredient.name}
                  </span>
                </div>
                <span className={`material-symbols-outlined text-secondary/40 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-4 pt-0 space-y-3 bg-primary/5">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-outline-variant/20 shadow-inner">
                      <Image 
                        src={ingredient.image} 
                        alt={ingredient.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-secondary/80 font-body leading-relaxed italic border-l-2 border-primary/30 pl-3">
                      {ingredient.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
