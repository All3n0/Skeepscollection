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

export default function Home() {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
  };

  return (
    <>
      <Head>
        <title>CustomWear - Premium Custom Apparel</title>
        <meta name="description" content="Your trusted partner for premium custom apparel" />
      </Head>
      <Navigation cartItemsCount={cartItems.length} />
      

      {/* Hero Section */}
      <Hero id="home" />

      <Gallery id="gallery" />
      <Products id="products" addToCart={addToCart} />
<About id="about" />
<Contact id="contact" />

      <Footer />
    </>
  );
}