import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

// Initial categories
const initialCategories: Category[] = [
  { id: 'cat-1', name: 'TCG', color: '#FF6B8B', icon: '🃏' },
  { id: 'cat-2', name: 'Figure', color: '#6A5AF8', icon: '🎎' },
  { id: 'cat-3', name: 'Merchandise', color: '#FFB84D', icon: '🎁' },
  { id: 'cat-4', name: 'Apparel', color: '#4ECDC4', icon: '👕' },
  { id: 'cat-5', name: 'Plush', color: '#95E1D3', icon: '🧸' },
  { id: 'cat-6', name: 'Blind Box', color: '#FF6B8B', icon: '📦' },
];

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (id: string, updatedCategory: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updatedCategory } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}
