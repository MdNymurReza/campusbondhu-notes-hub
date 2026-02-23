import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Upload, ShieldCheck, Menu, X, User as UserIcon, LogIn } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, loginWithGoogle } = useAuth();

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              ক্যাম্পাসবন্ধু নোটস
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-emerald-600 transition-colors">হোম</Link>
            <Link to="/about" className="hover:text-emerald-600 transition-colors">আমাদের সম্পর্কে</Link>
            <Link to="/upload" className="flex items-center space-x-1 hover:text-emerald-600 transition-colors">
              <Upload className="w-4 h-4" />
              <span>নোট আপলোড</span>
            </Link>
            <Link to="/admin" className="flex items-center space-x-1 hover:text-emerald-600 transition-colors">
            </Link>
            
            {user ? (
              <Link to="/profile" className="flex items-center space-x-2 p-1.5 pr-4 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group">
                <img 
                  src={user.photoURL || ''} 
                  alt={user.displayName || ''} 
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900"
                />
                <span className="text-sm font-bold group-hover:text-emerald-600">প্রোফাইল</span>
              </Link>
            ) : (
              <button 
                onClick={loginWithGoogle}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-bold text-sm shadow-lg shadow-emerald-600/20"
              >
                <LogIn className="w-4 h-4" />
                <span>লগইন</span>
              </button>
            )}
            
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t dark:border-slate-800 px-4 pt-2 pb-6 space-y-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="block py-2">হোম</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="block py-2">আমাদের সম্পর্কে</Link>
          <Link to="/upload" onClick={() => setIsOpen(false)} className="block py-2">নোট আপলোড</Link>
          {/* <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-2">অ্যাডমিন প্যানেল</Link> */}
          {user ? (
            <Link to="/profile" onClick={() => setIsOpen(false)} className="block py-2 font-bold text-emerald-600">আমার প্রোফাইল</Link>
          ) : (
            <button 
              onClick={() => { loginWithGoogle(); setIsOpen(false); }}
              className="w-full text-left py-2 font-bold text-emerald-600"
            >
              লগইন করুন
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
