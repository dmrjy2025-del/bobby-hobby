import { useState } from 'react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { PackageIcon, ShoppingCartIcon, ShieldIcon, ChevronLeftIcon, SettingsIcon, UserIcon, TruckIcon, MenuIcon, XIcon } from '../icons/Icons';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentView: 'dashboard' | 'products' | 'orders' | 'users' | 'settings';
  onViewChange: (view: 'dashboard' | 'products' | 'orders' | 'users' | 'settings') => void;
  onBackToSite: () => void;
}

export function AdminLayout({ children, currentView, onViewChange, onBackToSite }: AdminLayoutProps) {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onBackToSite();
  };

  const navItems = [
    { key: 'dashboard' as const, icon: ShoppingCartIcon, label: t('dashboard') },
    { key: 'products' as const, icon: PackageIcon, label: t('products') },
    { key: 'orders' as const, icon: TruckIcon, label: t('orders') },
    { key: 'users' as const, icon: UserIcon, label: t('users') },
    { key: 'settings' as const, icon: SettingsIcon, label: t('settings') },
  ];

  const handleNavClick = (view: typeof currentView) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#d3d6e6' }}>
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <XIcon className="w-6 h-6" style={{ color: '#2D2D2D' }} />
                ) : (
                  <MenuIcon className="w-6 h-6" style={{ color: '#2D2D2D' }} />
                )}
              </button>

              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6B8B' }}>
                <ShieldIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}>
                  Bobby Hobby Admin
                </h1>
                <p className="text-xs hidden md:block" style={{ color: '#5A5A5A' }}>
                  Management Panel
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onBackToSite}
                className="rounded-full text-xs md:text-sm px-3 md:px-4"
              >
                <ChevronLeftIcon className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Back to Site</span>
              </Button>
              <Button
                onClick={handleLogout}
                className="rounded-full text-white text-xs md:text-sm px-3 md:px-4"
                style={{ backgroundColor: '#FF6B8B' }}
              >
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    currentView === item.key
                      ? 'text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  style={currentView === item.key ? { backgroundColor: '#FF6B8B' } : { color: '#2D2D2D' }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex gap-4 md:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-4 shadow-sm sticky top-24">
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => onViewChange(item.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      currentView === item.key
                        ? 'text-white'
                        : 'hover:bg-gray-100'
                    }`}
                    style={currentView === item.key ? { backgroundColor: '#FF6B8B' } : { color: '#2D2D2D' }}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}