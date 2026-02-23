import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Book } from 'lucide-react';
import { motion } from 'motion/react';
import { DEPARTMENTS, BANGLA_SEMESTERS } from '../lib/utils';

export default function DepartmentDetail() {
  const { deptId } = useParams();
  const department = DEPARTMENTS.find(d => d.id === deptId);

  if (!department) return <div className="text-center py-20">বিভাগ পাওয়া যায়নি।</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-8">
        <Link to="/" className="hover:text-emerald-600">হোম</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 dark:text-slate-100 font-medium">{department.name}</span>
      </nav>

      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">{department.name}</h1>
        <p className="text-slate-500">সেমিস্টার অনুযায়ী বিষয়গুলো দেখুন</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BANGLA_SEMESTERS.map((semester, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-emerald-600">{semester}</h3>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                {index + 1}st Year
              </span>
            </div>
            
            <div className="space-y-3">
              {/* Sample Subjects - In real app, fetch from Firestore */}
              <Link
                to={`/department/${deptId}/semester/${index + 1}`}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Book className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                  <span className="font-medium">এই সেমিস্টারের নোটস দেখুন</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
