import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, BookOpen, Heart, Shield, Zap } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: <Target className="w-6 h-6 text-emerald-600" />,
      title: "আমাদের লক্ষ্য",
      description: "শিক্ষার্থীদের জন্য মানসম্মত নোটস এবং রিসোর্স সহজলভ্য করা যাতে তাদের পড়াশোনা আরও সহজ ও কার্যকর হয়।"
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "কমিউনিটি ভিত্তিক",
      description: "ক্যাম্পাসবন্ধু একটি শিক্ষার্থী-চালিত প্ল্যাটফর্ম যেখানে সবাই সবার সাথে জ্ঞান শেয়ার করতে পারে।"
    },
    {
      icon: <Shield className="w-6 h-6 text-amber-600" />,
      title: "নির্ভরযোগ্যতা",
      description: "প্রতিটি নোট এবং ভিডিও লেকচার আমাদের অ্যাডমিন প্যানেল দ্বারা যাচাই করা হয়।"
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-600/5 dark:bg-emerald-600/10 -skew-y-6 transform origin-top-left" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
              ক্যাম্পাসবন্ধু নোটস হাব
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              শিক্ষার্থীদের জন্য একটি আধুনিক ডিজিটাল লাইব্রেরি। যেখানে আপনি পাবেন আপনার বিভাগের সকল প্রয়োজনীয় নোটস, হ্যান্ডআউটস এবং ভিডিও লেকচার—সবই এক জায়গায়।
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Purpose */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="p-3 bg-slate-50 dark:bg-slate-800 w-fit rounded-2xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Detailed Story */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-6">কেন ক্যাম্পাসবন্ধু?</h2>
                <div className="space-y-4 text-slate-600 dark:text-slate-400">
                  <p>
                    বিশ্ববিদ্যালয় জীবনে সঠিক সময়ে সঠিক নোটস পাওয়া অনেক সময় চ্যালেঞ্জিং হয়ে দাঁড়ায়। অনেক সময় আমরা গুরুত্বপূর্ণ লেকচার মিস করি অথবা পরীক্ষার আগে গোছানো কোনো ম্যাটেরিয়াল খুঁজে পাই না।
                  </p>
                  <p>
                    এই সমস্যা সমাধানের লক্ষ্যেই ক্যাম্পাসবন্ধুর যাত্রা শুরু। আমরা বিশ্বাস করি, জ্ঞান সবার জন্য উন্মুক্ত হওয়া উচিত। এখানে শিক্ষার্থীরা তাদের তৈরি করা নোটস শেয়ার করতে পারে এবং অন্যদের শেয়ার করা রিসোর্স থেকে উপকৃত হতে পারে।
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold">দ্রুত এক্সেস</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold">বিশাল সংগ্রহ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold">সম্পূর্ণ ফ্রি</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <img 
                  src="https://picsum.photos/seed/education/800/600" 
                  alt="Education" 
                  className="rounded-3xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-6 -right-6 bg-emerald-600 text-white p-8 rounded-3xl hidden md:block">
                  <p className="text-4xl font-bold">১০০০+</p>
                  <p className="text-sm opacity-80">সংগৃহীত নোটস</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-emerald-600 rounded-[3rem] text-white shadow-2xl shadow-emerald-600/20"
          >
            <h2 className="text-3xl font-bold mb-6">আপনিও কি অবদান রাখতে চান?</h2>
            <p className="text-emerald-50 mb-8 text-lg">
              আপনার কাছে থাকা ভালো নোটস বা লেকচার ভিডিও শেয়ার করে অন্য শিক্ষার্থীদের সাহায্য করুন।
            </p>
            <a 
              href="/upload" 
              className="inline-block px-8 py-4 bg-white text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-colors"
            >
              এখনই আপলোড করুন
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
