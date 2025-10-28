import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

const brands = [
  { name: 'PopMart', color: '#FF6B8B' },
  { name: 'Crybaby', color: '#6A5AF8' },
  { name: 'Instinctoy', color: '#FFB84D' },
  { name: 'THE MONSTERS', color: '#4ECDC4' },
  { name: 'Tomtoc', color: '#FF6B8B' },
  { name: 'Bon Ton Toys', color: '#95E1D3' }
];

interface BrandsSectionProps {
  onNavigate: (page: string) => void;
}

export function BrandsSection({ onNavigate }: BrandsSectionProps) {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#d3d6e6' }}>
      <div className="container mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl text-center mb-4"
          style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}
        >
          {t('shopByBrand')}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12"
          style={{ color: '#5A5A5A' }}
        >
          Discover collections from the best brands in the hobby world
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand, index) => (
            <motion.button
              key={brand.name}
              onClick={() => onNavigate('catalog')}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl p-8 flex items-center justify-center aspect-square cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: brand.color + '20' }}
                >
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-sm" style={{ color: '#2D2D2D' }}>
                  {brand.name}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
