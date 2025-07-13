'use client';
import { ShoppingCart, Eye } from 'lucide-react';
import Link from 'next/link';

const Products = () => {
  const products = [
    {
      id: 1,
      name: "Custom T-Shirts",
      description: "Premium quality cotton tees with your custom design.",
      image: "https://i.pinimg.com/1200x/a6/5e/d9/a65ed9cb06dc4ea4a5e22d25a9ff5962.jpg",
      startingPrice: "$19.99",
      features: ["100% Cotton", "Custom Printing", "Multiple Colors", "All Sizes"]
    },
    {
      id: 2,
      name: "Custom Hoodies",
      description: "Cozy hoodies perfect for your brand or personal style.",
      image: "https://i.pinimg.com/736x/f4/9e/75/f49e7555516d8fc888ea6dbee7605302.jpg",
      startingPrice: "$39.99",
      features: ["Premium Fleece", "Embroidery Available", "Unisex Fit", "Bulk Discounts"]
    },
    {
      id: 3,
      name: "Custom Bags",
      description: "Durable tote bags and backpacks for everyday use.",
      image: "https://i.pinimg.com/736x/c6/32/16/c63216383846ccf4032d990d5e0769ca.jpg",
      startingPrice: "$24.99",
      features: ["Eco-Friendly", "Large Print Area", "Strong Handles", "Various Styles"]
    }
  ];

  return (
    <section id="products" className="py-20 bg-gray-50">
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
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-3">
                  <button className="bg-white text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-gray-100">
                    <Eye className="w-4 h-4 mr-1" /> View
                  </button>
                  <button className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-red-700">
                    <ShoppingCart className="w-4 h-4 mr-1" /> Order
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

                <button className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 transition">
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
            <Link href="/contact">
              <button className="bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition">
                Contact Us for Custom Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
