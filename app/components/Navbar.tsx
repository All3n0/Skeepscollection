'use client';

import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import Link from "next/link"; // Only used for cart
// import { button } from "@/components/ui/button";

const Navigation = ({ cartItemsCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "Gallery", href: "#gallery" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="bg-white backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-red-600" />
            <span className="text-2xl font-bold text-black">Skeepcollection</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-800 hover:text-red-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}

            <a
              href="#contact"
              className="ml-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
            >
              Get Quote
            </a>

            <Link
              href="/cart"
              className="ml-4 text-gray-800 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              Cart ({cartItemsCount})
            </Link>
          </div>

          {/* Mobile Menu button */}
          <div className="md:hidden">
            <button
            //   variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  {item.name}
                </a>
              ))}

              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-center bg-primary text-white rounded-md font-semibold hover:bg-primary/90"
              >
                Get Quote
              </a>

              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-center text-foreground hover:text-primary"
              >
                Cart ({cartItemsCount})
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
