import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCategories } from '../contexts/CategoryContext';

interface ProductCategorySectionProps {
  onNavigate: (page: string, categoryFilter?: string) => void;
}

export function ProductCategorySection({ onNavigate }: ProductCategorySectionProps) {
  const { t } = useLanguage();
  const { categories } = useCategories();
  
  const handleCategoryClick = (categoryName: string) => {
    // Navigate to catalog with category filter
    onNavigate('catalog', categoryName);
  };

  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#d3d6e6' }}>
      <div className="container mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl text-center mb-4"
          style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}
        >
          Product Category
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12"
          style={{ color: '#5A5A5A' }}
        >
          Discover collections from various categories
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl p-8 flex items-center justify-center aspect-square cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-sm" style={{ color: '#2D2D2D' }}>
                  {category.name}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
