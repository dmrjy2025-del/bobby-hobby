import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { SearchDialog } from './SearchDialog';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Separator } from './ui/separator';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Switch } from './ui/switch';
import { 
  ShoppingBagIcon, 
  SearchIcon, 
  UserIcon, 
  ChevronDownIcon, 
  MenuIcon, 
  LanguagesIcon,
  HomeIcon,
  ShoppingCartIcon,
  TagIcon,
  SparklesIcon,
  ClockIcon
} from './icons/Icons';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsShopOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsShopOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSearchProductClick = (productName: string) => {
    // Navigate to catalog and could pass search query
    onNavigate('catalog');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <button onClick={() => handleNavigation('home')} className="flex items-center gap-2">
                <img 
                  src="https://images.unsplash.com/vector-1760954736436-4d09584c21cd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1160" 
                  alt="Bobby Hobby Logo" 
                  className="w-8 h-8 md:w-10 md:h-10 object-contain"
                />
                <span className="text-xl md:text-2xl" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#beb0d2' }}>
                  Bobby Hobby
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => handleNavigation('home')} 
                className="hover:opacity-70 transition-opacity" 
                style={{ color: currentPage === 'home' ? '#FF6B8B' : '#5A5A5A' }}
              >
                {t('home')}
              </button>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsShopOpen(!isShopOpen)}
                  className="flex items-center gap-1 hover:opacity-70 transition-opacity" 
                  style={{ color: '#5A5A5A' }}
                >
                  {t('shop')}
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${isShopOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isShopOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                    <button 
                      onClick={() => handleNavigation('catalog')} 
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors" 
                      style={{ color: '#5A5A5A' }}
                    >
                      {t('allProducts')}
                    </button>
                    <button 
                      onClick={() => handleNavigation('new-arrivals')} 
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors" 
                      style={{ color: '#5A5A5A' }}
                    >
                      {t('newArrivals')}
                    </button>
                    <button 
                      onClick={() => handleNavigation('sale')} 
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors" 
                      style={{ color: '#5A5A5A' }}
                    >
                      {t('sale')}
                    </button>
                    <button 
                      onClick={() => handleNavigation('coming-soon')} 
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors" 
                      style={{ color: '#5A5A5A' }}
                    >
                      {t('comingSoon')}
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => handleNavigation('catalog')} 
                className="hover:opacity-70 transition-opacity" 
                style={{ color: currentPage === 'catalog' ? '#FF6B8B' : '#5A5A5A' }}
              >
                {t('allProducts')}
              </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:opacity-70 transition-opacity" 
                style={{ color: '#5A5A5A' }}
              >
                <SearchIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleNavigation('account')}
                className="hidden md:block p-2 hover:opacity-70 transition-opacity relative" 
                style={{ color: user || isAdmin ? '#FF6B8B' : '#5A5A5A' }}
              >
                <UserIcon className="w-5 h-5" />
                {user && !isAdmin && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#FF6B8B' }}></span>
                )}
              </button>
              {/* Desktop Logout placed in navbar actions (moved from UserAccountPage) */}
              {user && !isAdmin && (
                <Button
                  onClick={() => {
                    logout();
                    handleNavigation('home');
                  }}
                  variant="outline"
                  className="hidden md:inline-flex ml-2 rounded-full"
                >
                  Logout
                </Button>
              )}
              <button 
                onClick={() => handleNavigation('cart')}
                className="p-2 hover:opacity-70 transition-opacity relative" 
                style={{ color: '#5A5A5A' }}
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {totalItems > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                    style={{ backgroundColor: '#FF6B8B' }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Language Toggle Desktop - Right corner */}
              <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                <LanguagesIcon className="w-4 h-4" style={{ color: '#5A5A5A' }} />
                <span className="text-sm" style={{ color: '#5A5A5A' }}>
                  {language === 'en' ? 'EN' : 'ID'}
                </span>
                <Switch
                  checked={language === 'id'}
                  onCheckedChange={toggleLanguage}
                />
              </div>

              {/* Mobile Menu Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="md:hidden p-2" style={{ color: '#5A5A5A' }}>
                    <MenuIcon className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      Navigate through Bobby Hobby
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 mt-4">
                    {/* My Account Section - Top of mobile menu */}
                    <div className="pb-4 border-b">
                      <p className="text-xs mb-3" style={{ color: '#5A5A5A' }}>MY ACCOUNT</p>
                      {user || isAdmin ? (
                        <div>
                          <button 
                            onClick={() => handleNavigation('account')}
                            className="flex items-center gap-3 text-left hover:opacity-70 transition-opacity w-full p-3 rounded-lg hover:bg-gray-50" 
                            style={{ color: '#2D2D2D' }}
                          >
                            <UserIcon className="w-5 h-5" style={{ color: '#FF6B8B' }} />
                            <span>{t('myAccount')}</span>
                          </button>
                          {/* Mobile logout inside menu under My Account */}
                          {user && (
                            <button
                              onClick={() => {
                                logout();
                                handleNavigation('home');
                              }}
                              className="w-full text-left mt-2 p-3 rounded-lg hover:bg-gray-50 text-sm"
                              style={{ color: '#d14343' }}
                            >
                              Logout
                            </button>
                          )}
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleNavigation('login')}
                          className="flex items-center gap-3 text-left hover:opacity-70 transition-opacity w-full p-3 rounded-lg hover:bg-gray-50" 
                          style={{ color: '#2D2D2D' }}
                        >
                          <UserIcon className="w-5 h-5" style={{ color: '#FF6B8B' }} />
                          <span>Login</span>
                        </button>
                      )}
                    </div>

                    {/* Language Toggle Mobile */}
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div className="flex items-center gap-2">
                        <LanguagesIcon className="w-5 h-5" style={{ color: '#5A5A5A' }} />
                        <span style={{ color: '#2D2D2D' }}>
                          {language === 'en' ? 'English' : 'Indonesian'}
                        </span>
                      </div>
                      <Switch
                        checked={language === 'id'}
                        onCheckedChange={toggleLanguage}
                      />
                    </div>

                    {/* Navigation Menu */}
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleNavigation('home')} 
                        className="flex items-center gap-3 text-left hover:opacity-70 transition-opacity p-3 rounded-lg hover:bg-gray-50" 
                        style={{ color: currentPage === 'home' ? '#FF6B8B' : '#2D2D2D' }}
                      >
                        <HomeIcon className="w-5 h-5" />
                        {t('home')}
                      </button>
                      
                      <button 
                        onClick={() => handleNavigation('catalog')} 
                        className="flex items-center gap-3 text-left hover:opacity-70 transition-opacity p-3 rounded-lg hover:bg-gray-50" 
                        style={{ color: currentPage === 'catalog' ? '#FF6B8B' : '#2D2D2D' }}
                      >
                        <ShoppingCartIcon className="w-5 h-5" />
                        {t('allProducts')}
                      </button>

                      <button 
                        onClick={() => handleNavigation('new-arrivals')} 
                        className="flex items-center gap-3 text-left hover:opacity-70 transition-opacity p-3 rounded-lg hover:bg-gray-50" 
                        style={{ color: currentPage === 'new-arrivals' ? '#FF6B8B' : '#2D2D2D' }}
                      >
                        <SparklesIcon className="w-5 h-5" />
                        {t('newArrivals')}
                      </button>

                      <button 
                        onClick={() => handleNavigation('sale')} 
                        className="flex items-center gap-3 text-left hover:opacity-70 transition-opacity p-3 rounded-lg hover:bg-gray-50" 
                        style={{ color: currentPage === 'sale' ? '#FF6B8B' : '#2D2D2D' }}
                      >
                        <TagIcon className="w-5 h-5" />
                        {t('sale')}
                      </button>

                      <button 
                        onClick={() => handleNavigation('coming-soon')} 
                        className="flex items-center gap-3 text-left hover:opacity-70 transition-opacity p-3 rounded-lg hover:bg-gray-50" 
                        style={{ color: currentPage === 'coming-soon' ? '#FF6B8B' : '#2D2D2D' }}
                      >
                        <ClockIcon className="w-5 h-5" />
                        {t('comingSoon')}
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog 
        open={isSearchOpen} 
        onOpenChange={setIsSearchOpen}
        onProductClick={handleSearchProductClick}
      />
    </>
  );
}