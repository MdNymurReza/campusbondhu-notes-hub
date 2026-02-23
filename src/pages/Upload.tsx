import React, { useState } from 'react';
import { Upload as UploadIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import axios from 'axios';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BANGLA_SEMESTERS, DEPARTMENTS } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export default function Upload() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'pdf' as 'pdf' | 'video',
    departmentId: '',
    semester: '1',
    uploadedBy: user?.displayName || '',
    description: '',
    courseCode: '',
    tags: '',
    videoURL: ''
  });
  const [file, setFile] = useState<File | null>(null);

  // Cloudinary কনফিগারেশন
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dhfqa6coe';
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'notes_preset';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('শুধুমাত্র PDF ফাইল আপলোড করা যাবে।');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('ফাইলের সাইজ ১০ মেগাবাইটের বেশি হতে পারবে না।');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.type === 'pdf' && !file) {
      setError('দয়া করে একটি PDF ফাইল নির্বাচন করুন।');
      return;
    }

    if (formData.type === 'video' && !formData.videoURL) {
      setError('দয়া করে ইউটিউব ভিডিও লিঙ্কটি দিন।');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let finalURL = formData.videoURL;

      if (formData.type === 'pdf' && file) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        uploadData.append('resource_type', 'auto'); 

        const cloudinaryRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
          uploadData
        );
        finalURL = cloudinaryRes.data.secure_url;
      }

      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag !== '')
        : [];

      await addDoc(collection(db, 'notes'), {
        title: formData.title,
        type: formData.type,
        departmentId: formData.departmentId,
        semester: Number(formData.semester),
        uploadedBy: formData.uploadedBy,
        userId: user?.uid || null,
        description: formData.description,
        courseCode: formData.courseCode,
        tags: tagsArray,
        fileURL: finalURL,
        status: 'pending',
        downloads: 0,
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      setFormData({
        title: '',
        type: 'pdf',
        departmentId: '',
        semester: '1',
        uploadedBy: '',
        description: '',
        courseCode: '',
        tags: '',
        videoURL: ''
      });
      setFile(null);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError('আপলোড করার সময় সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-xl border border-emerald-100 dark:border-emerald-900/30"
        >
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">ধন্যবাদ!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            আপনার নোটটি সফলভাবে জমা দেওয়া হয়েছে। অ্যাডমিন রিভিউ করার পর এটি সবার জন্য উন্মুক্ত করা হবে।
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            আরেকটি আপলোড করুন
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2">নোট আপলোড করুন</h1>
        <p className="text-slate-500">আপনার তৈরি করা নোট শেয়ার করে অন্যদের সাহায্য করুন</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">রিসোর্স টাইপ</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'pdf' | 'video' })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="pdf">PDF নোট</option>
              <option value="video">ভিডিও লেকচার (ইউটিউব)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">শিরোনাম</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="উদা: ডাটা স্ট্রাকচার লেকচার ১"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">আপনার নাম</label>
            <input
              required
              type="text"
              value={formData.uploadedBy}
              onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
              placeholder="আপনার পূর্ণ নাম"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">বিভাগ</label>
            <select
              required
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
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
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {BANGLA_SEMESTERS.map((semester, index) => (
                <option key={index + 1} value={index + 1}>{semester}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">কোর্স কোড (ঐচ্ছিক)</label>
            <input
              type="text"
              value={formData.courseCode}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
              placeholder="উদা: CSE-101"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="উদা: lecture, exam, mid"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">বর্ণনা (ঐচ্ছিক)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="নোট বা ভিডিও সম্পর্কে কিছু লিখুন..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
          ></textarea>
        </div>

        {formData.type === 'video' ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold">ইউটিউব ভিডিও লিঙ্ক</label>
            <input
              required
              type="url"
              value={formData.videoURL}
              onChange={(e) => setFormData({ ...formData, videoURL: e.target.value })}
              placeholder="উদা: https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-semibold">PDF ফাইল নির্বাচন করুন (সর্বোচ্চ ১০ মেগাবাইট)</label>
            <div className="relative group">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center space-y-3 group-hover:border-emerald-500 transition-colors">
                <UploadIcon className="w-10 h-10 text-slate-400 group-hover:text-emerald-500" />
                <p className="text-sm text-slate-500">
                  {file ? file.name : 'ক্লিক করুন অথবা ফাইলটি ড্র্যাগ করে এখানে আনুন'}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>আপলোড হচ্ছে...</span>
            </>
          ) : (
            <span>নোট জমা দিন</span>
          )}
        </button>
      </form>
    </div>
  );
}
