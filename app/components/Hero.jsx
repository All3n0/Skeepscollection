'use client';
import { ArrowRight, Star } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import heroImage from "@/assets/hero-image.jpg";

const Hero = ({ id}) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src='https://i.postimg.cc/PrNw6PfX/Untitled-design.png'
          alt="Custom apparel collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-white/90 text-sm">Trusted by 1000+ customers</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Custom Apparel
            <span className="block bg-gradient-to-r from-red-800 to-red-400 bg-clip-text text-transparent">
              Made Perfect
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
            Transform your ideas into stunning custom t-shirts, hoodies, and bags. 
            Premium quality, lightning-fast delivery, and designs that make you stand out.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
  <button
    onClick={() => {
      const contactSection = document.getElementById('contact');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    }}
    className="btn bg-red-600 hover:bg-primary/90 text-primary-foreground shadow-hover transform hover:scale-105 transition-all duration-200 p-4 rounded-lg flex items-center justify-center text-lg font-semibold"
  >
    Start Designing
    <ArrowRight className="ml-2 h-5 w-5" />
  </button>
  
  <button
    onClick={() => {
      const gallerySection = document.getElementById('gallery');
      gallerySection?.scrollIntoView({ behavior: 'smooth' });
    }}
    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm p-4 rounded-lg flex items-center justify-center text-lg font-semibold transition-colors duration-200"
  >
    View Collection
  </button>
</div>


          {/* Features */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center sm:text-left">
              <div className="text-2xl font-bold text-white">24-48h</div>
              <div className="text-white/70">Fast Turnaround</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-2xl font-bold text-white">Premium</div>
              <div className="text-white/70">Quality Materials</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-white/70">Satisfaction Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;