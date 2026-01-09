'use client';

import { useState, useEffect, useRef } from "react";
import { Menu, X, ShoppingBag, ShoppingCart, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavRefs = {
  [key: string]: HTMLAnchorElement | null;
};

const Navigation = ({ cartItemsCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navRefs = useRef<NavRefs>({});
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Gallery comes before Products
  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Gallery", href: "#gallery" },
    { name: "Products", href: "#products" },
    { name: "About", href: "#about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      if (isHome) {
        const sections = navItems.map(item => item.href.substring(1));
        let currentSection = "";
        
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
              currentSection = `#${section}`;
              break;
            }
          }
        }
        
        if (currentSection) {
          setActiveSection(currentSection);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const formatHref = (hashHref: string) => {
    return isHome ? hashHref : `/${hashHref}`;
  };

  const handleNavClick = (href: string) => {
    setActiveSection(href);
    setIsOpen(false);
  };

  // Determine if we should use dark text (for white backgrounds) or light text
  const shouldUseDarkText = !isHome || isScrolled || isOpen;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
  href="/" 
  className="flex items-center space-x-3 group relative z-10"
  onClick={() => handleNavClick("#home")}
>
  <div className="relative flex items-center justify-center">
    {/* Glow effect behind logo */}
    <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
    
    {/* Your logo from public folder */}
    <div className="relative h-10 w-10 flex items-center justify-center">
      <img 
        src="/logo.svg" 
        alt="SkeepsCollection Logo" 
        className="h-8 w-8 object-contain filter group-hover:brightness-110 transition-all duration-300"
        onError={(e) => {
          // Fallback if logo.svg doesn't exist
          console.warn("Logo not found at /logo.svg, using fallback icon");
          e.currentTarget.style.display = 'none';
          // Create a fallback icon
          const fallback = document.createElement('div');
          fallback.className = 'h-8 w-8 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center';
          fallback.innerHTML = '<span class="text-white font-bold text-xs">SC</span>';
          e.currentTarget.parentElement?.appendChild(fallback);
        }}
      />
    </div>
  </div>
  
  <div className="flex flex-col">
    <span className={`text-2xl font-bold transition-colors leading-tight ${
      shouldUseDarkText ? 'text-gray-900' : 'text-white'
    } group-hover:text-red-600`}>
      SkeepsCollection
    </span>
    <span className={`text-xs font-medium transition-colors ${
      shouldUseDarkText ? 'text-gray-600' : 'text-white/80'
    }`}>
      Custom Apparel
    </span>
  </div>
  
  <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse absolute -top-1 -right-2" />
</Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={formatHref(item.href)}
                ref={(el) => {
                  navRefs.current[item.href] = el;
                }}
                onClick={() => handleNavClick(item.href)}
                scroll={true}
                className={`relative px-3 py-2 font-medium transition-all duration-200 ${
                  shouldUseDarkText ? 'text-gray-700' : 'text-white/90'
                } hover:text-red-600 ${
                  activeSection === item.href 
                    ? 'text-red-600 font-semibold' 
                    : ''
                }`}
              >
                {item.name}
                {activeSection === item.href && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-500 rounded-full"></div>
                )}
              </Link>
            ))}

            <Link
              href="/cart"
              className={`relative p-2.5 rounded-full transition-all duration-300 ${
                shouldUseDarkText 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              } hover:text-red-600 shadow-sm hover:shadow-md ml-4`}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <Link
              href="/cart"
              className={`relative p-2 rounded-full transition-all duration-300 ${
                shouldUseDarkText 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              } hover:text-red-600`}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full transition-all duration-300 ${
                shouldUseDarkText 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              } hover:text-red-600`}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`md:hidden mt-2 rounded-xl shadow-2xl overflow-hidden ${
            isScrolled ? 'bg-white' : 'bg-white/95 backdrop-blur-md'
          }`}>
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={formatHref(item.href)}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.href
                      ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-600 font-semibold border-l-4 border-red-500'
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  }`}
                >
                  {activeSection === item.href && (
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"></div>
                  )}
                  <span className={activeSection === item.href ? 'ml-2' : ''}>
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;