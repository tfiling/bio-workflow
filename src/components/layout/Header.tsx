import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FlaskRound as Flask, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Flask className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">BioWorkflow</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/workflows"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/workflows') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Workflows
              </Link>
              <Link
                to="/assays"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/assays') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Assays
              </Link>
              <Link
                to="/dashboard"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/dashboard') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Admin
              </Link>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center">
            {/* Search */}
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* User info */}
            <div className="hidden md:ml-4 md:flex md:items-center">
              <span className="text-sm text-gray-700">
                Welcome, {user.displayName}
              </span>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {isSearchOpen && (
          <div className="py-2 border-t border-gray-200 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <Input
                type="text"
                placeholder="Search assays..."
                fullWidth
                leftIcon={<Search className="h-4 w-4" />}
                className="bg-gray-50"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-slide-up">
          <div className="pt-2 pb-4 space-y-1 border-t border-gray-200">
            <Link
              to="/"
              className={`block px-4 py-2 text-base font-medium ${
                isActive('/') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/workflows"
              className={`block px-4 py-2 text-base font-medium ${
                isActive('/workflows') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Workflows
            </Link>
            <Link
              to="/assays"
              className={`block px-4 py-2 text-base font-medium ${
                isActive('/assays') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Assays
            </Link>
            <Link
              to="/dashboard"
              className={`block px-4 py-2 text-base font-medium ${
                isActive('/dashboard') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/admin"
              className={`block px-4 py-2 text-base font-medium ${
                isActive('/admin') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}