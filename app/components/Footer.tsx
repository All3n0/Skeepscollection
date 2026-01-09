import { ShoppingBag, Mail, Phone, Instagram, Heart } from "lucide-react";
import { FaPinterest, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Top decorative line */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 h-1"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 p-2 rounded-lg">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                  SkeepsCollection
                </h2>
                <p className="text-gray-300 text-sm">Premium Custom Apparel</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-8 max-w-lg leading-relaxed text-lg">
              Your trusted partner for premium custom apparel. We bring your creative visions 
              to life with exceptional quality and lightning-fast turnaround times.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://www.pinterest.com/skeepscollection/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-red-600 p-3 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
              >
                <FaPinterest className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://www.tiktok.com/@skeepscollection"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gradient-to-r from-cyan-500 to-pink-500 p-3 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
              >
                <FaTiktok className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/skeepscollection/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
              >
                <Instagram className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href="mailto:skeepscollection@gmail.com"
                className="bg-gray-800 hover:bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
              >
                <Mail className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="relative mb-6">
              <h3 className="text-xl font-bold text-white relative inline-block">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full"></span>
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "#home" },
                { name: "Products", href: "#products" },
                { name: "About Us", href: "#about" },
                { name: "Contact", href: "#contact" },
                { name: "Size Guide", href: "#sizing" },
                { name: "FAQ", href: "#faq" }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <div className="relative mb-6">
              <h3 className="text-xl font-bold text-white relative inline-block">
                Get in Touch
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full"></span>
              </h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group hover:bg-gray-800/50 p-3 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-red-600 to-orange-500 p-3 rounded-lg">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">+254 775 976640</p>
                  <p className="text-gray-300 text-sm mt-1">Mon-Fri 9AM-6PM • Sat 10AM-4PM</p>
                  <a 
                    href="https://wa.me/254775976640" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm text-green-400 hover:text-green-300 transition-colors font-medium"
                  >
                    WhatsApp Available →
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 group hover:bg-gray-800/50 p-3 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-red-600 to-orange-500 p-3 rounded-lg">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">skeepscollection@gmail.com</p>
                  <p className="text-gray-300 text-sm mt-1">We reply within 24 hours</p>
                  <a 
                    href="mailto:skeepscollection@gmail.com" 
                    className="inline-block mt-2 text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium"
                  >
                    Send us an email →
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 group hover:bg-gray-800/50 p-3 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-red-600 to-orange-500 p-3 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Custom Apparel</p>
                  <p className="text-gray-300 text-sm mt-1">T-Shirts • Hoodies • Bags • Merch</p>
                  <p className="text-gray-300 text-sm mt-2">Bulk orders & custom designs welcome</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 mb-12">
          <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h3 className="text-2xl font-bold text-white mb-3">Stay Updated</h3>
                <p className="text-gray-300">
                  Get exclusive offers, design tips, and early access to new collections.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-auto flex-grow"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 p-2 rounded-lg mr-3">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">
                  © 2024 SkeepsCollection. All rights reserved.
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Made  by{" "}
                  <a 
                    href="https://allan-k.vercel.app" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 transition-colors font-medium underline decoration-dotted hover:decoration-solid"
                  >
                    Allan Kiprop
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-white transition-colors hover:underline decoration-red-500">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors hover:underline decoration-orange-500">
                Terms of Service
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors hover:underline decoration-yellow-500">
                Refund Policy
              </a>
              <a href="#faq" className="text-gray-300 hover:text-white transition-colors hover:underline decoration-green-500">
                FAQ
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors hover:underline decoration-blue-500">
                Contact Support
              </a>
            </div>
          </div>
          
          {/* Quality Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-sm">Premium Quality</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-sm">Fast Turnaround</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;