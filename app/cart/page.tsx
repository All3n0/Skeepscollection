'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trash2, ShoppingBag, ArrowLeft, CreditCard, Loader2, Instagram, Mail, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  inspiration?: string;
  type?: string;
  size?: string;
}

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [instaInput, setInstaInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = () => {
    setShowNamePrompt(true);
  };

  const handleCompleteOrder = async () => {
    if (!nameInput || !emailInput || !instaInput) {
      setOrderMessage("Please fill in all fields.");
      setShowPopup(true);
      return;
    }

    setSubmitting(true);

    const orderDetails = {
      customer_name: nameInput,
      customer_email: emailInput,
      instagram_handle: instaInput,
      items: cartItems.map((item) => ({
        product_type: item.type || "product",
        product_name: item.name,
        product_id: item.id,
        price: Number(item.price) || 0,
        size: item.size || null,
        quantity: 1,
      })),
    };

    try {
      const response = await fetch("http://localhost:5555/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });
      
      const data = await response.json();
      
      setOrderMessage("Order placed successfully!");
      localStorage.removeItem("cart");
      setCartItems([]);
      setShowPopup(true);
      setShowNamePrompt(false);
      setNameInput("");
      setEmailInput("");
      setInstaInput("");
    } catch (err) {
      console.error("Error placing order:", err);
      setOrderMessage("Something went wrong. Please try again.");
      setShowPopup(true);
    } finally {
      setSubmitting(false);
    }
  };

  const total = calculateTotal();

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
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                        target.className = 'w-24 h-24 object-cover rounded-md border bg-gray-100';
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
                    <span className="font-medium text-red-600">To be communicated</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-medium font-semibold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-red-600">Ksh {total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
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

        {/* Customer Details Popup */}
        {showNamePrompt && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-red-600" />
            Checkout Details
          </h3>
          <button 
            onClick={() => setShowNamePrompt(false)}
            className="text-gray-400 hover:text-gray-500 transition-colors"
            disabled={submitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
              <User className="h-4 w-4 text-red-500" />
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full px-3 py-2 border border-red-500 text-gray-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
              <Mail className="h-4 w-4 text-red-500" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
className="w-full px-3 py-2 border border-red-500 text-gray-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
              <Instagram className="h-4 w-4 text-red-500" />
              Instagram Handle
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-red-500">@</span>
              </div>
              <input
                type="text"
                placeholder="username"
                value={instaInput}
                onChange={(e) => setInstaInput(e.target.value)}
                className="w-full pl-7 px-3 py-2 border border-red-500 text-gray-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setShowNamePrompt(false)}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={handleCompleteOrder}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Complete Order
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">Total</span>
          <span className="text-lg font-bold text-red-600">Ksh {calculateTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  </div>
)}

        {/* Order Message Popup */}
        {showPopup && (
          <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
              <p className="text-lg mb-4">{orderMessage}</p>
              {orderMessage === "Order placed successfully!" && (
                <p className="text-sm text-gray-600 mt-2">
                  Please check your spam folder as the confirmation email might be there.
                </p>
              )}
              <button
                onClick={() => setShowPopup(false)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;