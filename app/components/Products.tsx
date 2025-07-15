'use client';
import { ShoppingCart, Eye, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  startingPrice: string;
  features: string[];
  fullDescription: string;
  sizes: string[];
  colors: string[];
  productionTime: string;
  minOrder: string;
};
type ProductsProps = {
  id?: string;
  addToCart: (product: Product) => void;
};
const Products = (props: ProductsProps) => {
  const { id, addToCart } = props;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const products = [
    {
      id: 1,
      name: "Custom T-Shirts",
      description: "Premium quality cotton tees with your custom design.",
      image: "https://i.pinimg.com/1200x/a6/5e/d9/a65ed9cb06dc4ea4a5e22d25a9ff5962.jpg",
      startingPrice: "Ksh 800+",
      features: ["100% Cotton", "Custom Printing", "Multiple Colors", "All Sizes"],
      fullDescription: "Our custom t-shirts are made from 100% premium cotton, ensuring comfort and durability. Perfect for events, branding, or personal expression. We offer various printing techniques including screen printing, DTG, and heat transfer.",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["White", "Black", "Red", "Blue", "Gray", "Custom"],
      productionTime: "3-5 business days",
      minOrder: "5 pieces"
    },
    {
      id: 2,
      name: "Custom Hoodies",
      description: "Cozy hoodies perfect for your brand or personal style.",
      image: "https://i.pinimg.com/736x/f4/9e/75/f49e7555516d8fc888ea6dbee7605302.jpg",
      startingPrice: "Ksh 1800+",
      features: ["Premium Fleece", "Embroidery Available", "Unisex Fit", "Bulk Discounts"],
      fullDescription: "Premium quality hoodies with soft fleece lining for ultimate comfort. Available with either print or embroidery options. Ideal for schools, teams, or corporate branding.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Black", "Gray", "Navy", "Red", "Custom"],
      productionTime: "5-7 business days",
      minOrder: "5 pieces"
    },
    {
      id: 3,
      name: "Custom Bags",
      description: "Durable tote bags and backpacks for everyday use.",
      image: "https://i.pinimg.com/736x/c6/32/16/c63216383846ccf4032d990d5e0769ca.jpg",
      startingPrice: "Ksh 500+",
      features: ["Eco-Friendly", "Large Print Area", "Strong Handles", "Various Styles"],
      fullDescription: "Eco-friendly custom bags made from durable materials. Perfect for promotions, gifts, or retail. We offer various styles including tote bags, drawstring bags, and backpacks.",
      sizes: ["Standard", "Large"],
      colors: ["blue", "Black", "white","jungle green", "beige", "pink", "Custom"],
      productionTime: "4-6 business days",
      minOrder: "10 pieces"
    }
  ];

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewClick = (product: Product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product);
    scrollToContact();
  };

  return (
    <section id={id} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Product Range
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            High-quality custom apparel and accessories tailored to your vision.
            From concept to creation, we bring your ideas to life.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-md group transition hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image with overlay */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition hidden md:flex items-center justify-center space-x-3">
                  <button 
                    onClick={() => handleViewClick(product)}
                    className="bg-white text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4 mr-1" /> Quick View
                  </button>
                  <button 
                    onClick={() => handleOrderClick(product)}
                    className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-red-700"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" /> Order Now
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                  <span className="text-lg font-bold text-red-600">{product.startingPrice}</span>
                </div>
                <p className="text-gray-600 mb-4">{product.description}</p>

                {/* Features */}
                <ul className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-6">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-center">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Mobile buttons - always visible */}
                <div className="flex space-x-3 mb-4 md:hidden">
                  <button 
                    onClick={() => handleViewClick(product)}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center hover:bg-gray-200"
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </button>
                  <button 
                    onClick={() => handleOrderClick(product)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center hover:bg-red-700"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" /> Order
                  </button>
                </div>

                <button 
                  onClick={() => {
                    setSelectedProduct(product);
                    scrollToContact();
                  }}
                  className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 transition"
                >
                  Get Custom Quote
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-red-50 border border-red-100 p-10 rounded-xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Need Something Different?
            </h3>
            <p className="text-gray-600 mb-6">
              We specialize in custom orders. Whether it's a unique design, specific material,
              or bulk quantity — we've got you covered.
            </p>
              <button onClick={() => {
      const contactSection = document.getElementById('contact');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    }}
              className="bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition">
                Contact Us for Custom Orders
              </button>
            
          </div>
        </div>
      </div>

      {/* Product Details Popup */}
      {showPopup && selectedProduct && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 font-lg text-red-600 hover:text-red-800 rounded-full p-2 z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-full">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-red-600 text-xl font-semibold mb-4">
                    {selectedProduct.startingPrice}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">Description</h4>
                      <p className="text-gray-600">{selectedProduct.fullDescription}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800">Available Sizes</h4>
                      <p className="text-gray-600">{selectedProduct.sizes.join(', ')}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800">Available Colors</h4>
                      <p className="text-gray-600">{selectedProduct.colors.join(', ')}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800">Production Time</h4>
                      <p className="text-gray-600">{selectedProduct.productionTime}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800">Minimum Order</h4>
                      <p className="text-gray-600">{selectedProduct.minOrder}</p>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setShowPopup(false);
                          scrollToContact();
                        }}
                        className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition"
                      >
                        Get Custom Quote
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Products;