import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ThemeSettings {
  primaryColor: string;
  neutralBackground: string;
  logo: string | null;
  favicon: string | null;
  heroImages: string[];
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (settings: Partial<ThemeSettings>) => void;
  uploadImage: (file: File) => Promise<string>;
}

const defaultSettings: ThemeSettings = {
  primaryColor: '#FF6B8B',
  neutralBackground: '#d3d6e6',
  logo: null,
  favicon: null,
  heroImages: [
    'https://images.unsplash.com/photo-1708020777427-518e5c6c739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGNvbGxlY3RpYmxlJTIwdG95JTIwZmlndXJlfGVufDF8fHx8MTc2MDM0NzA2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1760007418582-331b744dc60f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZGVzaWduZXIlMjB0b3l8ZW58MXx8fHwxNzYwMzQ3MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1671668540310-2674006ae184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHRveSUyMGZpZ3VyZXxlbnwxfHx8fDE3NjAzNDcwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  ],
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('themeSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('themeSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    // Convert file to base64 for storage
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, uploadImage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
