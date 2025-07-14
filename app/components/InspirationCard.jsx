'use client';

import { ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InspirationCard({ item, type }) {
  const router = useRouter();

  if (!item || !type) return null; // Ensure both are provided

  const {
    image = '/placeholder-image.jpg',
    inspiration = '',
    price = 0,
    name = '',
  } = item;

  const handleClick = () => {
    router.push(`/${type}/${encodeURIComponent(inspiration)}`);
  };

  const formattedPrice =
    typeof price === 'number' ? price.toFixed(2) : '0.00';

  return (
    <div
      className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border border-gray-200 hover:border-red-600/30"
      onClick={handleClick}
    >
      {/* Badge */}
      <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 capitalize">
        {type === 'tshirts'
          ? 'Trending Tee'
          : type === 'hoodies'
          ? 'Hot Hoodie'
          : 'Popular'}
      </div>

      {/* Image */}
      <div className="relative w-full h-64 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={inspiration || 'Product image'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.jpg';
            e.currentTarget.className =
              'w-full h-full object-cover bg-gray-200';
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <ShoppingBag size={18} />
            Quick View
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {inspiration} {type}
          </h3>
          <span className="bg-red-600/10 text-red-600 px-2 py-1 rounded-md text-sm font-medium">
            Ksh {formattedPrice}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {inspiration || 'Custom inspired collection'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">(24)</span>
          </div>

          <button
            className="text-red-600 hover:text-white hover:bg-red-600 transition-colors duration-200 p-2 rounded-full border border-red-600 hover:border-transparent"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
