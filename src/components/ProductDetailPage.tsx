import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { ProductCard } from './ProductCard';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useProducts } from '../contexts/ProductContext';
import { toast } from 'sonner';
import { 
  ShoppingCartIcon, 
  StarIcon, 
  ShieldIcon, 
  TruckIcon, 
  PackageIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CheckCircleIcon 
} from './icons/Icons';
import BackButton from './ui/BackButton';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function ProductDetailPage({ productId, onNavigate, onBack }: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const { products, getProductById } = useProducts();

  // Get product from ProductContext
  const productFromContext = getProductById(productId);
  
  // Mock fallback data for products not in context
  const mockProduct = {
    id: productId,
    name: 'Product Name',
    brand: 'Brand',
    price: 49.99,
    rating: 4.8,
    reviews: 127,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1708020777427-518e5c6c739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    description: {
      en: 'This is a premium collectible figure with exceptional quality.',
      id: 'Ini adalah figur koleksi premium dengan kualitas luar biasa.',
    },
    features: [
      { en: 'High-quality material', id: 'Material berkualitas tinggi' },
      { en: 'Hand-painted details', id: 'Detail dicat tangan' },
    ],
    shippingInfo: {
      en: 'Free standard shipping on orders over $50.',
      id: 'Pengiriman standar gratis untuk pesanan di atas $50.',
    },
  };

  // Use product from context if available, otherwise use mock
  const product = productFromContext ? {
    ...mockProduct,
    ...productFromContext,
    images: productFromContext.images && productFromContext.images.length > 0 
      ? productFromContext.images 
      : [productFromContext.image],
    description: productFromContext.description 
      ? { en: productFromContext.description, id: productFromContext.description }
      : mockProduct.description,
    features: productFromContext.keyFeatures 
      ? productFromContext.keyFeatures.map(f => ({ en: f, id: f }))
      : mockProduct.features,
  } : mockProduct;

  // Mock reviews data
  const reviews = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      rating: 5,
      date: 'October 15, 2025',
      comment: 'Amazing quality! The details are incredible and it looks exactly like the pictures. Highly recommend!',
      verified: true,
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'MC',
      rating: 5,
      date: 'October 10, 2025',
      comment: 'Perfect addition to my collection. Fast shipping and excellent packaging.',
      verified: true,
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: 'ER',
      rating: 4,
      date: 'October 5, 2025',
      comment: 'Great product! Only minor issue was the packaging could be better, but the figure itself is perfect.',
      verified: true,
    },
  ];

  // Recommended products - get similar products from the same brand or category
  const recommendedProducts = products
    .filter(p => p.id !== productId && (p.brand === product.brand || p.category === productFromContext?.category))
    .slice(0, 4)
    .map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      image: p.image,
    }));

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.images[0]
      });
    }
    toast.success(t('addedToCart'), {
      description: `${quantity}x ${product.name}`,
      duration: 2000,
    });
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#d3d6e6' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <BackButton onClick={onBack} className="mb-6" style={{ color: '#2D2D2D' }} />

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative bg-white rounded-3xl overflow-hidden aspect-square">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  >
                    <ChevronLeftIcon className="w-6 h-6" style={{ color: '#2D2D2D' }} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  >
                    <ChevronRightIcon className="w-6 h-6" style={{ color: '#2D2D2D' }} />
                  </button>
                </>
              )}

              {/* Quality Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="text-white px-3 py-2 flex items-center gap-2" style={{ backgroundColor: '#FF6B8B' }}>
                  <ShieldIcon className="w-4 h-4" />
                  Quality Guaranteed
                </Badge>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-[#FF6B8B] scale-105' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm mb-2" style={{ color: '#FF6B8B' }}>
                {product.brand}
              </p>
              <h1 className="text-4xl mb-3" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}>
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                      style={{ color: '#FFB84D' }}
                    />
                  ))}
                </div>
                <span style={{ color: '#5A5A5A' }}>
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl" style={{ color: '#2D2D2D' }}>
                  ${product.price.toFixed(2)}
                </span>
                {product.inStock && (
                  <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="mb-3" style={{ color: '#2D2D2D' }}>Description</h3>
              <p style={{ color: '#5A5A5A' }}>
                {product.description[language]}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="mb-4" style={{ color: '#2D2D2D' }}>Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature: any, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#FF6B8B' }} />
                    <span style={{ color: '#5A5A5A' }}>{feature[language]}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <label style={{ color: '#2D2D2D' }}>Quantity:</label>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    variant="outline"
                    className="w-10 h-10 rounded-full"
                    style={{ borderColor: '#FF6B8B', color: '#FF6B8B' }}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center" style={{ color: '#2D2D2D' }}>{quantity}</span>
                  <Button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full text-white"
                    style={{ backgroundColor: '#FF6B8B' }}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full text-white py-6 rounded-full"
                style={{ backgroundColor: '#FF6B8B' }}
              >
                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                {t('addToCart')}
              </Button>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#FFF0F3' }}>
                  <TruckIcon className="w-6 h-6" style={{ color: '#FF6B8B' }} />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1" style={{ color: '#2D2D2D' }}>Free Shipping</h4>
                  <p className="text-sm" style={{ color: '#5A5A5A' }}>
                    On orders over $50
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#FFF0F3' }}>
                  <PackageIcon className="w-6 h-6" style={{ color: '#FF6B8B' }} />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1" style={{ color: '#2D2D2D' }}>Secure Packaging</h4>
                  <p className="text-sm" style={{ color: '#5A5A5A' }}>
                    {product.shippingInfo[language]}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 mb-16"
        >
          <h2 className="text-3xl mb-8" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}>
            Customer Reviews
          </h2>

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback style={{ backgroundColor: '#FF6B8B', color: 'white' }}>
                      {review.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 style={{ color: '#2D2D2D' }}>{review.name}</h4>
                        <p className="text-sm" style={{ color: '#5A5A5A' }}>{review.date}</p>
                      </div>
                      {review.verified && (
                        <Badge className="bg-green-100 text-green-800">Verified Purchase</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`}
                          style={{ color: '#FFB84D' }}
                        />
                      ))}
                    </div>
                    <p style={{ color: '#5A5A5A' }}>{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommended Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl mb-8" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}>
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                price={product.price}
                image={product.image}
                index={index}
                onProductClick={(id) => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onNavigate(`product-detail-${id}`);
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}