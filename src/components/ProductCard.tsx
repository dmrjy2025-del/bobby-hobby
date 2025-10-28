import { motion } from 'motion/react';
import { Button } from './ui/button';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';
import { ShoppingCartIcon } from './icons/Icons';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  index: number;
  onProductClick?: (productId: string) => void;
}

export function ProductCard({ id, name, brand, price, image, index, onProductClick }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id, name, brand, price, image });
    toast.success(t('addedToCart'), {
      description: name,
      duration: 2000,
    });
  };

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onClick={handleClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer group"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Quick Add Button - appears on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="rounded-full text-white px-6"
            style={{ backgroundColor: '#FF6B8B' }}
          >
            <ShoppingCartIcon className="w-4 h-4 mr-2" />
            {t('quickAdd')}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <p className="text-xs mb-1" style={{ color: '#FF6B8B' }}>
          {brand}
        </p>
        <h3 className="mb-2" style={{ color: '#2D2D2D' }}>
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-xl" style={{ color: '#2D2D2D' }}>
            ${price.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
