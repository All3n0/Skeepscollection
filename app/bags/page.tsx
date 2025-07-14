'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InspirationCard from '../components/InspirationCard';

const BagsPage = () => {
    const [bags, setBags] = useState([]);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBags = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5555/bags');
                if (!response.ok) throw new Error('Failed to fetch bags');
                const data = await response.json();
                setBags(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBags();
    }, []);

    // Group by inspiration but keep all products
    const inspirationGroups = bags.reduce((acc, bag) => {
        if (!acc[bag.inspiration]) {
            acc[bag.inspiration] = bag; // Store just one bag per inspiration
        }
        return acc;
    }, {});

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-red-600" />
                <p className="text-xl font-medium text-gray-700">Loading our collection...</p>
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
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Discover Our Bag Collection
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Explore unique designs inspired by different themes and styles. 
                            Each piece is crafted with premium materials and attention to detail.
                        </p>
                    </div>
                </div>

                {/* Inspiration Grid */}
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Browse By Inspiration
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.values(inspirationGroups).map((bag) => (
                            <InspirationCard 
                              key={bag.inspiration} 
                              item={bag} 
                              type="bags" 
                            />
                        ))}
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default BagsPage;