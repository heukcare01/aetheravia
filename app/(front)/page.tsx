import { Metadata } from 'next';
import { Suspense } from 'react';
import HeroModern from '@/components/home/HeroModern';
import IngredientGallery from '@/components/home/IngredientGallery';
import SkincareRitual from '@/components/home/SkincareRitual';
import FAQ from '@/components/home/FAQ';
import Newsletter from '@/components/home/Newsletter';
import Slider from '@/components/slider/Slider';
import ProductItems, { ProductItemsSkeleton } from '@/components/products/ProductItems';
import TrustBarModern from '@/components/home/TrustBarModern';
import TrustBar from '@/components/footer/TrustBar';
import Testimonials from '@/components/testimonials/Testimonials';

export const metadata: Metadata = {
  title: {
    absolute: 'Aethravia',
  },
  description: 'Grounded elegance for the modern heritage seeker. Discover artisanal skin rituals crafted from Multani Mitti and Reetha.',
};

const HomePage = () => {
  return (
    <div className='flex flex-col bg-surface'>
      {/* Hero Section: Ancient Wisdom */}
      <HeroModern />



      {/* Top Rated & New Arrivals Sliders */}
      <section className="py-12 md:py-24 w-full space-y-16 md:space-y-32">
        <Suspense fallback={<ProductItemsSkeleton qty={4} layout="slider" />}>
          <ProductItems 
            layout="slider" 
            title="Signature" 
            highlight="Favorites" 
          />
        </Suspense>

        <Suspense fallback={<ProductItemsSkeleton qty={4} layout="slider" />}>
          <ProductItems 
            layout="slider" 
            title="Recent" 
            highlight="Harvest" 
            sort="latest"
          />
        </Suspense>
      </section>

      {/* Key Ingredients: The Elemental Three */}
      <IngredientGallery />

      {/* Client Reviews */}
      <section className="py-12 md:py-24 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-headline text-center mb-8 text-primary">Ritual Reviews</h2>
        <Testimonials />
      </section>

      {/* Trust & Heritage Values */}
      <TrustBarModern />

      {/* Artisanal Rituals Section */}
      <SkincareRitual />

      {/* FAQ Section */}
      <FAQ />

      {/* Newsletter / Editorial Section */}
      <Newsletter />
      
      {/* Features TrustBar */}
      <TrustBar />
    </div>
  );
};

export default HomePage;

