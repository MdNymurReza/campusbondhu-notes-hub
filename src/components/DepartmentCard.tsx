import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap } from 'lucide-react';

interface Props {
  id: string;
  name: string;
  code: string;
  key?: string;
}

export default function DepartmentCard({ id, name, code }: Props) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link
        to={`/department/${id}`}
        className="block p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all group"
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
          <GraduationCap className="w-6 h-6 text-emerald-600 group-hover:text-white" />
        </div>
        <h3 className="text-lg font-bold mb-1">{name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{code} বিভাগ</p>
      </Link>
    </motion.div>
  );
}
