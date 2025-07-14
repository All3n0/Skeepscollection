'use client'
import { Shirt, Package, ShoppingBag, ArrowRight } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";



const Gallery = () => {
    const router=useRouter();
  const categories = [
    {
      id: "tshirts",
      name: "T-Shirts",
      description: "Bold graphics and creative typography designs for everyday wear",
      image: 'https://i.pinimg.com/1200x/a6/5e/d9/a65ed9cb06dc4ea4a5e22d25a9ff5962.jpg',
      icon: Shirt,
      route: "/tshirts",
      count: "15+ Designs"
    },
    {
      id: "hoodies",
      name: "Hoodies",
      description: "Comfortable streetwear with urban and minimalist styles",
      image: 'https://i.postimg.cc/7LyRqvbR/Custom-HOods-28.png',
      icon: Package,
      route: "/hoodies",
      count: "12+ Designs"
    },
    {
      id: "bags",
      name: "Bags",
      description: "Practical and stylish designs for work and everyday use",
      image: 'https://i.postimg.cc/J0dg8GB3/custom-bag-1.png',
      icon: ShoppingBag,
      route: "/bags",
      count: "8+ Designs"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-white text-black">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
        Design Inspiration Gallery
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Explore our collection of stunning custom designs. Get inspired by our previous work 
        or order any of these existing designs for your own projects.
      </p>
    </div>

    {/* Static Cards */}
    <div className="grid md:grid-cols-3 gap-8">
      {/* T-Shirts Card */}
      <div className="group block">
        <div className="overflow-hidden hover:shadow-red-400 hover:shadow-lg hover transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-xl border border-border h-full">
          <div className="relative overflow-hidden h-64">
            <img
              src="https://i.pinimg.com/1200x/a6/5e/d9/a65ed9cb06dc4ea4a5e22d25a9ff5962.jpg"
              alt="T-Shirts"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="bg-primary text-white p-3 rounded-full">
                  <Shirt className="h-6 w-6" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  100+ Designs
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold text-red-600">T-Shirts</h3>
              <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" onClick={()=>router.push("/tshirts")}/>
            </div>
            <p className="text-muted-foreground mb-4">
              Bold graphics and creative typography designs for everyday wear.
            </p>
            <button onClick={()=>router.push("/tshirts")} className="w-full border border-red-600 text-red-600 rounded-md px-4 py-2 hover:bg-red-600 hover:text-white transition">
              Browse T-Shirts
            </button>
          </div>
        </div>
      </div>

      {/* Hoodies Card */}
      <div className="group block">
        <div className="overflow-hidden hover:shadow-lg hover:shadow-red-400 transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-xl border border-border h-full">
          <div className="relative overflow-hidden h-64">
            <img
              src="https://i.postimg.cc/7LyRqvbR/Custom-HOods-28.png"
              alt="Hoodies"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="bg-primary text-white p-3 rounded-full">
                  <Package className="h-6 w-6" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  50+ Designs
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold text-red-600">Hoodies</h3>
              <ArrowRight onClick={() => router.push("/hoodies")} className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-muted-foreground mb-4">
              Comfortable streetwear with urban and minimalist styles.
            </p>
            <button className="w-full border border-red-600 text-red-600 rounded-md px-4 py-2 hover:bg-red-600 hover:text-white transition" onClick={() => router.push("/hoodies")}>
              Browse Hoodies
            </button>
          </div>
        </div>
      </div>

      {/* Bags Card */}
      <div className="group block">
        <div className="overflow-hidden hover:shadow-lg hover:shadow-red-400 transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-xl border border-border h-full">
          <div className="relative overflow-hidden h-64">
            <img
              src="https://i.postimg.cc/J0dg8GB3/custom-bag-1.png"
              alt="Bags"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="bg-primary text-white p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  8+ Designs
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold text-red-600">Bags</h3>
              <ArrowRight onClick={() => router.push("/bags")}className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-muted-foreground mb-4">
              Practical and stylish designs for work and everyday use.
            </p>
            <button onClick={() => router.push("/bags")}className="w-full border border-red-600 text-red-600 rounded-md px-4 py-2 hover:bg-red-600 hover:text-white transition">
              Browse Bags
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

  );
};

export default Gallery;