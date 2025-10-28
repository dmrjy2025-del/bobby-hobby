import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronLeftIcon, ChevronRightIcon } from './icons/Icons';

interface Slide {
  id: number;
  image: string;
  headline: { en: string; id: string };
  subheadline: { en: string; id: string };
  cta: { en: string; id: string };
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1760481844446-230e9c6990b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=900',
    headline: { en: "Meet Bobby's Favorites", id: "Favorit Bobby" },
    subheadline: { en: 'Explore the cutest collectibles in town.', id: 'Jelajahi koleksi paling lucu di kota.' },
    cta: { en: 'Shop The Collection', id: 'Belanja Koleksi' }
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1760481844998-df62c64bf4b0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Nnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=900',
    headline: { en: 'Limited Edition Drops', id: 'Edisi Terbatas' },
    subheadline: { en: "Get them before they're gone forever.", id: "Dapatkan sebelum kehabisan stok." },
    cta: { en: "See What's New", id: "Lihat Produk Baru" }
  }
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();
  const { language } = useLanguage();
  
  // Parallax effect - image moves slower than scroll
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Parallax Background Image */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{ y }}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slides[currentSlide].image})`,
              }}
            />
          </motion.div>

          {/* Content Overlay */}
          <motion.div
            className="relative z-10 h-full flex items-center justify-center"
            style={{ opacity }}
          >
            <div className="container mx-auto px-6 text-center">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-6xl mb-4 text-white"
                style={{ fontFamily: 'Berkshire Swash, cursive' }}
              >
                {slides[currentSlide].headline[language]}
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl mb-8 text-white max-w-2xl mx-auto"
              >
                {slides[currentSlide].subheadline[language]}
              </motion.p>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Button
                  size="lg"
                  className="px-8 py-6 rounded-full text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#FF6B8B' }}
                >
                  {slides[currentSlide].cta[language]}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'w-8' : 'w-2'
            }`}
            style={{ backgroundColor: index === currentSlide ? '#FF6B8B' : 'rgba(255, 255, 255, 0.5)' }}
          />
        ))}
      </div>
    </div>
  );
}
