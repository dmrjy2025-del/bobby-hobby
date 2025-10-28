import { motion } from 'motion/react';
import { Clock, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useProducts } from '../contexts/ProductContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ProductCard } from './ProductCard';

export function ComingSoonPage() {
  const { products } = useProducts();
  const { t } = useLanguage();

  // Filter products marked as coming soon
  const comingSoonProducts = products.filter(product => product.comingSoon);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F7F7' }}>
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ backgroundColor: '#FF6B8B' }}>
            <Clock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl mb-4" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}>
            Coming Soon
          </h1>
          <p className="mb-8" style={{ color: '#5A5A5A' }}>
            Exclusive products that will be available soon
          </p>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-sm mb-12"
          >
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-5 h-5" style={{ color: '#FF6B8B' }} />
              <h3 style={{ color: '#2D2D2D' }}>Get Notified</h3>
            </div>
            <p className="text-sm mb-4" style={{ color: '#5A5A5A' }}>
              Subscribe to get updates on latest product launches
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your Email"
                className="flex-1 rounded-full"
              />
              <Button className="rounded-full text-white px-6" style={{ backgroundColor: '#FF6B8B' }}>
                Subscribe
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {comingSoonProducts.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto mb-4" style={{ color: '#5A5A5A', opacity: 0.3 }} />
            <p className="text-xl mb-2" style={{ color: '#2D2D2D' }}>
              No Products Yet
            </p>
            <p style={{ color: '#5A5A5A' }}>
              Stay tuned! Amazing products are coming soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoonProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Clock className="w-16 h-16" style={{ color: '#FF6B8B' }} />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs text-white" style={{ backgroundColor: '#FF6B8B' }}>
                      Coming Soon
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs mb-1" style={{ color: '#FF6B8B' }}>
                    {product.brand}
                  </p>
                  <h3 className="mb-2" style={{ color: '#2D2D2D' }}>
                    {product.name}
                  </h3>
                  <p className="text-xl mb-3" style={{ color: '#2D2D2D' }}>
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 text-sm mb-3" style={{ color: '#5A5A5A' }}>
                    <Clock className="w-4 h-4" />
                    <span>Available Soon</span>
                  </div>
                  <Button
                    className="w-full rounded-full text-white"
                    style={{ backgroundColor: '#FF6B8B' }}
                  >
                    Notify Me
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
