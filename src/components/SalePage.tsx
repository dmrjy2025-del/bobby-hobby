import { motion } from 'motion/react';
import { ProductCard } from './ProductCard';
import { Badge } from './ui/badge';

interface SalePageProps {
  onNavigate: (page: string) => void;
}

const saleProducts = [
  {
    id: 2,
    name: 'Crybaby Series 3',
    brand: 'Crybaby',
    price: 39.99,
    originalPrice: 59.99,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1760007418582-331b744dc60f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 10,
    name: 'Tomtoc Adventure Pack',
    brand: 'Tomtoc',
    price: 35.99,
    originalPrice: 49.99,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1759863489255-f4a960247d13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 14,
    name: 'Bon Ton Classic',
    brand: 'Bon Ton Toys',
    price: 38.99,
    originalPrice: 54.99,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1759680190846-d511f7ae1128?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 4,
    name: 'The Monsters Collection',
    brand: 'THE MONSTERS',
    price: 44.99,
    originalPrice: 64.99,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1759680190846-d511f7ae1128?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  }
];

export function SalePage({ onNavigate }: SalePageProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F7F7' }}>
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <h1 className="text-5xl" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}>
              Special Discount
            </h1>
            <Badge className="text-white px-3 py-1" style={{ backgroundColor: '#FF6B8B' }}>
              Sale
            </Badge>
          </div>
          <p style={{ color: '#5A5A5A' }}>
            Save up to 50% on selected products
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {saleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="absolute top-4 right-4 z-10">
                <Badge className="text-white px-3 py-1" style={{ backgroundColor: '#FF6B8B' }}>
                  -{product.discount}%
                </Badge>
              </div>
              <ProductCard
                id={product.id}
                name={product.name}
                brand={product.brand}
                price={product.price}
                image={product.image}
                index={0}
                onProductClick={(id) => onNavigate(`product-detail-${id}`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
