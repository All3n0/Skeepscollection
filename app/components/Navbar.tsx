'use client';

import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = ({ cartItemsCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "Gallery", href: "#gallery" },
    { name: "About", href: "#about" },
    
  ];

 const formatHref = (hashHref: string) => {
  return isHome ? hashHref : `/${hashHref}`;
};

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <ShoppingBag className="h-8 w-8 text-red-600 group-hover:rotate-12 transition-transform" />
            <span className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
              Skeepcollection
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={formatHref(item.href)}
                scroll={true}
                className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium px-2 py-1 rounded-md hover:bg-gray-50"
              >
                {item.name}
              </Link>
            ))}

            <div className="flex items-center space-x-4 ml-4">
              <Link
                href={formatHref("#contact")}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition group"
              >
                <Phone className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                Get Quote
              </Link>

              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-red-600 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={formatHref(item.href)}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href={formatHref("#contact")}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center mt-2 px-3 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition"
              >
                <Phone className="h-4 w-4 mr-2" />
                Get Quote
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
