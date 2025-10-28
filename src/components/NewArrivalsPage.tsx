import { motion } from 'motion/react';
import { ProductCard } from './ProductCard';

interface NewArrivalsPageProps {
  onNavigate: (page: string) => void;
}

const newProducts = [
  {
    id: 11,
    name: 'Instinctoy Chaos Edition',
    brand: 'Instinctoy',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1708020777427-518e5c6c739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 12,
    name: 'Crybaby Pastel Dream',
    brand: 'Crybaby',
    price: 42.99,
    image: 'https://images.unsplash.com/photo-1760007418582-331b744dc60f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 13,
    name: 'Monsters Galaxy Series',
    brand: 'THE MONSTERS',
    price: 52.99,
    image: 'https://images.unsplash.com/photo-1671668540310-2674006ae184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 14,
    name: 'Bon Ton Classic',
    brand: 'Bon Ton Toys',
    price: 38.99,
    image: 'https://images.unsplash.com/photo-1759680190846-d511f7ae1128?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 15,
    name: 'PopMart Molly Series',
    brand: 'PopMart',
    price: 47.99,
    image: 'https://images.unsplash.com/photo-1759863489255-f4a960247d13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 16,
    name: 'Tomtoc Explorer',
    brand: 'Tomtoc',
    price: 41.99,
    image: 'https://images.unsplash.com/photo-1708020777427-518e5c6c739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  }
];

export function NewArrivalsPage({ onNavigate }: NewArrivalsPageProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F7F7' }}>
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl mb-4" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}>
            New Arrivals
          </h1>
          <p style={{ color: '#5A5A5A' }}>
            Latest collections from your favorite brands
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newProducts.map((product, index) => (
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
    </div>
  );
}
