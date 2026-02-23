import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Filter, Search, Tag } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Note } from '../types';
import NoteCard from '../components/NoteCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { DEPARTMENTS, BANGLA_SEMESTERS } from '../lib/utils';

export default function SubjectDetail() {
  const { deptId, semesterId } = useParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const department = DEPARTMENTS.find(d => d.id === deptId);
  const semesterName = BANGLA_SEMESTERS[Number(semesterId) - 1];

  useEffect(() => {
    if (!deptId || !semesterId) return;

    setLoading(true);
    const q = query(
      collection(db, 'notes'),
      where('departmentId', '==', deptId),
      where('semester', '==', Number(semesterId)),
      where('status', '==', 'approved')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedNotes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      
      const sortedNotes = fetchedNotes.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setNotes(sortedNotes);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [deptId, semesterId]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(note => {
      note.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.courseCode?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || note.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [notes, searchQuery, selectedTag]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-8">
        <Link to="/" className="hover:text-emerald-600">হোম</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/department/${deptId}`} className="hover:text-emerald-600">{department?.name}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 dark:text-slate-100 font-medium">{semesterName}</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{semesterName} এর নোটস</h1>
          <p className="text-slate-500">{filteredNotes.length}টি নোট পাওয়া গেছে</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="নোট খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  !selectedTag 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500'
                }`}
              >
                সব ট্যাগ
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    selectedTag === tag
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500">
            {searchQuery || selectedTag 
              ? 'আপনার ফিল্টার অনুযায়ী কোনো নোট পাওয়া যায়নি।' 
              : 'এই সেমিস্টারে এখনো কোনো নোট আপলোড করা হয়নি।'}
          </p>
          {!searchQuery && !selectedTag && (
            <Link to="/upload" className="inline-block mt-4 text-emerald-600 font-bold hover:underline">
              প্রথম নোটটি আপনি আপলোড করুন!
            </Link>
          )}
          {(searchQuery || selectedTag) && (
            <button 
              onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
              className="mt-4 text-emerald-600 font-bold hover:underline"
            >
              সব নোট দেখুন
            </button>
          )}
        </div>
      )}
    </div>
  );
}
