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
  const [selectedIngredient, setSelectedIngredient] = useState<typeof ingredients[0] | null>(null);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-secondary/40 font-bold">Featured Ingredients</h3>
        </div>
        <div className="flex flex-col space-y-5 px-4">
          {ingredients.map((ingredient) => (
            <button
              key={ingredient.name}
              onClick={() => setSelectedIngredient(ingredient)}
              className="flex items-center gap-4 cursor-pointer group w-full text-left bg-transparent border-none p-0 m-0"
            >
              <div className="w-5 h-5 border rounded flex items-center justify-center transition-colors border-outline/30 group-hover:border-primary">
                <div className="w-2.5 h-2.5 bg-primary rounded-sm transition-opacity opacity-0 group-hover:opacity-10"></div>
              </div>
              <span className="text-sm transition-colors text-secondary/80 group-hover:text-primary">
                {ingredient.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedIngredient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedIngredient(null)}>
          <div 
            className="bg-surface rounded-xl overflow-hidden max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedIngredient(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
            <div className="relative aspect-[4/3] w-full">
              <Image 
                src={selectedIngredient.image} 
                alt={selectedIngredient.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 md:p-8">
              <h4 className="font-headline text-2xl text-primary mb-3">{selectedIngredient.name}</h4>
              <p className="text-secondary/80 font-body text-sm leading-relaxed">
                {selectedIngredient.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
