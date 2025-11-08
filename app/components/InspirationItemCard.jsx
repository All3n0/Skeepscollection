'use client';

import { useState } from 'react';
import { ShoppingBag, Heart, Eye, X } from 'lucide-react';

const InspirationItemCard = ({ item, addToCart }) => {
  const [showModal, setShowModal] = useState(false);

  if (!item) return null;

  const {
    name = 'Untitled',
    price = 0,
    image = '/placeholder.jpg',
    type = 'product',
  } = item;

  const formattedType = {
    bags: 'Bag',
    tshirts: 'T-Shirt',
    hoodies: 'Hoodie',
  }[type] || 'Product';

  const handleAddToCart = () => {
    if (addToCart) addToCart(item);
  };

  return (
    <>
      {/* CARD */}
      <div className="group relative rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-red-600/30 shadow-md hover:shadow-lg transition-all duration-300">
        {/* Badge */}
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 capitalize">
          {formattedType}
        </div>

        {/* Quick Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button className="p-2 bg-white text-red-600 backdrop-blur-sm rounded-full hover:bg-red-600 hover:text-white transition-colors duration-200">
            <Heart size={16} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="p-2 bg-white text-red-600 backdrop-blur-sm rounded-full hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Image */}
        <div className="relative w-full h-72 overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.jpg';
              e.currentTarget.className = 'w-full h-full object-contain bg-gray-100';
            }}
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              className="bg-red-600 text-white px-5 py-2 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />
              Quick Add
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
          <p className="text-sm text-gray-500 mb-2">Ksh {price.toFixed(2)}</p>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            Beautiful, high-quality {formattedType.toLowerCase()}. Perfect for your brand or personal use.
          </p>

          <button
            onClick={handleAddToCart}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* POPUP MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden animate-fadeIn scale-95">
            {/* Header Close Button */}
            <div className="flex justify-end p-3">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex flex-col md:flex-row gap-6 p-6">
              {/* Image */}
              <div className="md:w-1/2 flex items-center justify-center bg-gray-100 rounded-xl">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-80 object-contain rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg';
                  }}
                />
              </div>

              {/* Details */}
              <div className="md:w-1/2 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{name}</h2>
                <p className="text-gray-500 mb-3 capitalize">{formattedType}</p>
                <p className="text-gray-700 mb-4">
                  Beautiful, handcrafted {formattedType.toLowerCase()} made from premium materials.
                </p>
                <p className="text-lg font-semibold text-red-600 mb-6">Ksh {price.toFixed(2)}</p>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 hover:text-red-600 hover:border-red-600 py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InspirationItemCard;
