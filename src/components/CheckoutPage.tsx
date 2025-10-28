import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useOrders } from '../contexts/OrderContext';
import { useProducts } from '../contexts/ProductContext';
import { toast } from 'sonner';
import { CreditCardIcon, WalletIcon, PackageIcon, TruckIcon, ZapIcon, CheckCircleIcon, UploadIcon } from './icons/Icons';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const { addOrder } = useOrders();
  const { updateProduct, getProductById } = useProducts();
  // Exchange rate USD -> IDR (default). In a real app this should be fetched from an API.
  const [exchangeRate, setExchangeRate] = useState<number>(15500);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [transferProof, setTransferProof] = useState<File | null>(null);
  const [transferProofPreview, setTransferProofPreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  // Load PayPal SDK (mock implementation)
  useEffect(() => {
    // In production, you would load the real PayPal SDK here
    // For demo purposes, we'll simulate it
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD';
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    
    // For demo, just set it as loaded after a short delay
    setTimeout(() => setPaypalLoaded(true), 500);
    
    return () => {
      // Cleanup
    };
  }, []);

  // Fetch live exchange rate for USD -> IDR on mount (free API)
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=IDR');
        const data = await res.json();
        if (data && data.rates && data.rates.IDR) {
          setExchangeRate(Number(data.rates.IDR));
        }
      } catch (err) {
        // Keep default if fetch fails
        console.warn('Failed to fetch exchange rate, using default', err);
      }
    };

    fetchRate();
  }, []);

  const shippingOptions = [
    { id: 'standard', label: t('standardShipping'), price: 0, icon: PackageIcon },
    { id: 'express', label: t('expressShipping'), price: 15, icon: TruckIcon },
    { id: 'overnight', label: t('overnightShipping'), price: 30, icon: ZapIcon },
  ];

  const selectedShipping = shippingOptions.find(opt => opt.id === shippingMethod);
  const finalTotal = totalPrice + (selectedShipping?.price || 0);

  // Helper to format currency depending on payment method
  const formatCurrency = (amountUsd: number) => {
    if (paymentMethod === 'bank-transfer') {
      const idr = Math.round(amountUsd * exchangeRate);
      return `Rp ${idr.toLocaleString('id-ID')}`;
    }
    return `$${amountUsd.toFixed(2)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTransferProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPG, PNG, etc.)');
        return;
      }

      setTransferProof(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setTransferProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processOrder = () => {
    // Reduce stock for each product in the order
    items.forEach((item) => {
      const product = getProductById(item.id);
      if (product) {
        const newStock = (product.stock || 0) - item.quantity;
        updateProduct(item.id, {
          stock: Math.max(0, newStock), // Ensure stock doesn't go negative
        });
      }
    });

    // Create order
    const order = {
      id: `ORD-${Date.now()}`,
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        priceIDR: paymentMethod === 'bank-transfer' ? Math.round(item.price * exchangeRate) : undefined,
        quantity: item.quantity,
        image: item.image,
      })),
    total: finalTotal,
    shippingAmount: selectedShipping?.price || 0,
    totalIDR: paymentMethod === 'bank-transfer' ? Math.round(finalTotal * exchangeRate) : undefined,
    exchangeRate: paymentMethod === 'bank-transfer' ? exchangeRate : undefined,
      status: 'pending' as const,
      paymentMethod: paymentMethod,
      shippingMethod: shippingMethod,
      createdAt: new Date().toISOString(),
    };

    // Save order
    addOrder(order);

    return order;
  };

  const handlePayPalPayment = async () => {
    // Validate form first
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessingPayment(true);

    // Simulate PayPal payment processing (mock)
    setTimeout(() => {
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.1; // 90% success rate for demo

      if (isSuccess) {
        const order = processOrder();
        clearCart();
        setIsProcessingPayment(false);
        
        // Navigate to order confirmation page
        const params = new URLSearchParams();
        params.set('orderId', order.id);
        if (paymentMethod === 'bank-transfer' && order.totalIDR) {
          params.set('totalIDR', String(order.totalIDR));
        }
        onNavigate(`order-confirmation?${params.toString()}`);
      } else {
        toast.error('PayPal Payment Failed', {
          description: 'There was an issue processing your payment. Please try again or use a different payment method.',
          duration: 6000,
        });
        setIsProcessingPayment(false);
      }
    }, 2000);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if transfer proof is uploaded for bank transfer

    if (paymentMethod === 'paypal') {
      handlePayPalPayment();
      return;
    }

    // Bank transfer payment
    setIsProcessingPayment(true);

    // Simulate payment processing
    setTimeout(() => {
      const order = processOrder();
      clearCart();
      setIsProcessingPayment(false);
      
      // Navigate to order confirmation page
      const params = new URLSearchParams();
      params.set('orderId', order.id);
      if (paymentMethod === 'bank-transfer' && order.totalIDR) {
        params.set('totalIDR', String(order.totalIDR));
      }
      onNavigate(`order-confirmation?${params.toString()}`);
    }, 1500);
  };

  if (items.length === 0) {
    onNavigate('cart');
    return null;
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
            {t('checkout')}
          </h1>

          <form onSubmit={handlePlaceOrder}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="mb-6" style={{ color: '#2D2D2D' }}>
                    {t('shippingInformation')}
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="fullName">{t('fullName')}</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">{t('email')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">{t('phone')}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 234 567 8900"
                        required
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="address">{t('address')}</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                        required
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">{t('city')}</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        required
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state">{t('state')}</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        required
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="zipCode">{t('zipCode')}</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        required
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="country">{t('country')}</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="United States"
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Shipping Method */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="mb-6" style={{ color: '#2D2D2D' }}>
                    {t('shippingMethod')}
                  </h2>
                  
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                    {shippingOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <label
                          key={option.id}
                          className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                          style={{ borderColor: shippingMethod === option.id ? '#FF6B8B' : '#e5e7eb' }}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Icon className="w-5 h-5" style={{ color: '#FF6B8B' }} />
                            <span style={{ color: '#2D2D2D' }}>{option.label}</span>
                          </div>
                          <span style={{ color: '#2D2D2D' }}>
                            {option.price === 0 ? t('free') : `$${option.price.toFixed(2)}`}
                          </span>
                        </label>
                      );
                    })}
                  </RadioGroup>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="mb-6" style={{ color: '#2D2D2D' }}>
                    {t('paymentMethod')}
                  </h2>
                  
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <label
                      className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ borderColor: paymentMethod === 'paypal' ? '#FF6B8B' : '#e5e7eb' }}
                    >
                      <RadioGroupItem value="paypal" id="paypal" />
                      <WalletIcon className="w-5 h-5" style={{ color: '#FF6B8B' }} />
                      <span style={{ color: '#2D2D2D' }}>PayPal</span>
                    </label>
                    
                    <label
                      className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ borderColor: paymentMethod === 'bank-transfer' ? '#FF6B8B' : '#e5e7eb' }}
                    >
                      <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                      <CreditCardIcon className="w-5 h-5" style={{ color: '#FF6B8B' }} />
                      <span style={{ color: '#2D2D2D' }}>Bank Rekening (Indonesia Only)</span>
                    </label>
                  </RadioGroup>

                  {paymentMethod === 'bank-transfer' && (
                    <div className="mt-0">
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-6 shadow-sm sticky top-24"
                >
                  <h2 className="mb-6" style={{ color: '#2D2D2D' }}>
                    {t('orderSummary')}
                  </h2>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm" style={{ color: '#2D2D2D' }}>
                            {item.name}
                          </p>
                          <p className="text-xs" style={{ color: '#5A5A5A' }}>
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm" style={{ color: '#2D2D2D' }}>
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between">
                      <span style={{ color: '#5A5A5A' }}>{t('subtotal')}</span>
                      <span style={{ color: '#2D2D2D' }}>{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#5A5A5A' }}>Shipping</span>
                      <span style={{ color: selectedShipping?.price === 0 ? '#FF6B8B' : '#2D2D2D' }}>
                        {selectedShipping?.price === 0 ? t('free') : formatCurrency(selectedShipping?.price || 0)}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg" style={{ color: '#2D2D2D' }}>{t('total')}</span>
                        <span className="text-2xl" style={{ color: '#2D2D2D' }}>
                          {formatCurrency(finalTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'paypal' && paypalLoaded ? (
                    <div className="space-y-3 mt-6">
                      <Button
                        type="button"
                        onClick={handlePayPalPayment}
                        disabled={isProcessingPayment}
                        className="w-full text-white py-6 rounded-full"
                        style={{ backgroundColor: '#0070BA' }}
                      >
                        {isProcessingPayment ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing PayPal...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <WalletIcon className="w-5 h-5" />
                            Pay with PayPal
                          </div>
                        )}
                      </Button>
                      <p className="text-xs text-center" style={{ color: '#5A5A5A' }}>
                        You'll receive payment confirmation within 24 hours
                      </p>
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isProcessingPayment}
                      className="w-full text-white py-6 rounded-full mt-6"
                      style={{ backgroundColor: '#FF6B8B' }}
                    >
                      {isProcessingPayment ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        paymentMethod === 'bank-transfer'
                          ? `${t('placeOrder')} - Pay in IDR (Bank Transfer)`
                          : t('placeOrder')
                      )}
                    </Button>
                  )}
                  {paymentMethod === 'bank-transfer' && (
                    <div className="mt-3 text-xs text-gray-600">
                      <p>All amounts are converted to Indonesian Rupiah (IDR) at an exchange rate of 1 USD = {exchangeRate.toLocaleString()} IDR.</p>
                      <p className="mt-1">Displayed totals and order will include the IDR equivalent.</p>
                    </div>
                  )}
                  
                  <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: '#F0F9FF' }}>
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#3B82F6' }} />
                      <p className="text-xs" style={{ color: '#5A5A5A' }}>
                        Secure checkout. Payment confirmation will be sent to your email within 24 hours.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}