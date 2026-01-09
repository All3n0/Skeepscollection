'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trash2, ShoppingBag, ArrowLeft, CreditCard, Loader2, Instagram, Mail, User, X, CheckCircle } from 'lucide-react';
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
  const [isSuccess, setIsSuccess] = useState(false);

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
      setOrderMessage("❌ Please fill in all fields.");
      setIsSuccess(false);
      setShowPopup(true);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setOrderMessage("❌ Please enter a valid email address.");
      setIsSuccess(false);
      setShowPopup(true);
      return;
    }

    setSubmitting(true);

    const orderDetails = {
      customer_name: nameInput,
      customer_email: emailInput,
      instagram_handle: instaInput.replace('@', ''), // Remove @ if user includes it
      items: cartItems.map((item) => ({
        product_name: item.name,
        product_type: item.type || "Custom Apparel",
        quantity: 1,
        price: item.price,
        // Add any additional fields your backend might need
      })),
    };

    console.log('Sending order:', orderDetails);

    try {
      const response = await fetch("https://skeepsserver-production.up.railway.app/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(orderDetails),
      });
      
      const data = await response.json();
      console.log('Order response:', data);
      
      if (response.ok) {
        setOrderMessage("✅ Order placed successfully! Check your email for confirmation.");
        setIsSuccess(true);
        localStorage.removeItem("cart");
        setCartItems([]);
        setShowPopup(true);
        setShowNamePrompt(false);
        setNameInput("");
        setEmailInput("");
        setInstaInput("");
      } else {
        setOrderMessage(`❌ ${data.error || "Something went wrong. Please try again."}`);
        setIsSuccess(false);
        setShowPopup(true);
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setOrderMessage("❌ Network error. Please check your connection and try again.");
      setIsSuccess(false);
      setShowPopup(true);
    } finally {
      setSubmitting(false);
    }
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 md:py-12 w-full">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-red-600 mr-4 transition-colors group"
          >
            <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center text-gray-900">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 p-2 rounded-lg mr-3">
              <ShoppingBag size={28} className="text-white" />
            </div>
            Your Shopping Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="relative inline-block mb-6">
              <ShoppingBag size={64} className="mx-auto text-gray-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 rounded-full blur-xl opacity-20"></div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Looks like you haven't added any items to your cart yet. Start shopping to find amazing custom apparel!
            </p>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowLeft size={18} className="mr-2" />
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative">
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-100 shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                          target.className = 'w-24 h-24 object-cover rounded-lg border-2 border-gray-100 bg-gradient-to-br from-gray-100 to-gray-200';
                        }}
                      />
                      <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        1
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {item.inspiration && `${item.inspiration} • `}{item.type || 'Custom Apparel'}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-red-600 font-bold text-lg">Ksh {item.price?.toLocaleString('en-US')}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-4 sm:mt-0 flex items-center gap-2 text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                    <span className="text-sm font-medium sm:hidden">Remove</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-b from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg sticky top-24">
                <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900">
                  <CreditCard size={22} className="mr-2 text-red-600" />
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                    <span className="font-semibold text-gray-900">Ksh {total.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Shipping & Handling</span>
                    <span className="font-semibold text-yellow-600">To be determined</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-gray-900">Estimated Total</span>
                    <span className="text-2xl font-bold text-red-600">Ksh {total.toLocaleString('en-US')}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3.5 rounded-lg font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <CreditCard size={18} />
                    Proceed to Checkout
                  </button>
                  
                  <button
                    onClick={() => router.push('/')}
                    className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Continue Shopping
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-3">What happens next?</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <div className="bg-green-100 p-1 rounded-full mt-0.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      </div>
                      <span>You'll receive a confirmation email</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-yellow-100 p-1 rounded-full mt-0.5">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span>We'll contact you on Instagram for details</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 p-1 rounded-full mt-0.5">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      </div>
                      <span>Get your custom apparel in 7-14 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Details Modal */}
        {showNamePrompt && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="bg-gradient-to-r from-red-600 to-orange-500 p-2 rounded-lg">
                      <ShoppingBag className="h-5 w-5 text-white" />
                    </div>
                    Checkout Details
                  </h3>
                  <button 
                    onClick={() => setShowNamePrompt(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                    disabled={submitting}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-gray-600 mb-6">
                  Please provide your details so we can process your order and contact you.
                </p>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4 text-red-600" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="text-red-600 focus:text-red-900  w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-red-600" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="text-red-600 focus:text-red-900 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-red-600" />
                      Instagram Handle
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium">@</span>
                      </div>
                      <input
                        type="text"
                        placeholder="username"
                        value={instaInput}
                        onChange={(e) => setInstaInput(e.target.value.replace('@', ''))}
                        className=" text-red-600 focus:text-red-900 w-full pl-10 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                        disabled={submitting}
                      />
                    </div>
                    <p className="text-xs text-gray-500">We'll contact you here for order details</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setShowNamePrompt(false)}
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleCompleteOrder}
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold rounded-xl hover:from-red-700 hover:to-orange-600 disabled:opacity-70 transition-all shadow-lg hover:shadow-xl"
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

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Order Total</span>
                  <span className="text-xl font-bold text-red-600">Ksh {calculateTotal().toLocaleString('en-US')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Message Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className={`bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full transform transition-all duration-300 animate-slideUp ${
              isSuccess ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
            }`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isSuccess ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {isSuccess ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <X className="h-8 w-8 text-red-600" />
                )}
              </div>
              <h3 className={`text-xl font-bold text-center mb-3 ${
                isSuccess ? 'text-green-700' : 'text-red-700'
              }`}>
                {isSuccess ? 'Success!' : 'Oops!'}
              </h3>
              <p className="text-gray-700 text-center mb-6 leading-relaxed">
                {orderMessage}
              </p>
              <button
                onClick={() => {
                  setShowPopup(false);
                  if (isSuccess) {
                    router.push('/');
                  }
                }}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  isSuccess 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' 
                    : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white'
                }`}
              >
                {isSuccess ? 'Continue Shopping' : 'Try Again'}
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