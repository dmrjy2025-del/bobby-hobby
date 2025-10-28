import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  images?: string[]; // Multiple images for gallery
  thumbnailIndex?: number; // Index of thumbnail image from images array
  category?: string;
  description?: string;
  keyFeatures?: string[]; // Key features list
  stock?: number;
  featured?: boolean;
  newArrival?: boolean;
  onSale?: boolean;
  discount?: number;
  comingSoon?: boolean;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Initial products data
const initialProducts: Product[] = [
  {
    id: 'product-1',
    name: 'PopMart Labubu V3',
    brand: 'PopMart',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1708020777427-518e5c6c739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGNvbGxlY3RpYmxlJTIwdG95JTIwZmlndXJlfGVufDF8fHx8MTc2MDM0NzA2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Figures',
    description: 'Premium quality collectible figure',
    stock: 25,
    featured: true,
    newArrival: true,
  },
  {
    id: 'product-2',
    name: 'Crybaby Series 3',
    brand: 'Crybaby',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1760007418582-331b744dc60f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZGVzaWduZXIlMjB0b3l8ZW58MXx8fHwxNzYwMzQ3MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Figures',
    description: 'Emotional expression collectible',
    stock: 15,
    featured: true,
    newArrival: true,
    onSale: true,
    discount: 20,
  },
  {
    id: 'product-3',
    name: 'Instinctoy Mini Figure',
    brand: 'Instinctoy',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1671668540310-2674006ae184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHRveSUyMGZpZ3VyZXxlbnwxfHx8fDE3NjAzNDcwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Vinyl Toys',
    description: 'Limited edition vinyl figure',
    stock: 8,
    featured: true,
    newArrival: true,
  },
  {
    id: 'product-4',
    name: 'The Monsters Collection',
    brand: 'THE MONSTERS',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1759680190846-d511f7ae1128?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWN0aWJsZSUyMGZpZ3VyZSUyMGRpc3BsYXl8ZW58MXx8fHwxNzYwMzQ3MDY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Figures',
    description: 'Monster character collection',
    stock: 12,
    featured: true,
  },
  {
    id: 'product-5',
    name: 'Kawaii Dreams Figure',
    brand: 'PopMart',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1759863489255-f4a960247d13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXdhaWklMjB0b3klMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzYwMzQ3MDY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Figures',
    description: 'Kawaii style collectible',
    stock: 20,
    featured: true,
  },
  {
    id: 'product-6',
    name: 'Limited Edition Vinyl',
    brand: 'Instinctoy',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1708020777427-518e5c6c739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBhcnQlMjB0b3klMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MDM0NzA2OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Vinyl Toys',
    description: 'Exclusive limited release',
    stock: 5,
    featured: true,
    newArrival: true,
  },
  {
    id: 'product-7',
    name: 'Designer Toy Set',
    brand: 'Crybaby',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1760007418582-331b744dc60f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZGVzaWduZXIlMjB0b3l8ZW58MXx8fHwxNzYwMzQ3MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Sets',
    description: 'Complete designer toy set',
    stock: 10,
    onSale: true,
    discount: 15,
  },
  {
    id: 'product-8',
    name: 'Collector Edition',
    brand: 'Bon Ton Toys',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1671668540310-2674006ae184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHRveSUyMGZpZ3VyZXxlbnwxfHx8fDE3NjAzNDcwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Figures',
    description: 'Rare collector edition',
    stock: 6,
    featured: true,
  },
];

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    // Load products from localStorage or use initial data
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Save to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find((product) => product.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}