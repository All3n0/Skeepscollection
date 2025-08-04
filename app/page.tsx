'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
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

let gaInitialized = false;

if (typeof window !== 'undefined' && !gaInitialized) {
  ReactGA.initialize('G-J580MXQT88'); // Replace na  GA ID yako process below remove once read :
  gaInitialized = true;
}


  // Step 1: Create a Google Analytics account

  // Go to the Google Analytics website (www.google.com/analytics) and sign in with your Google account.
  // Click on "Create" and follow the prompts to set up a new Google Analytics account.
  // Fill in the required information, such as your website's name, URL, and industry category.
  // Step 2: Get your tracking ID

  // Once you've created your Google Analytics account, navigate to the "Admin" section.
  // Click on "Create Property" and select "Website".
  // Fill in the required information, such as your website's URL and name.
  // Click on "Get Tracking ID" to get your unique tracking ID.



export default function Home() {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname });

    }
  }, []);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => [...prevItems, product]);
    ReactGA.event({
      category: 'Cart',
      action: 'Add to Cart',
      label: product.name,
      value: 1,
    });
  };


  const handleHeroCTA = () => {
    ReactGA.event({
      category: 'Hero',
      action: 'Click Hero CTA Button',
      label: 'Shop Now',
    });
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = () => {
    ReactGA.event({
      category: 'Contact',
      action: 'Submitted Contact Form',
    });
  };

  return (
    <>
      <Head>
        <title>Skeepscollection - Premium Custom Apparel</title>
        <meta name="description" content="Your trusted partner for premium custom apparel" />
        <meta name="keywords" content="custom apparel, premium clothing, fashion" />
        <meta name="author" content="Your Name" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title" content="CustomWear - Premium Custom Apparel" />
        <meta property="og:description" content="Your trusted partner for premium custom apparel" />
        <meta property="og:image" content="https://example.com/image.jpg" />
        <meta property="og:url" content="https://example.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CustomWear - Premium Custom Apparel" />
        <meta name="twitter:description" content="Your trusted partner for premium custom apparel" />
        <meta name="twitter:image" content="https://example.com/image.jpg" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "CustomWear",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Main St",
                "addressLocality": "Anytown",
                "addressRegion": "CA",
                "postalCode": "12345",
                "addressCountry": "USA"
              },
              "telephone": "+1 555 555 5555",
              "email": "info@example.com"
            }),
          }}
        />

        {/* // For SEO's steps nikama hapo chini   */}
        {/* Go to the Google Search Console website and sign in with your Google account.
Click on "Add a property" and enter your website's URL.
Verify your website using one of the available methods (e.g., HTML tag, DNS record, etc.).
Submit your sitemap.xml file to Google Search Console.
Wait for a few minutes for Google to process your submission.
Now, you can start optimizing your website for search engines. */}


      </Head>

      <Navigation cartItemsCount={cartItems.length} />
      <Hero id="home" onCTAClick={handleHeroCTA} />
      <Gallery id="gallery" />
      <Products id="products" addToCart={addToCart} />
      <About id="about" />
      <Contact id="contact" onSubmitForm={handleContactSubmit} />
      <Footer />
    </>
  );
}
