export interface Department {
  id: string;
  name: string;
  code: string;
  icon?: string;
}

export interface Subject {
  id: string;
  name: string;
  departmentId: string;
  semester: number;
}

export interface Note {
  id: string;
  title: string;
  type: 'pdf' | 'video';
  departmentId: string;
  subjectId: string;
  courseCode?: string;
  tags?: string[];
  semester: number;
  description: string;
  fileURL: string; // PDF এর জন্য ফাইল লিঙ্ক, ভিডিওর জন্য ইউটিউব লিঙ্ক
  uploadedBy: string;
  userId?: string;
  status: 'pending' | 'approved';
  downloads: number;
  rating?: number;
  commentCount?: number;
  createdAt: any;
}

export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
