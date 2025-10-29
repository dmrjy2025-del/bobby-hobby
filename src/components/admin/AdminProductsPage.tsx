import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { useProducts, Product } from '../../contexts/ProductContext';
import { PlusIcon, EditIcon, TrashIcon } from '../icons/Icons';
import { Switch } from '../ui/switch';
import BackButton from '../ui/BackButton';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

export function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<any>({
    name: '',
    brand: '',
    price: 0,
    image: '',
    category: '',
    description: '',
    stock: 0,
    featured: false,
    newArrival: false,
    onSale: false,
    discount: 0,
    visible: true,
    tags: [],
    additionalImages: [],
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [errors, setErrors] = useState<any>({});

  // Admin UI state: categories, filters, search, saving
  const [categories, setCategories] = useState<string[]>(() => Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[])));
  const [newCategory, setNewCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'discount' ? parseFloat(value) || 0 : value,
    }));
    // real-time validation for required fields
    if (name === 'name' || name === 'category' || name === 'price') {
      validateField(name, value);
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: checked,
    }));
  };

  useEffect(() => {
    // keep categories in sync with current products
    setCategories(Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[])));
  }, [products]);

  const handleAddCategory = () => {
    const name = newCategory.trim();
    if (!name) return;
    if (!categories.includes(name)) {
      setCategories(prev => [name, ...prev]);
      toast.success('Kategori ditambahkan');
      setNewCategory('');
    } else {
      toast('Kategori sudah ada');
    }
  };

  const handleToggleVisibility = (id: string, next: boolean) => {
    updateProduct(id, { visible: next } as any);
    toast.success(next ? 'Product sekarang Visible' : 'Product disembunyikan');
  };

  const validateField = (name: string, value: any) => {
    setErrors((prev: any) => {
      const copy = { ...prev };
      if (name === 'name') {
        if (!value || String(value).trim() === '') copy.name = 'Nama produk wajib diisi';
        else delete copy.name;
      }
      if (name === 'price') {
        const num = Number(value);
        if (Number.isNaN(num) || num <= 0) copy.price = 'Price must be greater than 0';
        else delete copy.price;
      }
      if (name === 'category') {
        if (!value || String(value).trim() === '') copy.category = 'Kategori wajib diisi';
        else delete copy.category;
      }
      return copy;
    });
  };

  const validateAll = () => {
    validateField('name', formData.name);
    validateField('price', formData.price);
    validateField('category', formData.category);
    return Object.keys(errors).length === 0;
  };
  const filteredProducts = products.filter(p => {
    const matchesSearch = searchQuery.trim() === '' || `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || (p.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // show saving indicator and prevent double submits
    setIsSaving(true);

    (async () => {
      toast('Menyimpan Perubahan...', { id: 'saving' });
      // small simulated delay to show spinner; in real app this wraps API call
      await new Promise((r) => setTimeout(r, 600));

      if (editingProduct) {
        updateProduct(editingProduct.id, formData);
        toast.success('Perubahan disimpan ✅', { description: 'Perubahan akan muncul di semua halaman' });
        setEditingProduct(null);
      } else {
      const newProduct: any = {
          id: `product-${Date.now()}`,
          name: formData.name || '',
          brand: formData.brand || '',
          price: formData.price || 0,
          image: formData.image || '',
          category: formData.category || '',
          description: formData.description || '',
          stock: formData.stock || 0,
          featured: !!formData.featured,
          newArrival: !!formData.newArrival,
          onSale: !!formData.onSale,
          discount: formData.discount || 0,
          visible: formData.visible ?? true,
          tags: (formData.tags as any) || [],
        };
  addProduct(newProduct);
        toast.success('Produk ditambahkan 🎉', { description: 'Sekarang muncul di katalog' });
        setIsAddDialogOpen(false);
      }

      // Reset form
      setFormData({
        name: '',
        brand: '',
        price: 0,
        image: '',
        category: '',
        description: '',
        stock: 0,
        featured: false,
        newArrival: false,
        onSale: false,
        discount: 0,
        comingSoon: false,
        visible: true,
        tags: [],
      });

      // refresh categories list from products after mutation
      setIsSaving(false);
    })();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      toast.success('Product deleted successfully!');
    }
  };

  const ProductForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            required
            className="mt-2"
            
          />
        </div>
        <div>
          <Label htmlFor="brand">Brand *</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="Enter brand name"
            required
            className="mt-2"
            
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00"
            required
            className="mt-2"
            
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="0"
            className="mt-2"
            
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image">Image URL (thumbnail) *</Label>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://..."
              required
              className="mt-2"
            />
            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
          </div>
          <div className="w-24 h-24 bg-gray-50 rounded-md overflow-hidden border">
            {formData.image ? (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img src={formData.image} alt="thumbnail" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No image</div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Images Section */}
      <div>
        <Label>Additional Product Images (max 5)</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="https://..."
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => {
              const url = newImageUrl.trim();
              if (!url) return toast.error('Please provide an image URL');
              const arr = formData.additionalImages || [];
              if (arr.length >= 5) return toast.error('Maximum 5 additional images allowed');
              setFormData((prev: any) => ({ ...prev, additionalImages: [...(prev.additionalImages || []), url] }));
              setNewImageUrl('');
            }}
            className="rounded-full"
            variant="outline"
            size="sm"
          >
            Add Image
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {(formData.additionalImages || []).map((img: string, idx: number) => (
            <div key={idx} className="relative border rounded overflow-hidden">
              <img src={img} alt={`additional-${idx}`} className="w-full h-24 object-cover" />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-1 right-1"
                onClick={() => setFormData((prev: any) => ({ ...prev, additionalImages: (prev.additionalImages || []).filter((_: any, i: number) => i !== idx) }))}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="e.g., Figures, Vinyl Toys"
            className="mt-2"
            list="category-list"
            
          />
          <datalist id="category-list">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={(formData.tags as string[])?.join(', ') || ''}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, tags: e.target.value.split(',').map((s:string) => s.trim()).filter(Boolean) }))}
            placeholder="e.g., limited, collectible"
            className="mt-2"
            list="tags-list"
          />
          <datalist id="tags-list">
            {Array.from(new Set(products.flatMap(p => (p as any).tags || []))).map(tag => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
        </div>

      <div>
        <Label htmlFor="description">Description (Rich text)</Label>
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={(e: any) => setFormData((prev: any) => ({ ...prev, description: e.currentTarget.innerHTML }))}
          className="mt-2 min-h-[120px] border rounded p-3 prose max-w-full"
          dangerouslySetInnerHTML={{ __html: formData.description || '' }}
        />
        <p className="text-xs text-gray-500 mt-1">Supports basic formatting. Use the editor to style description.</p>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 style={{ color: '#2D2D2D' }}>Display Options</h4>
        <p className="text-sm" style={{ color: '#5A5A5A' }}>
          Select where this product should appear (you can select multiple)
        </p>
        
  <div className="grid md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked: boolean | 'indeterminate') => handleCheckboxChange('featured', Boolean(checked))}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Featured Product (Homepage)
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <Checkbox
              id="newArrival"
              checked={formData.newArrival}
              onCheckedChange={(checked: boolean | 'indeterminate') => handleCheckboxChange('newArrival', Boolean(checked))}
            />
            <Label htmlFor="newArrival" className="cursor-pointer">
              New Arrivals Page
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <Checkbox
              id="onSale"
              checked={formData.onSale}
              onCheckedChange={(checked: boolean | 'indeterminate') => handleCheckboxChange('onSale', Boolean(checked))}
            />
            <Label htmlFor="onSale" className="cursor-pointer">
              Special Discount / Sale Page
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <Checkbox
              id="comingSoon"
              checked={formData.comingSoon}
              onCheckedChange={(checked: boolean | 'indeterminate') => handleCheckboxChange('comingSoon', Boolean(checked))}
            />
            <Label htmlFor="comingSoon" className="cursor-pointer">
              Coming Soon Page
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3">
          <Switch
            id="visible"
            checked={!!formData.visible}
            onCheckedChange={(val: boolean) => setFormData((prev: any) => ({ ...prev, visible: val }))}
          />
          <Label htmlFor="visible">Tampilkan di Katalog</Label>
        </div>

        {formData.onSale && (
          <div className="mt-3">
            <Label htmlFor="discount">Discount Percentage (%)</Label>
              <Input
              id="discount"
              name="discount"
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={handleInputChange}
              placeholder="e.g., 20"
              className="mt-2"
              
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full text-white py-6 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#FF6B8B' }}
        disabled={isSaving}
      >
        {isSaving && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
        {editingProduct ? (isSaving ? 'Menyimpan...' : 'Update Product') : (isSaving ? 'Menyimpan...' : 'Add Product')}
      </Button>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton admin fallback="/admin" onClick={() => undefined} />
          <div>
            <h1 className="text-3xl mb-2" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}>
              Product Management
            </h1>
            <p style={{ color: '#5A5A5A' }}>
              Manage your product catalog
            </p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="text-white rounded-full"
              style={{ backgroundColor: '#FF6B8B' }}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new product to your catalog
              </DialogDescription>
            </DialogHeader>
            <ProductForm />
          </DialogContent>
        </Dialog>
      
        {/* Filters & Category management */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search products by name, brand or category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="border rounded-md px-3 py-2">
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Input placeholder="New category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-44" />
            <Button onClick={handleAddCategory} className="rounded-full" variant="outline" size="sm">
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <p className="text-xs mb-1" style={{ color: '#FF6B8B' }}>
                  {product.brand}
                </p>
                <h3 className="mb-2" style={{ color: '#2D2D2D' }}>
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xl" style={{ color: '#2D2D2D' }}>
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-sm" style={{ color: '#5A5A5A' }}>
                    Stock: {product.stock || 0}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.featured && (
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                      Featured
                    </span>
                  )}
                  {product.newArrival && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      New
                    </span>
                  )}
                  {product.onSale && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Sale {product.discount}%
                    </span>
                  )}
                  {product.comingSoon && (
                    <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                      Coming Soon
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="icon"
                        size="circle"
                        aria-label={`Edit ${product.name}`}
                        onClick={() => handleEdit(product)}
                        className="btn-icon-shadow"
                      >
                        <EditIcon className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                          Update product details
                        </DialogDescription>
                      </DialogHeader>
                      <ProductForm />
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    className={`${(product as any).visible ? 'bg-green-50 text-green-700 border-green-200' : 'text-gray-600'} rounded-full`}
                    onClick={() => handleToggleVisibility(product.id, !(product as any).visible)}
                  >
                    {(product as any).visible ? 'Visible' : 'Hidden'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-red-500 border-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(product.id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
