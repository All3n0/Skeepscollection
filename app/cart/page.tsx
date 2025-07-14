'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('Cart items loaded:', cart);
    setCartItems(cart);
  }, []);

  const removeFromCart = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-red-600 mr-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold flex items-center text-black">
            <ShoppingBag size={28} className="mr-3 text-red-600" />
            Your Shopping Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700">Your cart is empty</h3>
            <p className="text-gray-500 mt-2">Start shopping to add items to your cart</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition flex items-center mx-auto"
            >
              <ArrowLeft size={18} className="mr-2" />
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-lg hover:shadow-red-600/30 transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md border"
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                        e.target.className = 'w-24 h-24 object-cover rounded-md border bg-gray-100';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{item.inspiration} — {item.type}</p>
                      <p className="text-red-600 font-medium mt-1">Ksh {item.price?.toFixed(2)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-600 p-2 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                  <CreditCard size={22} className="mr-2 text-red-600 " />
                  Order Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-4">
                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium text-red-600">Ksh {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-4">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-red-600">Free</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-medium font-semibold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-red-600">Ksh {total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="mt-6 w-full bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition flex items-center justify-center"
                >
                  <CreditCard size={18} className="mr-2" />
                  Proceed to Checkout
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-600 hover:text-red-600 flex items-center justify-center w-full"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;