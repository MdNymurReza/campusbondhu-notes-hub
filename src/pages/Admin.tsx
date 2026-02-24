import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Trash2, 
  FileText, 
  BarChart3,
  Clock,
  CheckCircle,
  Play,
  Plus,
  Send,
  Users,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Note } from '../types';
import { DEPARTMENTS } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import VideoModal from '../components/VideoModal';

export default function Admin() {
  const { isAdmin, loading: authLoading } = useAuth();
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
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAdmin) return;

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
  }, [isAdmin]);

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
        status: 'approved',
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

  if (authLoading) return <div className="flex items-center justify-center h-screen">লোডিং...</div>;

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="p-6 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
          <ShieldCheck className="w-12 h-12 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">প্রবেশাধিকার সংরক্ষিত</h1>
        <p className="text-slate-500 text-center max-w-md">
          দুঃখিত, এই পেজটি শুধুমাত্র অ্যাডমিনদের জন্য। আপনার যদি মনে হয় এটি ভুল, তবে কর্তৃপক্ষের সাথে যোগাযোগ করুন।
        </p>
      </div>
    );
  }

  const filteredNotes = notes.filter(note => {
    const matchesTab = activeTab === 'all' || note.status === activeTab;
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         note.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Admin Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">অ্যাডমিন কন্ট্রোল সেন্টার</h1>
                <p className="text-sm text-slate-500 font-medium">ক্যাম্পাসবন্ধু নোটস ম্যানেজমেন্ট</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>ভিডিও লেকচার</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.total}</p>
            <p className="text-xs text-slate-500 mt-1">মোট আপলোডকৃত রিসোর্স</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approved</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.approved}</p>
            <p className="text-xs text-slate-500 mt-1">অনুমোদিত রিসোর্স</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.pending}</p>
            <p className="text-xs text-slate-500 mt-1">অপেক্ষমান রিসোর্স</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Admins</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">১</p>
            <p className="text-xs text-slate-500 mt-1">সক্রিয় অ্যাডমিন</p>
          </motion.div>
        </div>

        {/* Add Video Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-12 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600" />
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">নতুন ইউটিউব লেকচার যুক্ত করুন</h2>
                  <p className="text-sm text-slate-500">সরাসরি ডাটাবেসে ভিডিও যুক্ত করার ফরম</p>
                </div>
                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddVideo} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">ভিডিওর শিরোনাম</label>
                  <input
                    required
                    type="text"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    placeholder="উদা: ডাটা স্ট্রাকচার লেকচার ১"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">ইউটিউব লিঙ্ক</label>
                  <input
                    required
                    type="url"
                    value={newVideo.videoURL}
                    onChange={(e) => setNewVideo({ ...newVideo, videoURL: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">বিভাগ</label>
                  <select
                    required
                    value={newVideo.departmentId}
                    onChange={(e) => setNewVideo({ ...newVideo, departmentId: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">সেমিস্টার</label>
                  <select
                    required
                    value={newVideo.semester}
                    onChange={(e) => setNewVideo({ ...newVideo, semester: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>{s}ম সেমিস্টার</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">কোর্স কোড (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={newVideo.courseCode}
                    onChange={(e) => setNewVideo({ ...newVideo, courseCode: e.target.value })}
                    placeholder="CSE-101"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)</label>
                  <input
                    type="text"
                    value={newVideo.tags}
                    onChange={(e) => setNewVideo({ ...newVideo, tags: e.target.value })}
                    placeholder="lecture, exam, mid"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span>যুক্ত হচ্ছে...</span>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        <span>ভিডিও লেকচার পাবলিশ করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Management */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-8 border-b dark:border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
                <button 
                  onClick={() => setActiveTab('pending')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  পেন্ডিং ({stats.pending})
                </button>
                <button 
                  onClick={() => setActiveTab('approved')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'approved' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  অনুমোদিত ({stats.approved})
                </button>
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  সবগুলো
                </button>
              </div>

              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="নোটের নাম বা আপলোডকারী দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">রিসোর্স বিবরণ</th>
                  <th className="px-8 py-5">আপলোডকারী</th>
                  <th className="px-8 py-5">বিভাগ ও সেমিস্টার</th>
                  <th className="px-8 py-5">স্ট্যাটাস</th>
                  <th className="px-8 py-5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {filteredNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${note.type === 'video' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500'}`}>
                          {note.type === 'video' ? <Play className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{note.title}</span>
                          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">{note.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Users className="w-3 h-3 text-slate-400" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{note.uploadedBy}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          {DEPARTMENTS.find(d => d.id === note.departmentId)?.name || note.departmentId}
                        </span>
                        <span className="text-xs text-slate-400">{note.semester}ম সেমিস্টার</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        note.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {note.status === 'approved' ? 'অনুমোদিত' : 'পেন্ডিং'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {note.type === 'video' && (
                          <button
                            onClick={() => setPreviewVideo({ url: note.fileURL, title: note.title })}
                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                            title="Preview Video"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        {note.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(note.id)}
                            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredNotes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-4">
                          <Filter className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium">কোনো রিসোর্স খুঁজে পাওয়া যায়নি।</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
