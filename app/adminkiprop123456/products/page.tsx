'use client';

import { useEffect, useState } from "react";
import { Edit,Image, Trash2, Plus, Filter, Search, ArrowUp, ArrowDown, Lightbulb, Calendar, X, Save, Tag, PlusCircle, DollarSign, Focus } from "lucide-react";
import CategoryDropdown from "../components/CategoryDropdown";
const API_BASE = "http://127.0.0.1:5555";

type Category = "bags" | "tshirts" | "hoodies";

interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  image: string;
  inspiration: string;
  created_at?: string; // Assuming your API returns this
}

const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: "name" | "price" | "created_at";
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "bags" as Category,
    price: "",
    image: "",
    inspiration: ""
  });

  const fetchAllProducts = async () => {
    try {
      const [bagsRes, tshirtsRes, hoodiesRes] = await Promise.all([
        fetch(`${API_BASE}/all_bags`),
        fetch(`${API_BASE}/all_tshirts`),
        fetch(`${API_BASE}/all_hoodies`)
      ]);

      const [bags, tshirts, hoodies] = await Promise.all([
        bagsRes.json(),
        tshirtsRes.json(),
        hoodiesRes.json()
      ]);

      const formatted = [
        ...bags.map((b: any) => ({ ...b, category: "bags" })),
        ...tshirts.map((t: any) => ({ ...t, category: "tshirts" })),
        ...hoodies.map((h: any) => ({ ...h, category: "hoodies" }))
      ];

      setProducts(formatted);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete ${product.name}?`)) return;
    
    try {
      const response = await fetch(`${API_BASE}/${product.category}/${product.id}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        fetchAllProducts();
      } else {
        console.error("Delete failed with status:", response.status);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      image: product.image,
      inspiration: product.inspiration
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      image: formData.image,
      inspiration: formData.inspiration
    };

    try {
      let response;
      if (editingProduct) {
        response = await fetch(`${API_BASE}/${formData.category}/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${API_BASE}/${formData.category}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        resetForm();
        fetchAllProducts();
      } else {
        console.error("Submit failed with status:", response.status);
      }
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  const resetForm = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "bags",
      price: "",
      image: "",
      inspiration: ""
    });
  };

  const requestSort = (key: "name" | "price" | "created_at") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedProducts = () => {
    const sortableProducts = [...products];
    if (sortConfig.key) {
      sortableProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  };

  const filteredProducts = () => {
    let result = getSortedProducts();
    
    // Apply category filter
    if (filter !== "all") {
      result = result.filter(p => p.category === filter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.inspiration.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    return result;
  };

  const sortedAndFilteredProducts = filteredProducts();

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-red-600 underline underline-offset-4">Products</h1>
          <p className="text-gray-500">Manage your entire collection</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="border pl-10 pr-4 py-2 rounded-md border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CategoryDropdown
            value={filter}
            onChange={(value) => setFilter(value)}
            // className="border px-3 py-2 rounded border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
          />
          {/* <select
            className="border px-3 py-2 rounded border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | Category)}
          >
            <option value="all">All Categories</option>
            <option value="bags">Bags</option>
            <option value="tshirts">T-Shirts</option>
            <option value="hoodies">Hoodies</option>
          </select> */}
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsDialogOpen(true);
            }}
            className="bg-black text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Sorting controls */}
      <div className="flex flex-wrap gap-3 items-center">
  <span className="font-semibold text-red-600">Sort by:</span>
  
  {/* Name Sort Button */}
  <button
    onClick={() => requestSort("name")}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
      sortConfig.key === "name"
        ? "bg-gray-100 border-gray-300 text-gray-900 shadow-sm"
        : "border-transparent text-gray-600 hover:bg-gray-50"
    }`}
  >
    <span>Name</span>
    {sortConfig.key === "name" && (
      sortConfig.direction === "asc" 
        ? <ArrowUp size={16} className="text-gray-700" />
        : <ArrowDown size={16} className="text-gray-700" />
    )}
  </button>

  {/* Price Sort Button */}
  <button
    onClick={() => requestSort("price")}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
      sortConfig.key === "price"
        ? "bg-gray-100 border-gray-300 text-gray-900 shadow-sm"
        : "border-transparent text-gray-600 hover:bg-gray-50"
    }`}
  >
    <span>Price</span>
    {sortConfig.key === "price" && (
      sortConfig.direction === "asc" 
        ? <ArrowUp size={16} className="text-gray-700" />
        : <ArrowDown size={16} className="text-gray-700" />
    )}
  </button>

  {/* Date Added Sort Button - Now with both directions */}
  <div className="flex items-center gap-0.5 rounded-lg border border-gray-300 overflow-hidden">
    <button
      onClick={() => requestSort("created_at")}
      className={`px-3 py-1.5 transition-all ${
        sortConfig.key === "created_at"
          ? "bg-gray-100 text-gray-900"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <span>Date Added</span>
    </button>
    <div className="flex flex-col border-l border-gray-300">
      <button
        onClick={() => {
          if (sortConfig.key !== "created_at" || sortConfig.direction !== "asc") {
            setSortConfig({ key: "created_at", direction: "asc" });
          }
        }}
        className={`p-1 transition-all ${
          sortConfig.key === "created_at" && sortConfig.direction === "asc"
            ? "bg-gray-100 text-gray-900"
            : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
        }`}
      >
        <ArrowUp size={14} />
      </button>
      <button
        onClick={() => {
          if (sortConfig.key !== "created_at" || sortConfig.direction !== "desc") {
            setSortConfig({ key: "created_at", direction: "desc" });
          }
        }}
        className={`p-1 transition-all ${
          sortConfig.key === "created_at" && sortConfig.direction === "desc"
            ? "bg-gray-100 text-gray-900"
            : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
        }`}
      >
        <ArrowDown size={14} />
      </button>
    </div>
  </div>
</div>

      {/* Products Grid */}
      {sortedAndFilteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
  {sortedAndFilteredProducts.map((product) => (
    <div 
      key={`${product.category}-${product.id}`} 
      className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      {/* Product Image with Overlay */}
      <div className="relative overflow-hidden h-56">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800 shadow-sm capitalize">
          {product.category}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{product.name}</h3>
          <p className="text-lg font-bold text-red-600 whitespace-nowrap ml-2">
            Ksh {product.price.toLocaleString()}
          </p>
        </div>

        {/* Inspiration with icon */}
        {product.inspiration && (
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <Lightbulb className="w-4 h-4 mr-1 text-yellow-500" />
            <span className="italic line-clamp-1">{product.inspiration}</span>
          </div>
        )}

        {/* Date Added with icon */}
        {product.created_at && (
          <div className="mt-3 flex items-center text-xs text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Added {new Date(product.created_at).toLocaleDateString()}</span>
          </div>
        )}

        {/* Action Buttons - Shown on hover */}
        <div className="mt-4 flex justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => handleEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-black  text-white rounded-lg hover:bg-white hover:text-black hover:border border-black transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm">Edit</span>
          </button>
          <button
            onClick={() => handleDelete(product)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">Delete</span>
          </button>
        </div>

        {/* Fallback buttons for mobile touch */}
        <div className="mt-4 flex justify-between gap-2 group-hover:hidden">
          <button
            onClick={() => handleEdit(product)}
            className="p-2 text-black hover:bg-red-50 rounded-full transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(product)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria</p>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isDialogOpen && (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div 
      className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with icon */}
      <div className="border-b p-5 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          {editingProduct ? (
            <Edit className="w-6 h-6 text-red-600" />
          ) : (
            <PlusCircle className="w-6 h-6 text-red-600" />
          )}
          <h2 className="text-xl font-bold text-gray-800">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* Name Field */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Tag className="w-4 h-4 text-red-500" />
            Product Name
          </label>
          <input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className=" text-gray-500 w-full px-4 py-2 border border-red-300 outline-none rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="e.g. Leather Tote Bag"
          />
        </div>

        {/* Price Field */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <DollarSign className="w-4 h-4 text-red-500" />
            Price (Ksh)
          </label>
          <input
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className=" text-gray-500 w-full px-4 py-2 border border-red-300 outline-none rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="0.00"
            type="number"
            min="0"
            step="0.01"
          />
        </div>

        {/* Image URL Field */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Image className="w-4 h-4 text-red-500" />
            Image URL
          </label>
          <input
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="text-gray-500 w-full px-4 py-2 border border-red-300 outline-none rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="https://example.com/image.jpg"
          />
          {formData.image && (
            <div className="mt-2 w-20 h-20 border rounded-md overflow-hidden">
              <img 
                src={formData.image} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Inspiration Field */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Lightbulb className="w-4 h-4 text-red-500" />
            Inspiration
          </label>
          <input
            value={formData.inspiration}
            onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
            className="text-gray-500 outline-none w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="What inspired this design?"
          />
        </div>

        {/* Category Field */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Focus className="w-4 h-4 text-red-500" />
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
            className="w-full px-4 py-2 border border-red-300 text-gray-500 outline-none rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="bags">Bags</option>
            <option value="tshirts">T-Shirts</option>
            <option value="hoodies">Hoodies</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-2.5 flex items-center gap-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 flex items-center gap-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {editingProduct ? (
              <>
                <Save className="w-5 h-5" />
                Update Product
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default ProductsManager;