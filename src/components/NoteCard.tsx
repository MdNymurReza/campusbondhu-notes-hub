import React, { useState, useEffect } from 'react';
import { FileText, Download, User, Calendar, Tag, Play, Star, MessageSquare, Heart, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Note } from '../types';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment, arrayUnion, arrayRemove, getDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import VideoModal from './VideoModal';
import NoteDetailModal from './NoteDetailModal';

interface Props {
  note: Note;
}

const NoteCard: React.FC<Props> = ({ note }) => {
  const { user, isAdmin } = useAuth();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!user) return;
    const checkBookmark = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const bookmarks = userSnap.data().bookmarks || [];
        setIsBookmarked(bookmarks.includes(note.id));
      }
    };
    checkBookmark();
  }, [user, note.id]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin && (!user || user.uid !== note.userId)) return;
    
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই নোটটি মুছে ফেলতে চান?')) {
      try {
        await deleteDoc(doc(db, 'notes', note.id));
        alert('নোটটি সফলভাবে মুছে ফেলা হয়েছে।');
        window.location.reload();
      } catch (error) {
        console.error("Error deleting note:", error);
        alert('নোটটি মুছতে সমস্যা হয়েছে।');
      }
    }
  };

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert("বুকমার্ক করতে লগইন করুন।");
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    try {
      if (isBookmarked) {
        await updateDoc(userRef, { bookmarks: arrayRemove(note.id) });
        setIsBookmarked(false);
      } else {
        await updateDoc(userRef, { bookmarks: arrayUnion(note.id) });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
    }
  };

  // ইউটিউব ভিডিও আইডি বের করা
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Cloudinary PDF URL অথবা YouTube Thumbnail তৈরি করা
  const getThumbnailUrl = (url: string, type: 'pdf' | 'video') => {
    if (type === 'video') {
      const videoId = getYouTubeId(url);
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : `https://picsum.photos/seed/${note.id}/600/400`;
    }
    
    if (url.includes('cloudinary.com')) {
      return url.replace('.pdf', '.jpg').replace('/upload/', '/upload/c_fill,h_400,w_600,pg_1,f_auto/');
    }
    return `https://picsum.photos/seed/${note.id}/600/400`;
  };

  const handleAction = () => {
    if (note.type === 'video') {
      setIsVideoModalOpen(true);
      return;
    }

    // PDF ডাউনলোড লজিক
    const downloadUrl = note.fileURL.includes('cloudinary.com') 
      ? note.fileURL.replace('/upload/', '/upload/fl_attachment/') 
      : note.fileURL;
    
    window.open(downloadUrl, '_blank');

    try {
      const noteRef = doc(db, 'notes', note.id);
      updateDoc(noteRef, { downloads: increment(1) });
    } catch (error) {
      console.error("Tracking error:", error);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        onClick={() => setIsDetailModalOpen(true)}
        className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
      >
        {/* Thumbnail Preview */}
        <div 
          className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800"
        >
          <img
            src={getThumbnailUrl(note.fileURL, note.type)}
            alt={note.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            {note.type === 'video' ? (
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
                <Download className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-md flex items-center gap-1.5 ${
              note.type === 'video' ? 'bg-red-500/90 text-white' : 'bg-emerald-500/90 text-white'
            }`}>
              {note.type === 'video' ? <Play className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
              <span>{note.type}</span>
            </div>
          </div>

          {/* Bookmark Button */}
          <button 
            onClick={toggleBookmark}
            className={`absolute top-4 right-4 p-2 rounded-xl backdrop-blur-md shadow-lg transition-all active:scale-90 ${
              isBookmarked ? 'bg-rose-500 text-white' : 'bg-white/90 dark:bg-slate-900/90 text-slate-400 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
          </button>

          {(isAdmin || (user && user.uid === note.userId)) && (
            <button 
              onClick={handleDelete}
              className="absolute top-16 right-4 p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-400 hover:text-red-500 backdrop-blur-md shadow-lg transition-all active:scale-90"
              title="মুছে ফেলুন"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex-grow space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {note.courseCode && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-tighter uppercase">
                    {note.courseCode}
                  </span>
                )}
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {note.semester}ম সেমিস্টার
                </span>
              </div>
              <h3 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors duration-300">
                {note.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {note.description || 'কোনো বর্ণনা দেওয়া হয়নি।'}
              </p>
            </div>

            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {note.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-medium border border-slate-100 dark:border-slate-800">
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[100px]">
                  {note.uploadedBy}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">কন্ট্রিবিউটর</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">{note.commentCount || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-[11px] font-bold">{note.rating || '0.0'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">{note.downloads}</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); handleAction(); }}
            className={`mt-6 w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 active:scale-95 ${
              note.type === 'video' 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20'
            }`}
          >
            {note.type === 'video' ? (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>ভিডিও প্লে করুন</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>ডাউনলোড করুন</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoURL={note.fileURL}
        title={note.title}
      />

      <NoteDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        note={note}
      />
    </>
  );
};

export default NoteCard;
