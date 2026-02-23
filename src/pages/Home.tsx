import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Zap, Shield, Users, BookOpen, Download, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';
import DepartmentCard from '../components/DepartmentCard';
import { DEPARTMENTS } from '../lib/utils';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredDepartments = DEPARTMENTS.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider"
              >
                <Zap className="w-3 h-3" />
                <span>আপনার ডিজিটাল লার্নিং পার্টনার</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
              >
                ভবিষ্যতের পড়াশোনা <br />
                এখন <span className="text-emerald-600">ডিজিটাল</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0"
              >
                ক্যাম্পাসবন্ধু নোটস হাবের মাধ্যমে আপনার বিভাগের সব নোটস, হ্যান্ডআউটস এবং ভিডিও লেকচার পান এক ক্লিকেই।
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative max-w-xl mx-auto lg:mx-0"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="বিভাগ বা বিষয়ের নাম দিয়ে খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none shadow-xl transition-all text-lg"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="font-semibold">৫০০+ নোটস</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <PlayCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-semibold">১০০+ ভিডিও</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="font-semibold">৫০০০+ শিক্ষার্থী</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-1 relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-900">
                <img 
                  src="https://picsum.photos/seed/learning/800/800" 
                  alt="Digital Learning" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-center space-y-2">
            <p className="text-4xl font-black text-emerald-600">৫০০০+</p>
            <p className="text-slate-500 font-medium">সক্রিয় শিক্ষার্থী</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-black text-blue-600">১০০০+</p>
            <p className="text-slate-500 font-medium">মোট রিসোর্স</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-black text-amber-600">৫০+</p>
            <p className="text-slate-500 font-medium">অভিজ্ঞ মেন্টর</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-black text-rose-600">১০+</p>
            <p className="text-slate-500 font-medium">বিভাগসমূহ</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">কেন ক্যাম্পাসবন্ধু বেছে নিবেন?</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">আমরা শিক্ষার্থীদের পড়াশোনাকে সহজ এবং আনন্দদায়ক করতে কাজ করে যাচ্ছি।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-8 h-8 text-emerald-600" />,
              title: "দ্রুত এক্সেস",
              description: "যেকোনো সময় যেকোনো জায়গা থেকে আপনার প্রয়োজনীয় নোটস এক্সেস করুন।"
            },
            {
              icon: <Shield className="w-8 h-8 text-blue-600" />,
              title: "যাচাইকৃত নোটস",
              description: "আমাদের প্রতিটি নোট অভিজ্ঞ মেন্টর এবং অ্যাডমিন দ্বারা যাচাই করা।"
            },
            {
              icon: <Users className="w-8 h-8 text-amber-600" />,
              title: "কমিউনিটি সাপোর্ট",
              description: "অন্যান্য শিক্ষার্থীদের সাথে জ্ঞান শেয়ার করুন এবং একে অপরকে সাহায্য করুন।"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Departments Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">বিভাগসমূহ</h2>
            <p className="text-slate-500">আপনার বিভাগ নির্বাচন করে পড়াশোনা শুরু করুন</p>
          </div>
          <div className="hidden md:block h-1 flex-1 bg-slate-200 dark:bg-slate-800 mx-12 rounded-full"></div>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredDepartments.map((dept) => (
            <motion.div
              key={dept.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <DepartmentCard {...dept} />
            </motion.div>
          ))}
        </motion.div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            কোনো বিভাগ খুঁজে পাওয়া যায়নি।
          </div>
        )}
      </section>

      {/* Most Downloaded Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">জনপ্রিয় নোটস</h2>
            <p className="text-slate-500">শিক্ষার্থীদের সবচেয়ে বেশি পছন্দের রিসোর্সগুলো</p>
          </div>
          <div className="hidden md:block h-1 flex-1 bg-slate-200 dark:bg-slate-800 mx-12 rounded-full"></div>
        </div>
        
        <PopularNotes />
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-12 md:p-20 bg-emerald-600 rounded-[3rem] overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold">আপনিও কি অবদান রাখতে চান?</h2>
            <p className="text-xl text-emerald-50">আপনার কাছে থাকা ভালো নোটস বা লেকচার ভিডিও শেয়ার করে অন্য শিক্ষার্থীদের সাহায্য করুন এবং আমাদের কমিউনিটিকে আরও সমৃদ্ধ করুন।</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/upload" 
                className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-xl"
              >
                এখনই আপলোড করুন
              </a>
              <a 
                href="/about" 
                className="px-8 py-4 bg-emerald-700 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all"
              >
                আরও জানুন
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PopularNotes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        
        // ইনডেক্স এরর এড়াতে সিম্পল কুয়েরি ব্যবহার করা হচ্ছে
        const q = query(
          collection(db, 'notes'),
          where('status', '==', 'approved')
        );
        
        const snapshot = await getDocs(q);
        const fetchedNotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // ক্লায়েন্ট সাইডে ডাউনলোড অনুযায়ী সর্ট করে প্রথম ৩টি নেওয়া হচ্ছে
        const popular = fetchedNotes
          .sort((a: any, b: any) => (b.downloads || 0) - (a.downloads || 0))
          .slice(0, 3);
          
        setNotes(popular);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
    {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>)}
  </div>;

  if (notes.length === 0) return null;

  return (
    <motion.div 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {notes.map(note => (
        <motion.div
          key={note.id}
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            show: { opacity: 1, scale: 1 }
          }}
        >
          <NoteCard note={note} />
        </motion.div>
      ))}
    </motion.div>
  );
}

import NoteCard from '../components/NoteCard';
