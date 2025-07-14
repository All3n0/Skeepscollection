'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import InspirationItemCard from '../../components/InspirationItemCard';

const HoodieInspirationPage = () => {
  const params = useParams();
  const router = useRouter();
  const inspiration = decodeURIComponent(params?.inspiration );
  const type = 'hoodies';

  const [items, setItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (inspiration) {
      setIsLoading(true);
      fetch(`http://127.0.0.1:5555/hoodies/inspiration/${inspiration}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
          return res.json();
        })
        .then((data) => setItems(data))
        .catch((err) => console.error('Error fetching hoodies:', err))
        .finally(() => setIsLoading(false));
    }
  }, [inspiration]);

  const addToCart = (item) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');

    const itemWithMeta = {
      ...item,
      type: type,
      inspiration: inspiration,
      addedAt: Date.now(),
    };

    localStorage.setItem('cart', JSON.stringify([...currentCart, itemWithMeta]));

    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message: '✔ Added to cart' }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Notification stack */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className="px-4 py-2 rounded-md shadow-lg bg-red-600 text-white font-medium animate-fade-in-out"
          >
            {notification.message}
          </div>
        ))}
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="mb-10">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 hover:text-red-600 mb-4 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 capitalize">
              {inspiration} <span className="text-red-600">Hoodies</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out our hoodie collection inspired by {inspiration}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <InspirationItemCard 
                key={item.id} 
                item={item} 
                addToCart={addToCart} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto h-24 w-24 text-red-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No hoodies found</h3>
            <p className="mt-1 text-gray-600">We couldn't find any hoodies matching "{inspiration}"</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HoodieInspirationPage;
