'use client';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Hero from './components/Hero';
import Products from './components/Products';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Navigation from './components/Navbar';
import Gallery from './components/Gallery';
export default function Home() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  return (
    <>
      <Head>
        <title>CustomWear - Premium Custom Apparel</title>
        <meta name="description" content="Your trusted partner for premium custom apparel" />
      </Head>
      <Navigation cartItemsCount={cartItems.length} />
      {/* Navigation */}
      {/* <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">CustomWear</Link>
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-800 hover:text-blue-600">Home</Link>
            <Link href="/products" className="text-gray-800 hover:text-blue-600">Products</Link>
            <Link href="/gallery" className="text-gray-800 hover:text-blue-600">Gallery</Link>
            <Link href="/about" className="text-gray-800 hover:text-blue-600">About</Link>
            <Link href="/contact" className="text-gray-800 hover:text-blue-600">Contact</Link>
            <Link href="/cart" className="text-gray-800 hover:text-blue-600 flex items-center">
              Cart ({cartItems.length})
            </Link>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <Hero id="home" />
<Products id="products" addToCart={addToCart} />
      <Gallery id="gallery" />
      
<About id="about" />
<Contact id="contact" />

      <Footer />
    </>
  );
}