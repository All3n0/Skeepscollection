'use client';
import { ArrowRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Hero = ({ id, onCTAClick }) => {
  const heroRef = useRef(null);
  const [counters, setCounters] = useState({
    fastTurnaround: 0,
    satisfaction: 0
  });

  useEffect(() => {
    // Trigger animations on mount
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Start counters when the section is in view
            if (entry.target.querySelector('.counter-24-48') || entry.target.querySelector('.counter-100')) {
              animateCounters();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = heroRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    // Animate 24-48 counter
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const endValue = 48;
    
    const animateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = Math.floor(easeOutQuart * endValue);
      
      setCounters(prev => ({
        ...prev,
        fastTurnaround: Math.max(24, currentValue) // Start from 24
      }));

      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      } else {
        setCounters(prev => ({
          ...prev,
          fastTurnaround: 48
        }));
        
        // Start 100% counter after the first one finishes
        animateSatisfactionCounter();
      }
    };

    requestAnimationFrame(animateCounter);
  };

  const animateSatisfactionCounter = () => {
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    const endValue = 100;
    const steps = 20; // Number of steps
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Step-based animation
      const currentStep = Math.floor(progress * steps);
      const currentValue = Math.floor((currentStep / steps) * endValue);
      
      setCounters(prev => ({
        ...prev,
        satisfaction: currentValue
      }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCounters(prev => ({
          ...prev,
          satisfaction: 100
        }));
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with parallax effect */}
      <div className="absolute inset-0 z-0">
        <img
          src='https://i.postimg.cc/PrNw6PfX/Untitled-design.png'
          alt="Custom apparel collection"
          className="w-full h-full object-cover animate-parallax"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
      </div>

      <div 
        ref={heroRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32"
      >
        <div className="max-w-3xl">
          {/* Badge with fade-in up */}
          <div className="flex items-center space-x-2 mb-6 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
            <div className="flex items-center animate-pulse-slow">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="h-4 w-4 text-yellow-400 fill-current animate-float"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <span className="text-white/90 text-sm">Trusted by 1000+ customers</span>
          </div>

          {/* Main heading with staggered animation */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight overflow-hidden">
            <span className="block animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
              Custom Apparel
            </span>
            <span className="pb-8 block bg-gradient-to-r from-red-800 to-red-400 bg-clip-text text-transparent animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
              Made Perfect
            </span>
          </h1>

          {/* Subheading with fade-in */}
          <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
            Transform your ideas into stunning custom t-shirts, hoodies, and bags. 
            Premium quality, lightning-fast delivery, and designs that make you stand out.
          </p>

          {/* CTA Buttons with slide-in */}
          <div className="flex flex-col sm:flex-row gap-4 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-400">
            <button
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
                if (onCTAClick) onCTAClick('Start Designing');
              }}
              className="btn bg-red-600 hover:bg-primary/90 text-primary-foreground shadow-hover transform hover:scale-105 transition-all duration-200 p-4 rounded-lg flex items-center justify-center text-lg font-semibold animate-pulse-gentle group"
            >
              Start Designing
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <button
              onClick={() => {
                const gallerySection = document.getElementById('gallery');
                gallerySection?.scrollIntoView({ behavior: 'smooth' });
                if (onCTAClick) onCTAClick('View Collection');
              }}
              className="border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm p-4 rounded-lg flex items-center justify-center text-lg font-semibold transition-all duration-300 hover:border-white/60 hover:scale-105"
            >
              View Collection
            </button>
          </div>

          {/* Features with counters */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Fast Turnaround Counter */}
            <div 
              className="text-center sm:text-left animate-on-scroll opacity-0 translate-y-4 transition-all duration-700"
              style={{ transitionDelay: '500ms' }}
            >
              <div className="text-2xl font-bold text-white mb-1 counter-24-48">
                <span className="inline-block min-w-[3ch] text-left">
                  {counters.fastTurnaround > 0 ? `24-${counters.fastTurnaround}h` : '24-48h'}
                </span>
                {counters.fastTurnaround === 48 && (
                  <span className="text-red-400 ml-1 animate-pulse">✓</span>
                )}
              </div>
              <div className="text-white/70">Fast Turnaround</div>
            </div>

            {/* Premium Quality - No counter */}
            <div 
              className="text-center sm:text-left animate-on-scroll opacity-0 translate-y-4 transition-all duration-700"
              style={{ transitionDelay: '600ms' }}
            >
              <div className="text-2xl font-bold text-white mb-1">Premium</div>
              <div className="text-white/70">Quality Materials</div>
            </div>

            {/* Satisfaction Guarantee Counter */}
            <div 
              className="text-center sm:text-left animate-on-scroll opacity-0 translate-y-4 transition-all duration-700"
              style={{ transitionDelay: '700ms' }}
            >
              <div className="text-2xl font-bold text-white mb-1 counter-100">
                <span className="inline-block min-w-[4ch] text-left">
                  {counters.satisfaction}%
                </span>
                {counters.satisfaction === 100 && (
                  <span className="text-red-400 ml-1 animate-pulse">✓</span>
                )}
              </div>
              <div className="text-white/70">Satisfaction Guarantee</div>
            </div>
          </div>

          {/* Progress bars for counters (optional visual) */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-800 to-red-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(counters.fastTurnaround - 24) / 24 * 100}%` }}
              ></div>
            </div>
            <div className="h-1 bg-white/10 rounded-full"></div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-800 to-red-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${counters.satisfaction}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-scroll-indicator"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes parallax {
          0% { transform: translateY(0) scale(1.1); }
          100% { transform: translateY(-20px) scale(1.1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
        }
        
        @keyframes scrollIndicator {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        
        @keyframes counterGrow {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-parallax {
          animation: parallax 20s ease-in-out infinite alternate;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 2s infinite;
        }
        
        .animate-scroll-indicator {
          animation: scrollIndicator 1.5s infinite;
        }
        
        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Counter animation for individual numbers */
        .counter-number {
          display: inline-block;
          animation: counterGrow 0.3s ease-out;
        }
        
        /* Smooth reveal effect for background */
        .hero-bg {
          animation: heroReveal 1.5s ease-out forwards;
        }
        
        @keyframes heroReveal {
          from { opacity: 0; filter: blur(10px); }
          to { opacity: 1; filter: blur(0); }
        }
        
        /* Additional counter styles */
        .counter-24-48, .counter-100 {
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </section>
  );
};

export default Hero;