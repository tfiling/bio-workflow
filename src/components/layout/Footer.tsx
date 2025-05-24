import { Link } from 'react-router-dom';
import { FlaskRound as Flask, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:order-2 space-x-6">
            <Link to="/about" className="text-gray-500 hover:text-gray-600">
              About
            </Link>
            <Link to="/contact" className="text-gray-500 hover:text-gray-600">
              Contact
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-gray-600">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-600">
              Terms
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1 flex flex-col md:flex-row items-center">
            <div className="flex items-center">
              <Flask className="h-6 w-6 text-primary-500" />
              <span className="ml-2 text-lg font-bold text-gray-900">BioWorkflow</span>
            </div>
            <p className="mt-2 md:mt-0 md:ml-4 text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} BioWorkflow. All rights reserved.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 py-4">
          <p className="text-center text-xs text-gray-500 flex items-center justify-center">
            Made with <Heart className="h-3 w-3 text-error-500 mx-1" /> for microbiology researchers
          </p>
        </div>
      </div>
    </footer>
  );
}