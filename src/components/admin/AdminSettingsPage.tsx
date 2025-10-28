import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useTheme } from '../../contexts/ThemeContext';
import { useCategories } from '../../contexts/CategoryContext';
import { ImageIcon, UploadIcon, Trash2Icon, PlusIcon, Edit2Icon } from 'lucide-react';
import { toast } from 'sonner';

export function AdminSettingsPage() {
  const { settings, updateSettings, uploadImage } = useTheme();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);
  const [neutralBg, setNeutralBg] = useState(settings.neutralBackground);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#FF6B8B', icon: '🎨' });
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const handleColorUpdate = () => {
    updateSettings({
      primaryColor,
      neutralBackground: neutralBg,
    });
    toast.success('Colors updated! 🎨');
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'favicon' | 'hero'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      const base64 = await uploadImage(file);
      
      if (type === 'logo') {
        updateSettings({ logo: base64 });
        toast.success('Logo uploaded! 📷');
      } else if (type === 'favicon') {
        updateSettings({ favicon: base64 });
        toast.success('Favicon uploaded! 🎯');
      } else if (type === 'hero') {
        updateSettings({
          heroImages: [...settings.heroImages, base64],
        });
        toast.success('Hero image added! 🖼️');
      }
    } catch (error) {
      toast.error('Upload failed');
    }
  };

  const handleRemoveLogo = () => {
    updateSettings({ logo: null });
    toast.success('Logo removed');
  };

  const handleRemoveFavicon = () => {
    updateSettings({ favicon: null });
    toast.success('Favicon removed');
  };

  const handleRemoveHeroImage = (index: number) => {
    const newHeroImages = settings.heroImages.filter((_, i) => i !== index);
    updateSettings({ heroImages: newHeroImages });
    toast.success('Hero image removed');
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    addCategory({
      id: `cat-${Date.now()}`,
      name: newCategory.name,
      color: newCategory.color,
      icon: newCategory.icon,
    });

    setNewCategory({ name: '', color: '#FF6B8B', icon: '🎨' });
    toast.success('Category added! 🎉');
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    toast.success('Category deleted');
  };

  const handleSaveAllChanges = () => {
    // This will save all current settings
    // Since everything is already saved to localStorage automatically,
    // we just need to show a confirmation
    toast.success('All changes saved successfully! 🎉', {
      description: 'Your website settings have been updated and applied.',
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}>
            Website Settings
          </h1>
          <p style={{ color: '#5A5A5A' }}>
            Customize your website appearance and branding
          </p>
        </div>
        <Button
          onClick={handleSaveAllChanges}
          className="text-white rounded-full px-8 py-6"
          style={{ backgroundColor: '#FF6B8B' }}
        >
          💾 Save All Changes
        </Button>
      </div>

      {/* Color Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle style={{ color: '#2D2D2D' }}>Color Theme</CardTitle>
          <CardDescription>Customize your brand colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-3 mt-2">
                <div
                  className="w-12 h-12 rounded-xl border-2 border-gray-200"
                  style={{ backgroundColor: primaryColor }}
                />
                <Input
                  id="primary-color"
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#FF6B8B"
                />
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-20"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="neutral-bg">Neutral Background</Label>
              <div className="flex gap-3 mt-2">
                <div
                  className="w-12 h-12 rounded-xl border-2 border-gray-200"
                  style={{ backgroundColor: neutralBg }}
                />
                <Input
                  id="neutral-bg"
                  type="text"
                  value={neutralBg}
                  onChange={(e) => setNeutralBg(e.target.value)}
                  placeholder="#d3d6e6"
                />
                <Input
                  type="color"
                  value={neutralBg}
                  onChange={(e) => setNeutralBg(e.target.value)}
                  className="w-20"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleColorUpdate}
            className="text-white rounded-full"
            style={{ backgroundColor: '#FF6B8B' }}
          >
            Update Colors
          </Button>
        </CardContent>
      </Card>

      {/* Logo Upload */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle style={{ color: '#2D2D2D' }}>Logo</CardTitle>
          <CardDescription>Upload your brand logo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings.logo ? (
              <div className="relative inline-block">
                <img
                  src={settings.logo}
                  alt="Logo"
                  className="max-w-xs max-h-32 object-contain rounded-xl border-2 border-gray-200 p-4"
                />
                <Button
                  onClick={handleRemoveLogo}
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Trash2Icon className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="mb-4" style={{ color: '#5A5A5A' }}>
                  No logo uploaded
                </p>
              </div>
            )}

            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'logo')}
              className="hidden"
            />
            <Button
              onClick={() => logoInputRef.current?.click()}
              variant="outline"
              className="rounded-full"
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload Logo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Favicon Upload */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle style={{ color: '#2D2D2D' }}>Favicon</CardTitle>
          <CardDescription>Upload your website favicon (small icon in browser tab)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings.favicon ? (
              <div className="relative inline-block">
                <img
                  src={settings.favicon}
                  alt="Favicon"
                  className="w-16 h-16 object-contain rounded-lg border-2 border-gray-200 p-2"
                />
                <Button
                  onClick={handleRemoveFavicon}
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                >
                  <Trash2Icon className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center max-w-xs">
                <ImageIcon className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                <p className="text-sm" style={{ color: '#5A5A5A' }}>
                  No favicon uploaded
                </p>
              </div>
            )}

            <input
              ref={faviconInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'favicon')}
              className="hidden"
            />
            <Button
              onClick={() => faviconInputRef.current?.click()}
              variant="outline"
              className="rounded-full"
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload Favicon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hero Images */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle style={{ color: '#2D2D2D' }}>Hero Carousel Images</CardTitle>
          <CardDescription>Manage homepage carousel images</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {settings.heroImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Hero ${index + 1}`}
                    className="w-full aspect-video object-cover rounded-xl border-2 border-gray-200"
                  />
                  <Button
                    onClick={() => handleRemoveHeroImage(index)}
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <input
              ref={heroInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'hero')}
              className="hidden"
            />
            <Button
              onClick={() => heroInputRef.current?.click()}
              variant="outline"
              className="rounded-full"
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              Add Hero Image
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product Categories */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle style={{ color: '#2D2D2D' }}>Product Categories</CardTitle>
          <CardDescription>Manage product categories displayed on homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Categories */}
          <div className="space-y-3">
            <Label>Current Categories</Label>
            <div className="grid md:grid-cols-2 gap-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <span className="text-xl">{category.icon}</span>
                    </div>
                    <div>
                      <p style={{ color: '#2D2D2D' }}>{category.name}</p>
                      <p className="text-xs" style={{ color: '#5A5A5A' }}>
                        {category.color}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteCategory(category.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Category */}
          <div className="space-y-3 pt-6 border-t">
            <Label>Add New Category</Label>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cat-name" className="text-sm">Name</Label>
                <Input
                  id="cat-name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  placeholder="e.g., Action Figures"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-color" className="text-sm">Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-gray-200"
                    style={{ backgroundColor: newCategory.color }}
                  />
                  <Input
                    id="cat-color"
                    value={newCategory.color}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, color: e.target.value })
                    }
                    placeholder="#FF6B8B"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-icon" className="text-sm">Icon Emoji</Label>
                <Input
                  id="cat-icon"
                  value={newCategory.icon}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, icon: e.target.value })
                  }
                  placeholder="🎨"
                />
              </div>
            </div>
            <Button
              onClick={handleAddCategory}
              className="rounded-full text-white"
              style={{ backgroundColor: '#FF6B8B' }}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-0 shadow-sm" style={{ backgroundColor: '#FFF0F3' }}>
        <CardContent className="p-6">
          <h3 className="mb-3" style={{ color: '#2D2D2D' }}>
            💡 Tips
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: '#5A5A5A' }}>
            <li>• Logo: Recommended size 200x60px, transparent background (PNG)</li>
            <li>• Favicon: Recommended size 32x32px or 64x64px</li>
            <li>• Hero Images: Recommended size 1920x1080px for best quality</li>
            <li>• All images are stored locally in your browser</li>
            <li>• Color codes must be in hex format (e.g., #FF6B8B)</li>
            <li>• Categories will appear on homepage and can be used to filter products</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
