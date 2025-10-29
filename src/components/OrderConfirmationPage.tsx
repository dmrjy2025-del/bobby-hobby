import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { CheckCircleIcon, PackageIcon, ClockIcon, UploadIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import BackButton from './ui/BackButton';
import { useOrders } from '../contexts/OrderContext';

interface OrderConfirmationPageProps {
  onNavigate: (page: string) => void;
  orderId?: string;
  totalIDR?: number;
}

export function OrderConfirmationPage({ onNavigate, orderId, totalIDR }: OrderConfirmationPageProps) {
  const { t } = useLanguage();
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { getOrderById } = useOrders();

  // Try to load the full order if orderId provided
  const fullOrder = orderId ? getOrderById(orderId) : undefined;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!proofFile) return;
    setUploading(true);
    // TODO: Kirim file ke backend di sini
    setTimeout(() => {
      setUploading(false);
      alert('Proof of transfer uploaded successfully!');
      setProofFile(null);
    }, 1500);
  };

  // totalIDR can be passed as prop from App (avoid using useLocation() here)
  const orderTotalUSD = fullOrder ? fullOrder.total : undefined;
  const orderExchangeRate = fullOrder ? fullOrder.exchangeRate : undefined;
  // Compute totals from order details (items + shipping). If shipping isn't stored separately, derive it from order.total
  const itemsTotalUSD = fullOrder ? fullOrder.items.reduce((s, it) => s + (it.price * it.quantity), 0) : undefined;
  const shippingUSD = fullOrder && typeof itemsTotalUSD === 'number' ? Math.max(0, (fullOrder.total || 0) - itemsTotalUSD) : undefined;
  const computedTotalUSD = typeof itemsTotalUSD === 'number' && typeof shippingUSD === 'number' ? itemsTotalUSD + shippingUSD : orderTotalUSD;

  // Determine effective exchange rate: prefer stored order.exchangeRate, otherwise derive from passed totalIDR
  const displayTotalIDRProp = totalIDR ?? fullOrder?.totalIDR;
  const effectiveExchangeRate = orderExchangeRate ?? (displayTotalIDRProp && computedTotalUSD ? displayTotalIDRProp / computedTotalUSD : undefined);

  const computedTotalIDR = computedTotalUSD && effectiveExchangeRate ? Math.round(computedTotalUSD * effectiveExchangeRate) : displayTotalIDRProp;

  const formatIDR = (value?: number) => value ? `Rp ${value.toLocaleString('id-ID')}` : 'Rp 0';

  return (
    <div className="min-h-screen flex items-center justify-center py-12 relative" style={{ backgroundColor: '#d3d6e6' }}>
      {/* Back button for desktop (left outside white card) */}
      <div className="hidden md:block absolute left-6 top-1/4">
        <BackButton onClick={() => onNavigate('catalog')} className="bg-white shadow" ariaLabel="Kembali" />
      </div>

      <div className="container mx-auto px-4">
        {/* Back button for mobile (above card) */}
        <div className="block md:hidden mb-4">
          <BackButton onClick={() => onNavigate('catalog')} className="bg-white shadow" ariaLabel="Kembali" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-lg text-center"
        >
          {/* Informasi Rekening Bank */}
          <div className="mb-6 p-6 rounded-2xl" style={{ backgroundColor: '#FFF3E0', textAlign: 'left' }}>
            <h3 className="mb-2" style={{ color: '#2D2D2D' }}>
              Bank Transfer Information
            </h3>
            <div className="space-y-1 text-sm" style={{ color: '#5A5A5A' }}>
              <p><strong>Bank:</strong> Bank Mandiri</p>
              <p><strong>Account Name:</strong> Bobby Hobby Store</p>
              <p><strong>Account Number:</strong> 1234567890</p>
              <p>
                <strong>Amount to Transfer:</strong>
                <span style={{ color: '#FF6B8B', fontWeight: 600, marginLeft: 8 }}>
                  {formatIDR(computedTotalIDR)}
                </span>
              </p>
              <p className="text-xs mt-2" style={{ color: '#F57F17' }}>
                Please transfer the exact amount above. Payment in USD will be converted automatically.
              </p>
            </div>
          </div>

          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#E8F5E9' }}
          >
            <CheckCircleIcon className="w-12 h-12" style={{ color: '#4CAF50' }} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl mb-4"
            style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}
          >
            Order Placed Successfully!
          </motion.h1>

          {orderId && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm mb-6"
              style={{ color: '#5A5A5A' }}
            >
              Order ID: <span className="font-mono" style={{ color: '#FF6B8B' }}>{orderId}</span>
            </motion.p>
          )}

          {fullOrder && (
            <div className="mb-6 text-left">
              <h4 className="mb-2" style={{ color: '#2D2D2D' }}>Order Details</h4>
              <div className="space-y-3 mb-4">
                {fullOrder.items.map((item) => {
                  const itemPriceIDR = item.priceIDR ?? (effectiveExchangeRate ? Math.round(item.price * effectiveExchangeRate) : undefined);
                  const itemTotalUSD = item.price * item.quantity;
                  const itemTotalIDR = itemPriceIDR ? itemPriceIDR * item.quantity : (effectiveExchangeRate ? Math.round(itemTotalUSD * effectiveExchangeRate) : undefined);
                  return (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <div style={{ color: '#2D2D2D' }}>{item.name} x{item.quantity}</div>
                        <div style={{ color: '#5A5A5A', fontSize: 12 }}>
                          <span style={{ marginRight: 8 }}>${item.price.toFixed(2)}</span>
                          <span>{itemPriceIDR ? formatIDR(itemPriceIDR) : ''}</span>
                        </div>
                      </div>
                      <div style={{ color: '#2D2D2D' }}>
                        <div>${itemTotalUSD.toFixed(2)}</div>
                        <div style={{ fontSize: 12 }}>{itemTotalIDR ? formatIDR(itemTotalIDR) : ''}</div>
                      </div>
                    </div>
                  );
                })}
                {/* Shipping line */}
                <div className="flex items-center justify-between border-t pt-3 mt-3">
                  <div style={{ color: '#2D2D2D' }}>Shipping ({fullOrder.shippingMethod})</div>
                  <div style={{ color: '#2D2D2D' }}>
                    <div>${(fullOrder.shippingAmount ?? 0).toFixed(2)}</div>
                    <div style={{ fontSize: 12 }}>{(effectiveExchangeRate && (fullOrder.shippingAmount ?? 0) > 0) ? formatIDR(Math.round((fullOrder.shippingAmount ?? 0) * effectiveExchangeRate)) : ''}</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between border-t pt-3">
                <div style={{ color: '#5A5A5A' }}>Total</div>
                <div style={{ color: '#2D2D2D' }}>
                  <div>${(computedTotalUSD ?? fullOrder.total).toFixed(2)}</div>
                  <div style={{ fontSize: 12 }}>{computedTotalIDR ? formatIDR(computedTotalIDR) : (fullOrder.totalIDR ? formatIDR(fullOrder.totalIDR) : '')}</div>
                </div>
              </div>
              {effectiveExchangeRate && (
                <div className="text-xs text-gray-600 mt-2">Exchange Rate: 1 USD = {Number(effectiveExchangeRate).toLocaleString(undefined, { maximumFractionDigits: 4 })} IDR</div>
              )}
            </div>
          )}

          {/* Upload Proof of Transfer (moved above Pending) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-start gap-3 mb-6 p-6 rounded-2xl" style={{ backgroundColor: '#F3E5F5' }}>
              <UploadIcon className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#8E24AA' }} />
              <div className="text-left w-full">
                <h3 className="mb-2" style={{ color: '#2D2D2D' }}>
                  Upload Proof of Bank Transfer
                </h3>
                <p className="text-sm mb-3" style={{ color: '#5A5A5A' }}>
                  Please upload your bank transfer receipt here. Our team will verify your payment and send confirmation via email.
                </p>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="block mb-2"
                  disabled={uploading}
                />
                <Button
                  onClick={handleUpload}
                  className="text-white py-2 px-6 rounded-full"
                  style={{ backgroundColor: '#8E24AA' }}
                  disabled={!proofFile || uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Proof'}
                </Button>
                {proofFile && !uploading && (
                  <p className="text-xs mt-2" style={{ color: '#5A5A5A' }}>
                    Selected file: {proofFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 mb-6 p-6 rounded-2xl" style={{ backgroundColor: '#FFF9C4' }}>
              <ClockIcon className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#F57F17' }} />
              <div className="text-left">
                <h3 className="mb-2" style={{ color: '#2D2D2D' }}>
                  Order Confirmation Pending
                </h3>
                <p className="text-sm" style={{ color: '#5A5A5A' }}>
                  Your order will be confirmed within <b>2x24 hours</b> on business days (Monday to Friday).
                  We will send a payment confirmation email to verify your order details.
                  Please note, confirmation may be delayed if you order on Saturday or Sunday.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-6 rounded-2xl" style={{ backgroundColor: '#E3F2FD' }}>
              <PackageIcon className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#1976D2' }} />
              <div className="text-left">
                <h3 className="mb-2" style={{ color: '#2D2D2D' }}>
                  What's Next?
                </h3>
                <ul className="text-sm space-y-2" style={{ color: '#5A5A5A' }}>
                  <li>• Check your email for order confirmation</li>
                  <li>• We'll verify your payment within 2x24 hours (business days)</li>
                  <li>• Track your order status in "My Account"</li>
                  <li>• Your items will be packaged and shipped once confirmed</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => onNavigate('catalog')}
              className="text-white py-6 px-8 rounded-full"
              style={{ backgroundColor: '#FF6B8B' }}
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => onNavigate('account')}
              variant="outline"
              className="py-6 px-8 rounded-full border-2"
              style={{ borderColor: '#FF6B8B', color: '#FF6B8B' }}
            >
              View My Orders
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs mt-8"
            style={{ color: '#9E9E9E' }}
          >
            Need help? Contact our customer support at support@bobbyhobby.com
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
