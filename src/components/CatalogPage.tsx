import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { motion } from "motion/react";

interface CatalogPageProps {
  onNavigate: (page: string) => void;
  categoryFilter?: string | null;
}

// Extended product data
const allProducts = [
  {
    id: 1,
    name: "PopMart Labubu V3",
    brand: "PopMart",
    price: 49.99,
    category: "Blind Box",
    image:
      "https://images.unsplash.com/photo-1708020777427-518e5c6c739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 2,
    name: "Crybaby Series 3",
    brand: "Crybaby",
    price: 39.99,
    category: "Designer Toy",
    image:
      "https://images.unsplash.com/photo-1760007418582-331b744dc60f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 3,
    name: "Instinctoy Mini Figure",
    brand: "Instinctoy",
    price: 59.99,
    category: "Limited Edition",
    image:
      "https://images.unsplash.com/photo-1671668540310-2674006ae184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 4,
    name: "The Monsters Collection",
    brand: "THE MONSTERS",
    price: 44.99,
    category: "Series",
    image:
      "https://images.unsplash.com/photo-1759680190846-d511f7ae1128?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 5,
    name: "Kawaii Dreams Figure",
    brand: "PopMart",
    price: 54.99,
    category: "Blind Box",
    image:
      "https://images.unsplash.com/photo-1759863489255-f4a960247d13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 6,
    name: "Limited Edition Vinyl",
    brand: "Instinctoy",
    price: 79.99,
    category: "Limited Edition",
    image:
      "https://images.unsplash.com/photo-1708020777427-518e5c6c739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 7,
    name: "Designer Toy Set",
    brand: "Crybaby",
    price: 89.99,
    category: "Designer Toy",
    image:
      "https://images.unsplash.com/photo-1760007418582-331b744dc60f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 8,
    name: "Collector Edition",
    brand: "Bon Ton Toys",
    price: 64.99,
    category: "Limited Edition",
    image:
      "https://images.unsplash.com/photo-1671668540310-2674006ae184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 9,
    name: "PopMart Dimoo Series",
    brand: "PopMart",
    price: 45.99,
    category: "Blind Box",
    image:
      "https://images.unsplash.com/photo-1759680190846-d511f7ae1128?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 10,
    name: "Tomtoc Adventure Pack",
    brand: "Tomtoc",
    price: 35.99,
    category: "Series",
    image:
      "https://images.unsplash.com/photo-1759863489255-f4a960247d13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 11,
    name: "Instinctoy Chaos Edition",
    brand: "Instinctoy",
    price: 99.99,
    category: "Limited Edition",
    image:
      "https://images.unsplash.com/photo-1708020777427-518e5c6c739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 12,
    name: "Crybaby Pastel Dream",
    brand: "Crybaby",
    price: 42.99,
    category: "Designer Toy",
    image:
      "https://images.unsplash.com/photo-1760007418582-331b744dc60f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 13,
    name: "Monsters Galaxy Series",
    brand: "THE MONSTERS",
    price: 52.99,
    category: "Series",
    image:
      "https://images.unsplash.com/photo-1671668540310-2674006ae184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 14,
    name: "Bon Ton Classic",
    brand: "Bon Ton Toys",
    price: 38.99,
    category: "Series",
    image:
      "https://images.unsplash.com/photo-1759680190846-d511f7ae1128?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 15,
    name: "PopMart Molly Series",
    brand: "PopMart",
    price: 47.99,
    category: "Blind Box",
    image:
      "https://images.unsplash.com/photo-1759863489255-f4a960247d13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 16,
    name: "Tomtoc Explorer",
    brand: "Tomtoc",
    price: 41.99,
    category: "Series",
    image:
      "https://images.unsplash.com/photo-1708020777427-518e5c6c739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
];

const brands = [
  "PopMart",
  "Crybaby",
  "Instinctoy",
  "THE MONSTERS",
  "Tomtoc",
  "Bon Ton Toys",
];
const categories = [
  "All",
  "TCG",
  "Figure",
  "Merchandise",
  "Apparel",
  "Plush",
  "Blind Box",
];

export function CatalogPage({ onNavigate, categoryFilter }: CatalogPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<
    string[]
  >([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<
    [number, number]
  >([0, 100]);

  // Set category filter when prop changes
  useEffect(() => {
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }
  }, [categoryFilter]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      // Search filter
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.brand
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Brand filter
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(product.brand);

      // Category filter
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      // Price filter
      const matchesPrice =
        product.price >= priceRange[0] &&
        product.price <= priceRange[1];

      return (
        matchesSearch &&
        matchesBrand &&
        matchesCategory &&
        matchesPrice
      );
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [
    searchQuery,
    selectedBrands,
    selectedCategory,
    sortBy,
    priceRange,
  ]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand],
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategory("All");
    setPriceRange([0, 100]);
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedCategory !== "All" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 100 ||
    searchQuery !== "";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F7F7F7" }}
    >
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-5xl mb-2"
            style={{
              fontFamily: "Berkshire Swash, cursive",
              color: "#2D2D2D",
            }}
          >
            All Products
          </h1>
          <p style={{ color: "#5A5A5A" }}>
            Find your favorite figure and toy collections
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: "#5A5A5A" }}
              />
              <Input
                type="text"
                placeholder="Search products or brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full border-gray-200"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 h-12 rounded-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">
                  Featured
                </SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-high">
                  Price: High to Low
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              className="h-12 rounded-full border-2 md:w-auto"
              style={{
                borderColor: "#FF6B8B",
                color: "#FF6B8B",
              }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filter
            </Button>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              {selectedBrands.map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm text-white"
                  style={{ backgroundColor: "#FF6B8B" }}
                >
                  {brand}
                  <button onClick={() => toggleBrand(brand)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedCategory !== "All" && (
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm text-white"
                  style={{ backgroundColor: "#FF6B8B" }}
                >
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("All")}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm underline"
                style={{ color: "#5A5A5A" }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-64 flex-shrink-0"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h3
                  className="mb-4"
                  style={{ color: "#2D2D2D" }}
                >
                  Filter
                </h3>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4
                    className="text-sm mb-3"
                    style={{ color: "#2D2D2D" }}
                  >
                    Category
                  </h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() =>
                          setSelectedCategory(category)
                        }
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category
                            ? "bg-pink-50"
                            : "hover:bg-gray-50"
                        }`}
                        style={{
                          color:
                            selectedCategory === category
                              ? "#FF6B8B"
                              : "#5A5A5A",
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h4
                    className="text-sm mb-3"
                    style={{ color: "#2D2D2D" }}
                  >
                    Brand
                  </h4>
                  <div className="space-y-3">
                    {brands.map((brand) => (
                      <div
                        key={brand}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(
                            brand,
                          )}
                          onCheckedChange={() =>
                            toggleBrand(brand)
                          }
                          style={{
                            borderColor:
                              selectedBrands.includes(brand)
                                ? "#FF6B8B"
                                : undefined,
                          }}
                        />
                        <Label
                          htmlFor={brand}
                          className="cursor-pointer"
                          style={{ color: "#5A5A5A" }}
                        >
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4
                    className="text-sm mb-3"
                    style={{ color: "#2D2D2D" }}
                  >
                    Price Range
                  </h4>
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "#5A5A5A" }}
                  >
                    <span>${priceRange[0]}</span>
                    <span>-</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p style={{ color: "#5A5A5A" }}>
                Showing {filteredProducts.length} products
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    brand={product.brand}
                    price={product.price}
                    image={product.image}
                    index={index}
                    onProductClick={(id) => onNavigate(`product-detail-${id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p
                  className="text-xl mb-2"
                  style={{ color: "#2D2D2D" }}
                >
                  No products found
                </p>
                <p style={{ color: "#5A5A5A" }}>
                  Try changing your filters or search keywords
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}