'use client';

import { ShoppingBag, Heart, Eye } from 'lucide-react';

const InspirationItemCard = ({ item, addToCart }) => {
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
        <button className="p-2 bg-white text-red-600 backdrop-blur-sm rounded-full hover:bg-red-600 hover:text-white transition-colors duration-200">
          <Eye size={16} />
        </button>
      </div>

      {/* Image */}
      <div className="relative w-full h-64 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.jpg';
            e.currentTarget.className =
              'w-full h-full object-cover bg-gray-100';
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

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <ShoppingBag size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default InspirationItemCard;
