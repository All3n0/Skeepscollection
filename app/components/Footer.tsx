import { ShoppingBag, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Pin } from "lucide-react";
import { FaPinterest, FaTiktok } from "react-icons/fa";
import { PiNyTimesLogo } from "react-icons/pi";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <ShoppingBag className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold text-white">Skeepscollection</span>
            </div>
            <p className="text-white mb-6 max-w-md leading-relaxed">
              Your trusted partner for premium custom apparel. We bring your creative visions 
              to life with exceptional quality and lightning-fast turnaround times.
            </p>
 <div className="flex space-x-4 text-white">
  <a
    href="https://www.pinterest.com/skeepscollection/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-red-600 transition-colors"
  >
    <FaPinterest className="h-6 w-6" />
  </a>
  <a
    href="https://www.tiktok.com/@skeepscollection"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-red-600 transition-colors"
  >
    <FaTiktok className="h-6 w-6" />
  </a>
  <a
    href="https://www.instagram.com/skeepscollection/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-red-600 transition-colors"
  >
    <Instagram className="h-6 w-6" />
  </a>
</div>

          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="text-white hover:text-red-600 transition-colors">Home</a></li>
              <li><a href="#products" className="text-white hover:text-red-600 transition-colors">Products</a></li>
              <li><a href="#about" className="text-white hover:text-red-600 transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-white hover:text-red-600 transition-colors">Contact</a></li>
              <li><a href="#" className="text-white hover:text-red-600 transition-colors">Size Guide</a></li>
              <li><a href="#" className="text-white hover:text-red-600 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">+254</p>
                  <p className="text-white text-sm">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">Skeepscollection@gmail.com</p>
                  <p className="text-white text-sm">We reply within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                 {/* <MapPin className="h-5 w-5 text-red-600 mt-0.5" /> */}
                <div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-sm mb-4 md:mb-0">
              © 2024 Skeepscollection. All rights reserved. Made with ❤️ for creative minds.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-white hover:text-red-600 transition-colors">Privacy Policy</a>
              <a href="#" className="text-white hover:text-red-600 transition-colors">Terms of Service</a>
              <a href="#" className="text-white hover:text-red-600 transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;