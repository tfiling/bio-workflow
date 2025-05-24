import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FlaskRound as Flask, Search, LogOut, User, Menu as MenuIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
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
              {user && (
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
              )}
              {user?.role === 'admin' && (
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
              )}
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

            {/* Auth buttons */}
            <div className="hidden md:ml-4 md:flex md:items-center">
              {user ? (
                <div className="flex items-center">
                  <Link to="/profile" className="relative">
                    <Button variant="outline" size="sm" leftIcon={<User className="h-4 w-4" />}>
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => signOut()}
                    leftIcon={<LogOut className="h-4 w-4" />}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {isSearchOpen && (
          <div className="py-2 border-t border-gray-200 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <Input
                type="text"
                placeholder="Search workflows..."
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
            {user && (
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
            )}
            {user?.role === 'admin' && (
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
            )}
            {!user ? (
              <div className="px-4 py-3 space-y-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" fullWidth>
                    Log In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" fullWidth>
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="px-4 py-3 space-y-2">
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" fullWidth leftIcon={<User className="h-4 w-4" />}>
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  fullWidth
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  leftIcon={<LogOut className="h-4 w-4" />}
                >
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}