import React from 'react';
import { BookOpen, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t dark:border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-emerald-600" />
              <span className="text-xl font-bold">ক্যাম্পাসবন্ধু নোটস হাব</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              শিক্ষার্থীদের জন্য একটি উন্মুক্ত প্ল্যাটফর্ম যেখানে সবাই তাদের ক্লাস নোট শেয়ার করতে পারে।
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">লিঙ্কসমূহ</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="/" className="hover:text-emerald-600">হোমপেজ</a></li>
              <li><a href="/about" className="hover:text-emerald-600">আমাদের সম্পর্কে</a></li>
              <li><a href="/upload" className="hover:text-emerald-600">নোট আপলোড করুন</a></li>
              <li><a href="/admin" className="hover:text-emerald-600">অ্যাডমিন লগইন</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">যোগাযোগ</h3>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:text-emerald-600">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:text-emerald-600">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t dark:border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
          <p>© ২০২৪ ক্যাম্পাসবন্ধু নোটস হাব। সকল স্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
}
