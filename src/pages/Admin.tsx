import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LogOut, 
  Check, 
  X, 
  Trash2, 
  FileText, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Plus,
  Send
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  where,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Note } from '../types';
import { DEPARTMENTS } from '../lib/utils';
import VideoModal from '../components/VideoModal';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    videoURL: '',
    departmentId: '',
    semester: '1',
    courseCode: '',
    tags: '',
    uploadedBy: 'Admin'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Only update if we're not already in a mock session
      if (!user || user.uid !== 'test-admin') {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'notes'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      
      setNotes(fetchedNotes);
      setStats({
        total: fetchedNotes.length,
        approved: fetchedNotes.filter(n => n.status === 'approved').length,
        pending: fetchedNotes.filter(n => n.status === 'pending').length
      });
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Test Credentials Bypass
    if (email === 'admin@test.com' && password === 'password123') {
      setUser({ email: 'admin@test.com', uid: 'test-admin' } as any);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('লগইন ব্যর্থ হয়েছে। ইমেইল এবং পাসওয়ার্ড চেক করুন।');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notes', id), { status: 'approved' });
    } catch (error) {
      console.error("Error approving note:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই নোটটি ডিলিট করতে চান?')) {
      try {
        await deleteDoc(doc(db, 'notes', id));
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.videoURL || !newVideo.departmentId) {
      alert('সবগুলো প্রয়োজনীয় তথ্য পূরণ করুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      const tagsArray = newVideo.tags
        ? newVideo.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag !== '')
        : [];

      await addDoc(collection(db, 'notes'), {
        title: newVideo.title,
        type: 'video',
        departmentId: newVideo.departmentId,
        semester: Number(newVideo.semester),
        uploadedBy: newVideo.uploadedBy,
        description: 'অ্যাডমিন কর্তৃক সরাসরি যুক্ত করা হয়েছে।',
        courseCode: newVideo.courseCode,
        tags: tagsArray,
        fileURL: newVideo.videoURL,
        status: 'approved', // অ্যাডমিন যোগ করলে সরাসরি অ্যাপ্রুভড
        downloads: 0,
        createdAt: serverTimestamp()
      });

      alert('ভিডিও লেকচারটি সফলভাবে যুক্ত করা হয়েছে।');
      setNewVideo({
        title: '',
        videoURL: '',
        departmentId: '',
        semester: '1',
        courseCode: '',
        tags: '',
        uploadedBy: 'Admin'
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding video:", error);
      alert('ভিডিও যুক্ত করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">লোডিং...</div>;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-8">অ্যাডমিন লগইন</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1">ইমেইল</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">পাসওয়ার্ড</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
              লগইন করুন
            </button>
          </form>

          <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Test Credentials</span>
              <button 
                onClick={() => {
                  setEmail('admin@test.com');
                  setPassword('password123');
                }}
                className="text-[10px] font-bold text-emerald-600 hover:underline"
              >
                Auto-fill
              </button>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="text-slate-500">Email:</span> <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">admin@test.com</code></p>
              <p><span className="text-slate-500">Pass:</span> <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">password123</code></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>
          <p className="text-slate-500">নোটস ম্যানেজমেন্ট এবং স্ট্যাটাস</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>ভিডিও যুক্ত করুন</span>
          </button>
          <button
            onClick={() => {
              signOut(auth);
              setUser(null);
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {/* Add Video Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-12 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">নতুন ইউটিউব লেকচার যুক্ত করুন</h2>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleAddVideo} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">ভিডিওর শিরোনাম</label>
              <input
                required
                type="text"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                placeholder="উদা: ডাটা স্ট্রাকচার লেকচার ১"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">ইউটিউব লিঙ্ক</label>
              <input
                required
                type="url"
                value={newVideo.videoURL}
                onChange={(e) => setNewVideo({ ...newVideo, videoURL: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">বিভাগ</label>
              <select
                required
                value={newVideo.departmentId}
                onChange={(e) => setNewVideo({ ...newVideo, departmentId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">নির্বাচন করুন</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">সেমিস্টার</label>
              <select
                required
                value={newVideo.semester}
                onChange={(e) => setNewVideo({ ...newVideo, semester: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>{s}ম সেমিস্টার</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">কোর্স কোড (ঐচ্ছিক)</label>
              <input
                type="text"
                value={newVideo.courseCode}
                onChange={(e) => setNewVideo({ ...newVideo, courseCode: e.target.value })}
                placeholder="CSE-101"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)</label>
              <input
                type="text"
                value={newVideo.tags}
                onChange={(e) => setNewVideo({ ...newVideo, tags: e.target.value })}
                placeholder="lecture, exam, mid"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-2">
              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>যুক্ত হচ্ছে...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>ভিডিও যুক্ত করুন</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">মোট আপলোড</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">অনুমোদিত</p>
            <p className="text-2xl font-bold">{stats.approved}</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">পেন্ডিং</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
        </div>
      </div>

      {/* Pending Notes Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">পেন্ডিং নোটস তালিকা</h2>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
            অ্যাকশন প্রয়োজন
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">নোটের নাম</th>
                <th className="px-6 py-4 font-semibold">আপলোডকারী</th>
                <th className="px-6 py-4 font-semibold">বিভাগ</th>
                <th className="px-6 py-4 font-semibold">সেমিস্টার</th>
                <th className="px-6 py-4 font-semibold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {notes.filter(n => n.status === 'pending').map((note) => (
                <tr key={note.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {note.type === 'video' ? (
                        <Play className="w-5 h-5 text-red-500" />
                      ) : (
                        <FileText className="w-5 h-5 text-emerald-500" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{note.title}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">{note.type}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{note.uploadedBy}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                      {DEPARTMENTS.find(d => d.id === note.departmentId)?.name || note.departmentId}
                    </span>
                  </td>
                  <td className="px-6 py-4">{note.semester}ম</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {note.type === 'video' && (
                        <button
                          onClick={() => setPreviewVideo({ url: note.fileURL, title: note.title })}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Preview Video"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleApprove(note.id)}
                        className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {notes.filter(n => n.status === 'pending').length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    কোনো পেন্ডিং নোট নেই।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VideoModal
        isOpen={!!previewVideo}
        onClose={() => setPreviewVideo(null)}
        videoURL={previewVideo?.url || ''}
        title={previewVideo?.title || ''}
      />
    </div>
  );
}
