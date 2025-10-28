import { motion } from 'motion/react';
import { Button } from './ui/button';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon } from './icons/Icons';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export function CartPage({ onNavigate }: CartPageProps) {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-20" style={{ backgroundColor: '#d3d6e6' }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-white rounded-3xl p-12 shadow-lg">
              <ShoppingBagIcon className="w-24 h-24 mx-auto mb-6" style={{ color: '#FF6B8B' }} />
              <h2 className="mb-4" style={{ color: '#2D2D2D' }}>
                {t('emptyCart')}
              </h2>
              <p className="mb-8" style={{ color: '#5A5A5A' }}>
                Start adding your favorite collectibles!
              </p>
              <Button
                onClick={() => onNavigate('catalog')}
                className="text-white px-8 py-6 rounded-full"
                style={{ backgroundColor: '#FF6B8B' }}
              >
                {t('continueShopping')}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: '#d3d6e6' }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="mb-8" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}>
            {t('yourCart')}
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="text-xs mb-1" style={{ color: '#FF6B8B' }}>
                            {item.brand}
                          </p>
                          <h3 className="mb-2" style={{ color: '#2D2D2D' }}>
                            {item.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border-2 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            style={{ borderColor: '#FF6B8B', color: '#FF6B8B' }}
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span style={{ color: '#2D2D2D' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
                            style={{ backgroundColor: '#FF6B8B' }}
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xl" style={{ color: '#2D2D2D' }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm" style={{ color: '#5A5A5A' }}>
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm sticky top-24"
              >
                <h2 className="mb-6" style={{ color: '#2D2D2D' }}>
                  {t('orderSummary')}
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span style={{ color: '#5A5A5A' }}>{t('subtotal')}</span>
                    <span style={{ color: '#2D2D2D' }}>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#5A5A5A' }}>Shipping</span>
                    <span style={{ color: '#FF6B8B' }}>{t('free')}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg" style={{ color: '#2D2D2D' }}>{t('total')}</span>
                      <span className="text-2xl" style={{ color: '#2D2D2D' }}>
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => onNavigate('checkout')}
                  className="w-full text-white py-6 rounded-full mb-3"
                  style={{ backgroundColor: '#FF6B8B' }}
                >
                  {t('proceedToCheckout')}
                </Button>

                <Button
                  onClick={() => onNavigate('catalog')}
                  variant="outline"
                  className="w-full py-6 rounded-full border-2"
                  style={{ borderColor: '#FF6B8B', color: '#FF6B8B' }}
                >
                  {t('continueShopping')}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
