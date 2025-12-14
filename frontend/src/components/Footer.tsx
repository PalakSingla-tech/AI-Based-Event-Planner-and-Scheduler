import { Sparkles, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-purple-600 to-teal-500 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Eventura</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Where Every Event Becomes an Adventure. Creating memorable experiences that leave a lasting impression.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400 text-sm">Wedding Planning</li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">Corporate Events</li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">Birthday Parties</li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">Destination Events</li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">Sector 21, Gurugram, Haryana, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">support@eventura.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">+91 124 456 7890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2025 Eventura. All rights reserved.
            </p>

            <div className="flex space-x-4">
              <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Facebook className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400" />
              </button>
              <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Twitter className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400" />
              </button>
              <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Instagram className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400" />
              </button>
              <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Linkedin className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400" />
              </button>
            </div>

            <div className="flex space-x-4 text-sm">
              <button className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Privacy Policy
              </button>
              <button className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
