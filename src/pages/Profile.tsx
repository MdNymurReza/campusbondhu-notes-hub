import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  BookMarked, 
  FileUp, 
  Settings, 
  LogOut,
  ChevronRight,
  Heart
} from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Note } from '../types';
import NoteCard from '../components/NoteCard';

export default function Profile() {
  const { user, logout, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'uploads' | 'bookmarks'>('uploads');
  const [uploadedNotes, setUploadedNotes] = useState<Note[]>([]);
  const [bookmarkedNotes, setBookmarkedNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Uploads
        const uploadsQuery = query(
          collection(db, 'notes'), 
          where('userId', '==', user.uid)
        );
        const uploadsSnap = await getDocs(uploadsQuery);
        const uploads = uploadsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
        setUploadedNotes(uploads);

        // Fetch Bookmarks (from user document)
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const bookmarkIds = userSnap.data().bookmarks || [];
          if (bookmarkIds.length > 0) {
            const bookmarks: Note[] = [];
            for (const id of bookmarkIds) {
              const noteSnap = await getDoc(doc(db, 'notes', id));
              if (noteSnap.exists()) {
                bookmarks.push({ id: noteSnap.id, ...noteSnap.data() } as Note);
              }
            }
            setBookmarkedNotes(bookmarks);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-xl border border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserIcon className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">প্রোফাইল দেখতে লগইন করুন</h1>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            আপনার আপলোড করা নোটস এবং বুকমার্ক করা ফাইলগুলো দেখতে আপনার গুগল অ্যাকাউন্ট দিয়ে লগইন করুন।
          </p>
          <button 
            onClick={loginWithGoogle}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
          >
            গুগল দিয়ে লগইন করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                  alt={user.displayName || 'User'} 
                  className="w-24 h-24 rounded-full border-4 border-emerald-500/20 p-1"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900"></div>
              </div>
              <h2 className="text-xl font-bold mt-4">{user.displayName}</h2>
              <p className="text-xs text-slate-500 mt-1">{user.email}</p>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('uploads')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                  activeTab === 'uploads' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileUp className="w-5 h-5" />
                  <span className="font-bold text-sm">আমার আপলোড</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setActiveTab('bookmarks')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                  activeTab === 'bookmarks' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookMarked className="w-5 h-5" />
                  <span className="font-bold text-sm">বুকমার্কস</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-sm">লগআউট</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Stats Card */}
          <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-600/20">
            <h3 className="font-bold mb-4">আপনার প্রোফাইল স্ট্যাটস</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-2xl font-black">{uploadedNotes.length}</p>
                <p className="text-[10px] uppercase font-bold opacity-70">আপলোড</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-2xl font-black">{bookmarkedNotes.length}</p>
                <p className="text-[10px] uppercase font-bold opacity-70">বুকমার্ক</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              {activeTab === 'uploads' ? 'আমার আপলোড করা নোটস' : 'বুকমার্ক করা নোটস'}
            </h1>
            <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold">
              মোট: {activeTab === 'uploads' ? uploadedNotes.length : bookmarkedNotes.length}টি
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl"></div>
              ))}
            </div>
          ) : (
            <>
              {(activeTab === 'uploads' ? uploadedNotes : bookmarkedNotes).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(activeTab === 'uploads' ? uploadedNotes : bookmarkedNotes).map(note => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    {activeTab === 'uploads' ? <FileUp className="w-8 h-8 text-slate-400" /> : <Heart className="w-8 h-8 text-slate-400" />}
                  </div>
                  <h3 className="text-xl font-bold mb-2">কোনো নোট পাওয়া যায়নি</h3>
                  <p className="text-slate-500">
                    {activeTab === 'uploads' 
                      ? 'আপনি এখনো কোনো নোট আপলোড করেননি।' 
                      : 'আপনি এখনো কোনো নোট বুকমার্ক করেননি।'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
