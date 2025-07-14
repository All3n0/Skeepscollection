'use client';

import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Filter, Search, ArrowUp, ArrowDown } from "lucide-react";
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
      <div className="flex gap-4 items-center">
        <span className="font-medium">Sort by:</span>
        <button
          onClick={() => requestSort("name")}
          className={`flex items-center gap-1 px-3 py-1 rounded ${sortConfig.key === "name" ? "bg-gray-100" : ""}`}
        >
          Name
          {sortConfig.key === "name" && (
            sortConfig.direction === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
          )}
        </button>
        <button
          onClick={() => requestSort("price")}
          className={`flex items-center gap-1 px-3 py-1 rounded ${sortConfig.key === "price" ? "bg-gray-100" : ""}`}
        >
          Price
          {sortConfig.key === "price" && (
            sortConfig.direction === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
          )}
        </button>
        <button
          onClick={() => requestSort("created_at")}
          className={`flex items-center gap-1 px-3 py-1 rounded ${sortConfig.key === "created_at" ? "bg-gray-100" : ""}`}
        >
          Date Added
          {sortConfig.key === "created_at" && (
            sortConfig.direction === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
          )}
        </button>
      </div>

      {/* Products Grid */}
      {sortedAndFilteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedAndFilteredProducts.map((product) => (
            <div key={`${product.category}-${product.id}`} className="border rounded-lg p-4 shadow-sm bg-white flex flex-col justify-between">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                <p className="text-sm mt-1">Inspiration: <i>{product.inspiration}</i></p>
                <p className="text-lg font-bold mt-2">Ksh {product.price.toLocaleString()}</p>
                {product.created_at && (
                  <p className="text-xs text-gray-400 mt-1">
                    Added: {new Date(product.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex justify-between mt-4">
                <button 
                  onClick={() => handleEdit(product)} 
                  className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 flex items-center gap-1"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(product)} 
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4 text-red-600" /> Delete
                </button>
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
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold">{editingProduct ? "Edit" : "Create"} Product</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (Ksh)</label>
                <input
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Price"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inspiration</label>
                <input
                  value={formData.inspiration}
                  onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Design inspiration"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="bags">Bags</option>
                  <option value="tshirts">T-Shirts</option>
                  <option value="hoodies">Hoodies</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  {editingProduct ? "Update Product" : "Create Product"}
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