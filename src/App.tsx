import { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { CatalogPage } from './components/CatalogPage';
import { NewArrivalsPage } from './components/NewArrivalsPage';
import { SalePage } from './components/SalePage';
import { ComingSoonPage } from './components/ComingSoonPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { LoginPage } from './components/LoginPage';
import { UserAccountPage } from './components/UserAccountPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProductsPage } from './components/admin/AdminProductsPage';
import { AdminOrdersPage } from './components/admin/AdminOrdersPage';
import { AdminUsersPage } from './components/admin/AdminUsersPage';
import { AdminSettingsPage } from './components/admin/AdminSettingsPage';
import { Footer } from './components/Footer';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProductProvider } from './contexts/ProductContext';
import { OrderProvider } from './contexts/OrderContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState('home');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [adminView, setAdminView] = useState<'dashboard' | 'products' | 'orders' | 'users' | 'settings'>('dashboard');
  const [orderConfirmationId, setOrderConfirmationId] = useState<string | null>(null);
  const [orderConfirmationTotalIDR, setOrderConfirmationTotalIDR] = useState<number | null>(null);
  const { user, isAdmin, logout } = useAuth();

  const handleNavigate = (page: string, category?: string) => {
    // Check if navigating to order confirmation
    if (page.startsWith('order-confirmation')) {
      const urlParams = page.split('?')[1];
      if (urlParams) {
        const params = new URLSearchParams(urlParams);
        const orderId = params.get('orderId');
        const totalIDRParam = params.get('totalIDR');
        const totalIDR = totalIDRParam ? Number(totalIDRParam) : null;
        if (orderId) {
          setOrderConfirmationId(orderId);
          setOrderConfirmationTotalIDR(totalIDR);
          setCurrentPage('order-confirmation');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
    }

    // Check if user is trying to access account page
    if (page === 'account' && !user && !isAdmin) {
      setCurrentPage('login');
      return;
    }

    // If admin tries to go to account, redirect to admin panel
    if (page === 'account' && isAdmin) {
      setCurrentPage('admin');
      setAdminView('dashboard');
      return;
    }

    // If navigating to home from admin panel, keep admin logged in
    if (page === 'home' && isAdmin) {
      setCurrentPage('home');
      if (category) {
        setCategoryFilter(category);
      } else {
        setCategoryFilter(null);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page.startsWith('product-detail-')) {
      const productId = page.replace('product-detail-', '');
      setPreviousPage(currentPage);
      setSelectedProductId(productId);
      setCurrentPage('product-detail');
    } else {
      setCurrentPage(page);
      if (category) {
        setCategoryFilter(category);
      } else {
        setCategoryFilter(null);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromProduct = () => {
    setCurrentPage(previousPage);
    setSelectedProductId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (isAdminLogin: boolean) => {
    if (isAdminLogin) {
      setCurrentPage('admin');
      setAdminView('dashboard');
    } else {
      setCurrentPage('account');
    }
    // Clear category filter when logging in
    setCategoryFilter(null);
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
    setCategoryFilter(null);
    setSelectedProductId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSite = () => {
    setCurrentPage('home');
  };

  // Login Page
  if (currentPage === 'login' && !user && !isAdmin) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setCurrentPage('home')}
      />
    );
  }

  // Admin Panel
  if (currentPage === 'admin' && isAdmin) {
    return (
      <AdminLayout
        currentView={adminView}
        onViewChange={setAdminView}
        onBackToSite={handleBackToSite}
      >
        {adminView === 'dashboard' && <AdminDashboard />}
        {adminView === 'products' && <AdminProductsPage />}
        {adminView === 'orders' && <AdminOrdersPage />}
        {adminView === 'users' && <AdminUsersPage />}
        {adminView === 'settings' && <AdminSettingsPage />}
      </AdminLayout>
    );
  }

  // User Account Page
  if (currentPage === 'account' && user && !isAdmin) {
    return (
      <>
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        <UserAccountPage onNavigate={handleNavigate} onLogout={handleLogout} />
        <Footer />
        <Toaster position="top-center" />
      </>
    );
  }

  // Order Confirmation Page
  if (currentPage === 'order-confirmation' && orderConfirmationId) {
    return (
      <>
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        <OrderConfirmationPage orderId={orderConfirmationId} totalIDR={orderConfirmationTotalIDR ?? undefined} onNavigate={handleNavigate} />
        <Footer />
        <Toaster position="top-center" />
      </>
    );
  }

  // Regular site
  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main>
        {currentPage === 'home' && <LandingPage onNavigate={handleNavigate} />}
        {currentPage === 'catalog' && <CatalogPage onNavigate={handleNavigate} categoryFilter={categoryFilter} />}
        {currentPage === 'new-arrivals' && <NewArrivalsPage onNavigate={handleNavigate} />}
        {currentPage === 'sale' && <SalePage onNavigate={handleNavigate} />}
        {currentPage === 'coming-soon' && <ComingSoonPage />}
        {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}
        {currentPage === 'checkout' && <CheckoutPage onNavigate={handleNavigate} />}
        {currentPage === 'product-detail' && selectedProductId && (
          <ProductDetailPage 
            productId={selectedProductId} 
            onNavigate={handleNavigate}
            onBack={handleBackFromProduct}
          />
        )}
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider>
          <CategoryProvider>
            <ProductProvider>
              <OrderProvider>
                <CartProvider>
                  <AppContent />
                </CartProvider>
              </OrderProvider>
            </ProductProvider>
          </CategoryProvider>
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}