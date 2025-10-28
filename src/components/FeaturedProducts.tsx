import { motion } from 'motion/react';
import { ProductCard } from './ProductCard';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { useProducts } from '../contexts/ProductContext';
import { ArrowRightIcon } from './icons/Icons';

interface FeaturedProductsProps {
  onNavigate: (page: string) => void;
}

export function FeaturedProducts({ onNavigate }: FeaturedProductsProps) {
  const { t } = useLanguage();
  const { products: allProducts } = useProducts();
  
  // Filter to show only featured products, limit to 8
  const products = allProducts.filter(p => p.featured).slice(0, 8);
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#F7F7F7' }}>
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-5xl mb-2"
              style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}
            >
              {t('featuredProducts')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ color: '#5A5A5A' }}
            >
              Special curated collection for you
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Button
              onClick={() => onNavigate('catalog')}
              variant="outline"
              className="rounded-full border-2 hover:bg-transparent"
              style={{ borderColor: '#FF6B8B', color: '#FF6B8B' }}
            >
              {t('viewAll')}
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              brand={product.brand}
              price={product.price}
              image={product.image}
              index={index}
              onProductClick={(id) => onNavigate(`product-detail-${id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
