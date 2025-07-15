'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InspirationCard from '../components/InspirationCard';
type TShirt = {
  id: number;
  design_name: string;
  description: string;
  inspiration: string;
};
const TShirtsPage = () => {
  const [tshirts, setTShirts] = useState<TShirt[]>([]);
  const [filteredTShirts, setFilteredTShirts] = useState<TShirt[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTShirts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5555/tshirts');
        if (!res.ok) throw new Error('Failed to fetch t-shirts');
        const data = await res.json();
        setTShirts(data);
        setFilteredTShirts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTShirts();
  }, []);

  const handleSearch = (query: string) => {
    const filtered = tshirts.filter(shirt => 
      shirt.inspiration.toLowerCase().includes(query.toLowerCase()) ||
      shirt.design_name?.toLowerCase().includes(query.toLowerCase()) ||
      shirt.description?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTShirts(filtered);
  };

  // Group by inspiration, keeping only one shirt per inspiration
  const inspirationGroups = filteredTShirts.reduce((acc, shirt) => {
    if (!acc[shirt.inspiration]) {
      acc[shirt.inspiration] = shirt;
    }
    return acc;
  }, {} as Record<string, any>);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
        <p className="text-xl font-medium text-gray-700">Loading t-shirts...</p>
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
              Discover Our T-Shirt Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore bold designs, typography art, and iconic styles inspired by pop culture, sports, and music.
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
                placeholder="Search t-shirts by inspiration, design, or keyword..."
                className="text-gray-700 w-full px-4 py-3 pl-12 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <Search className="h-6 w-6 text-red-600" />
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.values(inspirationGroups).map((shirt) => (
              <InspirationCard 
                key={shirt.inspiration} 
                item={shirt} 
                type="tshirts" 
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TShirtsPage;