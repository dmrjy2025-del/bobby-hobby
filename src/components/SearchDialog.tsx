import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
}

const allProducts: Product[] = [
  { id: 1, name: 'PopMart Labubu V3', brand: 'PopMart', price: 49.99, image: 'https://images.unsplash.com/photo-1708020777427-518e5c6c739d?w=200' },
  { id: 2, name: 'Crybaby Series 3', brand: 'Crybaby', price: 39.99, image: 'https://images.unsplash.com/photo-1760007418582-331b744dc60f?w=200' },
  { id: 3, name: 'Instinctoy Mini Figure', brand: 'Instinctoy', price: 59.99, image: 'https://images.unsplash.com/photo-1671668540310-2674006ae184?w=200' },
  { id: 4, name: 'The Monsters Collection', brand: 'THE MONSTERS', price: 44.99, image: 'https://images.unsplash.com/photo-1759680190846-d511f7ae1128?w=200' },
  { id: 5, name: 'Kawaii Dreams Figure', brand: 'PopMart', price: 54.99, image: 'https://images.unsplash.com/photo-1759863489255-f4a960247d13?w=200' },
  { id: 6, name: 'Limited Edition Vinyl', brand: 'Instinctoy', price: 79.99, image: 'https://images.unsplash.com/photo-1708020777427-518e5c6c739d?w=200' },
  { id: 7, name: 'Designer Toy Set', brand: 'Crybaby', price: 89.99, image: 'https://images.unsplash.com/photo-1760007418582-331b744dc60f?w=200' },
  { id: 8, name: 'Collector Edition', brand: 'Bon Ton Toys', price: 64.99, image: 'https://images.unsplash.com/photo-1671668540310-2674006ae184?w=200' },
  { id: 9, name: 'PopMart Dimoo Series', brand: 'PopMart', price: 45.99, image: 'https://images.unsplash.com/photo-1759680190846-d511f7ae1128?w=200' },
  { id: 10, name: 'Tomtoc Adventure Pack', brand: 'Tomtoc', price: 35.99, image: 'https://images.unsplash.com/photo-1759863489255-f4a960247d13?w=200' },
  { id: 11, name: 'Instinctoy Chaos Edition', brand: 'Instinctoy', price: 99.99, image: 'https://images.unsplash.com/photo-1708020777427-518e5c6c739d?w=200' },
  { id: 12, name: 'Crybaby Pastel Dream', brand: 'Crybaby', price: 42.99, image: 'https://images.unsplash.com/photo-1760007418582-331b744dc60f?w=200' },
  { id: 13, name: 'Monsters Galaxy Series', brand: 'THE MONSTERS', price: 52.99, image: 'https://images.unsplash.com/photo-1671668540310-2674006ae184?w=200' },
  { id: 14, name: 'Bon Ton Classic', brand: 'Bon Ton Toys', price: 38.99, image: 'https://images.unsplash.com/photo-1759680190846-d511f7ae1128?w=200' },
  { id: 15, name: 'PopMart Molly Series', brand: 'PopMart', price: 47.99, image: 'https://images.unsplash.com/photo-1759863489255-f4a960247d13?w=200' },
  { id: 16, name: 'Tomtoc Explorer', brand: 'Tomtoc', price: 41.99, image: 'https://images.unsplash.com/photo-1708020777427-518e5c6c739d?w=200' }
];

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductClick: (productName: string) => void;
}

export function SearchDialog({ open, onOpenChange, onProductClick }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filtered);
  }, [searchQuery]);

  const handleProductClick = (product: Product) => {
    onProductClick(product.name);
    onOpenChange(false);
    setSearchQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
          <DialogDescription>
            What collection are you hunting for today?
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#5A5A5A' }} />
          <Input
            type="text"
            placeholder="What are you splurging on today? 🛍️✨"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
            autoFocus
          />
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto">
          {searchQuery === '' && (
            <div className="text-center py-8" style={{ color: '#5A5A5A' }}>
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Start typing to search for products</p>
            </div>
          )}

          {searchQuery !== '' && results.length === 0 && (
            <div className="text-center py-8" style={{ color: '#5A5A5A' }}>
              <p>No products found</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 style={{ color: '#2D2D2D' }}>{product.name}</h4>
                    <p className="text-sm" style={{ color: '#FF6B8B' }}>{product.brand}</p>
                  </div>
                  <span style={{ color: '#2D2D2D' }}>${product.price}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
