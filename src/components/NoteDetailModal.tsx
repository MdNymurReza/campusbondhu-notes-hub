import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Star, 
  MessageSquare, 
  Send, 
  User, 
  Calendar, 
  Download, 
  Play,
  FileText,
  ThumbsUp
} from 'lucide-react';
import { Note } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  note: Note;
}

interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
  createdAt: any;
  rating: number;
}

export default function NoteDetailModal({ isOpen, onClose, note }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const q = query(
      collection(db, 'comments'),
      where('noteId', '==', note.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [isOpen, note.id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        noteId: note.id,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        text: newComment,
        rating: rating,
        createdAt: serverTimestamp()
      });

      // Update note rating average (simplified: just increment count for now)
      const noteRef = doc(db, 'notes', note.id);
      await updateDoc(noteRef, {
        commentCount: increment(1)
      });

      setNewComment('');
      setRating(5);
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${note.type === 'video' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
                  {note.type === 'video' ? <Play className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold line-clamp-1">{note.title}</h2>
                  <p className="text-xs text-slate-500">{note.courseCode} • {note.semester}ম সেমিস্টার</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Details */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">বর্ণনা</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {note.description || 'কোনো বর্ণনা দেওয়া হয়নি।'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <User className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">আপলোড করেছেন</span>
                      </div>
                      <p className="font-bold text-sm">{note.uploadedBy}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">আপলোড তারিখ</span>
                      </div>
                      <p className="font-bold text-sm">ফেব্রুয়ারি ২০২৪</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl">
                      <Star className="w-4 h-4 fill-amber-600" />
                      <span className="font-bold">{note.rating || '0.0'} রেটিং</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                      <Download className="w-4 h-4" />
                      <span className="font-bold">{note.downloads} ডাউনলোড</span>
                    </div>
                  </div>
                </div>

                {/* Right: Comments & Ratings */}
                <div className="flex flex-col h-full">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    মন্তব্য ও রেটিং ({comments.length})
                  </h3>

                  {/* Comment Form */}
                  {user ? (
                    <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-500">আপনার রেটিং:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setRating(s)}
                              className="focus:outline-none"
                            >
                              <Star className={`w-5 h-5 ${s <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="আপনার মতামত লিখুন..."
                          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-24 text-sm"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting || !newComment.trim()}
                          className="absolute bottom-3 right-3 p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center mb-8">
                      <p className="text-sm text-slate-500 mb-2">মন্তব্য করতে লগইন করুন</p>
                    </div>
                  )}

                  {/* Comments List */}
                  <div className="space-y-6 flex-grow overflow-y-auto pr-2">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <img src={comment.userPhoto} alt={comment.userName} className="w-10 h-10 rounded-full" />
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-bold">{comment.userName}</h4>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} className={`w-3 h-3 ${s <= comment.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                              {comment.text}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-[10px] text-slate-400">২ দিন আগে</span>
                              <button className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-emerald-600">
                                <ThumbsUp className="w-3 h-3" />
                                সাহায্যকারী
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-slate-400">
                        <p className="text-sm italic">এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনিই করুন!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <p className="text-sm text-slate-500">এই রিসোর্সটি আপনার ভালো লাগলে রেটিং দিন।</p>
              <button
                onClick={() => {
                  onClose();
                  // Trigger original action
                  const downloadUrl = note.fileURL.includes('cloudinary.com') 
                    ? note.fileURL.replace('/upload/', '/upload/fl_attachment/') 
                    : note.fileURL;
                  window.open(downloadUrl, '_blank');
                }}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                  note.type === 'video' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                }`}
              >
                {note.type === 'video' ? <Play className="w-4 h-4 fill-white" /> : <Download className="w-4 h-4" />}
                <span>{note.type === 'video' ? 'ভিডিও প্লে করুন' : 'ডাউনলোড করুন'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
