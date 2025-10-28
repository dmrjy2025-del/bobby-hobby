import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'id';

interface Translations {
  [key: string]: {
    en: string;
    id: string;
  };
}

const translations: Translations = {
  // Header
  home: { en: 'Home', id: 'Beranda' },
  shop: { en: 'Shop', id: 'Belanja' },
  catalog: { en: 'All Products', id: 'Katalog' },
  brand: { en: 'Brand', id: 'Brand' },
  allProducts: { en: 'All Products', id: 'Semua Produk' },
  newArrivals: { en: 'New Arrivals', id: 'Produk Terbaru' },
  sale: { en: 'Sale', id: 'Diskon' },
  preOrder: { en: 'Pre-Order', id: 'Pre-Order' },
  comingSoon: { en: 'Coming Soon', id: 'Segera Hadir' },
  myAccount: { en: 'My Account', id: 'Akun Saya' },
  searchProducts: { en: 'Search products...', id: 'Cari produk...' },
  login: { en: 'Login', id: 'Masuk' },
  logout: { en: 'Logout', id: 'Keluar' },
  register: { en: 'Register', id: 'Daftar' },
  
  // Cart
  cart: { en: 'Cart', id: 'Keranjang' },
  yourCart: { en: 'Your Shopping Cart', id: 'Keranjang Belanja Anda' },
  emptyCart: { en: 'Your cart is empty', id: 'Keranjang Anda kosong' },
  continueShopping: { en: 'Continue Shopping', id: 'Lanjut Belanja' },
  proceedToCheckout: { en: 'Proceed to Checkout', id: 'Lanjut ke Pembayaran' },
  subtotal: { en: 'Subtotal', id: 'Subtotal' },
  total: { en: 'Total', id: 'Total' },
  remove: { en: 'Remove', id: 'Hapus' },
  
  // Checkout
  checkout: { en: 'Checkout', id: 'Pembayaran' },
  shippingInformation: { en: 'Shipping Information', id: 'Informasi Pengiriman' },
  paymentMethod: { en: 'Payment Method', id: 'Metode Pembayaran' },
  orderSummary: { en: 'Order Summary', id: 'Ringkasan Pesanan' },
  fullName: { en: 'Full Name', id: 'Nama Lengkap' },
  email: { en: 'Email Address', id: 'Alamat Email' },
  phone: { en: 'Phone Number', id: 'Nomor Telepon' },
  address: { en: 'Street Address', id: 'Alamat Lengkap' },
  city: { en: 'City', id: 'Kota' },
  state: { en: 'State/Province', id: 'Provinsi' },
  zipCode: { en: 'Zip Code', id: 'Kode Pos' },
  country: { en: 'Country', id: 'Negara' },
  shippingMethod: { en: 'Shipping Method', id: 'Metode Pengiriman' },
  creditCard: { en: 'Credit Card', id: 'Kartu Kredit' },
  paypal: { en: 'PayPal', id: 'PayPal' },
  placeOrder: { en: 'Place Order', id: 'Pesan Sekarang' },
  
  // Shipping options
  standardShipping: { en: 'Standard Shipping (5-7 days)', id: 'Pengiriman Standar (5-7 hari)' },
  expressShipping: { en: 'Express Shipping (2-3 days)', id: 'Pengiriman Express (2-3 hari)' },
  overnightShipping: { en: 'Overnight Shipping (1 day)', id: 'Pengiriman Kilat (1 hari)' },
  freeShipping: { en: 'Free Shipping', id: 'Gratis Ongkir' },
  
  // Product
  quickAdd: { en: 'Quick Add', id: 'Tambah Cepat' },
  addToCart: { en: 'Add to Cart', id: 'Tambah ke Keranjang' },
  addedToCart: { en: 'Added to Cart!', id: 'Ditambahkan ke Keranjang!' },
  inStock: { en: 'In Stock', id: 'Tersedia' },
  outOfStock: { en: 'Out of Stock', id: 'Stok Habis' },
  description: { en: 'Description', id: 'Deskripsi' },
  keyFeatures: { en: 'Key Features', id: 'Fitur Utama' },
  reviews: { en: 'Reviews', id: 'Ulasan' },
  customerReviews: { en: 'Customer Reviews', id: 'Ulasan Pelanggan' },
  rating: { en: 'Rating', id: 'Penilaian' },
  writeReview: { en: 'Write a Review', id: 'Tulis Ulasan' },
  verifiedPurchase: { en: 'Verified Purchase', id: 'Pembelian Terverifikasi' },
  youMayAlsoLike: { en: 'You May Also Like', id: 'Anda Mungkin Juga Suka' },
  back: { en: 'Back', id: 'Kembali' },
  
  // User Account
  myPurchases: { en: 'My Purchases', id: 'Pembelian Saya' },
  profile: { en: 'Profile', id: 'Profil' },
  addresses: { en: 'Addresses', id: 'Alamat' },
  wishlist: { en: 'Wishlist', id: 'Favorit' },
  accountSettings: { en: 'Account Settings', id: 'Pengaturan Akun' },
  orderHistory: { en: 'Order History', id: 'Riwayat Pesanan' },
  trackOrder: { en: 'Track Order', id: 'Lacak Pesanan' },
  orderDetails: { en: 'Order Details', id: 'Detail Pesanan' },
  orderStatus: { en: 'Order Status', id: 'Status Pesanan' },
  pending: { en: 'Pending', id: 'Menunggu' },
  shipping: { en: 'Shipping', id: 'Dalam Pengiriman' },
  arrived: { en: 'Arrived', id: 'Tiba' },
  completed: { en: 'Completed', id: 'Selesai' },
  cancelled: { en: 'Cancelled', id: 'Dibatalkan' },
  leaveReview: { en: 'Leave a Review', id: 'Beri Ulasan' },
  
  // Common
  price: { en: 'Price', id: 'Harga' },
  quantity: { en: 'Quantity', id: 'Jumlah' },
  search: { en: 'Search', id: 'Cari' },
  filter: { en: 'Filter', id: 'Filter' },
  sortBy: { en: 'Sort By', id: 'Urutkan' },
  free: { en: 'FREE', id: 'GRATIS' },
  save: { en: 'Save', id: 'Simpan' },
  cancel: { en: 'Cancel', id: 'Batal' },
  edit: { en: 'Edit', id: 'Ubah' },
  delete: { en: 'Delete', id: 'Hapus' },
  submit: { en: 'Submit', id: 'Kirim' },
  confirm: { en: 'Confirm', id: 'Konfirmasi' },
  close: { en: 'Close', id: 'Tutup' },
  yes: { en: 'Yes', id: 'Ya' },
  no: { en: 'No', id: 'Tidak' },
  loading: { en: 'Loading...', id: 'Memuat...' },
  
  // Footer
  aboutUs: { en: 'About Us', id: 'Tentang Kami' },
  contactUs: { en: 'Contact Us', id: 'Hubungi Kami' },
  termsOfService: { en: 'Terms of Service', id: 'Syarat & Ketentuan' },
  privacyPolicy: { en: 'Privacy Policy', id: 'Kebijakan Privasi' },
  followUs: { en: 'Follow Us', id: 'Ikuti Kami' },
  paymentMethods: { en: 'Payment Methods', id: 'Metode Pembayaran' },
  securePayment: { en: 'Secure Payment', id: 'Pembayaran Aman' },
  
  // Hero
  heroTitle: { en: 'Collect Your Dreams', id: 'Koleksi Impian Anda' },
  heroSubtitle: { en: 'Premium figures and collectibles from your favorite series', id: 'Figur dan koleksi premium dari serial favorit Anda' },
  shopNow: { en: 'Shop Now', id: 'Belanja Sekarang' },
  
  // Sections
  shopByBrand: { en: 'Shop by Brand', id: 'Belanja Berdasarkan Brand' },
  featuredProducts: { en: 'Featured Products', id: 'Produk Unggulan' },
  viewAll: { en: 'View All', id: 'Lihat Semua' },
  
  // Alerts & Messages
  paymentConfirmation: { en: 'Within 24 hours you will receive a payment confirmation email. Please check your email to confirm whether to proceed with the order.', id: 'Dalam 1x24 jam Anda akan menerima email konfirmasi pembayaran. Silakan cek email Anda untuk konfirmasi apakah akan melanjutkan pesanan atau tidak.' },
  orderPlaced: { en: 'Order Placed Successfully!', id: 'Pesanan Berhasil Dibuat!' },
  uploadTransferProof: { en: 'Upload Transfer Proof', id: 'Upload Bukti Transfer' },
  orderConfirmationPending: { en: 'Order Confirmation Pending', id: 'Konfirmasi Pesanan Menunggu' },
  orderWillBeConfirmed: { en: 'Your order will be confirmed within 1x24 hours', id: 'Pesanan Anda akan dikonfirmasi dalam 1x24 jam' },
  checkEmailForConfirmation: { en: 'Check your email for order confirmation', id: 'Cek email Anda untuk konfirmasi pesanan' },
  viewMyOrders: { en: 'View My Orders', id: 'Lihat Pesanan Saya' },
  
  // Admin
  dashboard: { en: 'Dashboard', id: 'Dasbor' },
  products: { en: 'Products', id: 'Produk' },
  orders: { en: 'Orders', id: 'Pesanan' },
  users: { en: 'Users', id: 'Pengguna' },
  settings: { en: 'Settings', id: 'Pengaturan' },
  addNewProduct: { en: 'Add New Product', id: 'Tambah Produk Baru' },
  editProduct: { en: 'Edit Product', id: 'Ubah Produk' },
  deleteProduct: { en: 'Delete Product', id: 'Hapus Produk' },
  productManagement: { en: 'Product Management', id: 'Manajemen Produk' },
  orderManagement: { en: 'Order Management', id: 'Manajemen Pesanan' },
  userManagement: { en: 'User Management', id: 'Manajemen Pengguna' },
  totalSales: { en: 'Total Sales', id: 'Total Penjualan' },
  totalOrders: { en: 'Total Orders', id: 'Total Pesanan' },
  totalProducts: { en: 'Total Products', id: 'Total Produk' },
  lowStock: { en: 'Low Stock', id: 'Stok Rendah' },
  recentOrders: { en: 'Recent Orders', id: 'Pesanan Terbaru' },
  topSellingProducts: { en: 'Top Selling Products', id: 'Produk Terlaris' },
  updateStatus: { en: 'Update Status', id: 'Perbarui Status' },
  
  // Auth
  emailAddress: { en: 'Email Address', id: 'Alamat Email' },
  password: { en: 'Password', id: 'Kata Sandi' },
  confirmPassword: { en: 'Confirm Password', id: 'Konfirmasi Kata Sandi' },
  forgotPassword: { en: 'Forgot Password?', id: 'Lupa Kata Sandi?' },
  dontHaveAccount: { en: "Don't have an account?", id: 'Belum punya akun?' },
  alreadyHaveAccount: { en: 'Already have an account?', id: 'Sudah punya akun?' },
  signInWithGoogle: { en: 'Sign in with Google', id: 'Masuk dengan Google' },
  signUpWithGoogle: { en: 'Sign up with Google', id: 'Daftar dengan Google' },
  createAccount: { en: 'Create Account', id: 'Buat Akun' },
  welcomeBack: { en: 'Welcome Back!', id: 'Selamat Datang Kembali!' },
  signInToContinue: { en: 'Sign in to continue shopping', id: 'Masuk untuk melanjutkan belanja' },
  sessionExpiring: { en: 'Session Expiring Soon', id: 'Sesi Akan Berakhir' },
  sessionExpired: { en: 'Session Expired', id: 'Sesi Berakhir' },
  pleaseLoginAgain: { en: 'Please login again to continue', id: 'Silakan masuk kembali untuk melanjutkan' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}