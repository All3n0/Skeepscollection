'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InspirationCard from '../components/InspirationCard';

const HoodiesPage = () => {
  const [hoodies, setHoodies] = useState([]);
  const [filteredHoodies, setFilteredHoodies] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHoodies = async () => {
      try {
        const res = await fetch('https://skeepsserver-production.up.railway.app/hoodies');
        if (!res.ok) throw new Error('Failed to fetch hoodies');
        const data = await res.json();
        setHoodies(data);
        setFilteredHoodies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHoodies();
  }, []);

  const handleSearch = (query) => {
    const filtered = hoodies.filter(hoodie => 
      hoodie.inspiration.toLowerCase().includes(query.toLowerCase()) ||
      hoodie.design_name?.toLowerCase().includes(query.toLowerCase()) ||
      hoodie.description?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredHoodies(filtered);
  };

  // Group by inspiration, keeping only one hoodie per inspiration
  const inspirationGroups = filteredHoodies.reduce((acc, hoodie) => {
    if (!acc[hoodie.inspiration]) {
      acc[hoodie.inspiration] = hoodie;
    }
    return acc;
  }, {});

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
        <p className="text-xl font-medium text-gray-700">Loading hoodies...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-red-600 mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Shop
          </button>

          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover Our Hoodie Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay warm in style. Our hoodies are inspired by your favorite artists, teams, and street culture vibes.
            </p>
          </div>
        </div>

        {/* Inspiration Grid */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Browse By Inspiration
          </h2>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 px-4">
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <input
                type="text"
                placeholder="Search hoodies by inspiration, design, or keyword..."
                className=" text-gray-700 w-full px-4 py-3 pl-12 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <Search className="h-6 w-6 text-red-600" />
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.values(inspirationGroups).map((hoodie) => (
              <InspirationCard 
                key={hoodie.inspiration} 
                item={hoodie} 
                type="hoodies" 
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HoodiesPage;