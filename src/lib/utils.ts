import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BANGLA_SEMESTERS = [
  "১ম সেমিস্টার",
  "২য় সেমিস্টার",
  "৩য় সেমিস্টার",
  "৪র্থ সেমিস্টার",
  "৫ম সেমিস্টার",
  "৬ষ্ঠ সেমিস্টার",
  "৭ম সেমিস্টার",
  "৮ম সেমিস্টার",
  "৯ম সেমিস্টার",
  "১০ম সেমিস্টার",
  "11তম সেমিস্টার",
  "12তম সেমিস্টার"
];

export const DEPARTMENTS = [
  { id: "cse", name: "কম্পিউটার সায়েন্স", code: "CSE" },
  { id: "eee", name: "ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং", code: "EEE" },
  { id: "civil", name: "সিভিল ইঞ্জিনিয়ারিং", code: "CE" },
  // { id: "me", name: "মেকানিক্যাল ইঞ্জিনিয়ারিং", code: "ME" },
  // { id: "bba", name: "ব্যবসায় প্রশাসন", code: "BBA" },
  // { id: "english", name: "ইংরেজি বিভাগ", code: "ENG" }
];
