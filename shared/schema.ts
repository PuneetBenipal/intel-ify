import { z } from "zod";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subjects: string[];
  studyTimePerDay: number;
  currentStreak: number;
  totalStudyHours: number;
  createdAt: Date;
}

export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  subject: string;
  startDate: Date;
  endDate: Date;
  dailyTasks: DailyTask[];
  status: 'active' | 'completed' | 'paused';
}

export interface DailyTask {
  id: string;
  date: Date;
  topic: string;
  duration: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface Quiz {
  id: string;
  userId: string;
  title: string;
  subject: string;
  questions: Question[];
  completed: boolean;
  score?: number;
  createdAt: Date;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  userAnswer?: number;
}

export interface Flashcard {
  id: string;
  userId: string;
  subject: string;
  front: string;
  back: string;
  mastered: boolean;
  nextReview: Date;
  reviewCount: number;
}

export interface StudySession {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  duration: number;
  date: Date;
  notes?: string;
}

export interface Achievement {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface Message {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Progress {
  userId: string;
  subject: string;
  topic: string;
  mastery: number;
  lastStudied: Date;
  totalTime: number;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  avatar: z.string().optional(),
  subjects: z.array(z.string()),
  studyTimePerDay: z.number().min(15).max(480),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertStudyPlanSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  subject: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
});

export type InsertStudyPlan = z.infer<typeof insertStudyPlanSchema>;

export const insertQuizSchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  content: z.string().optional(),
  numberOfQuestions: z.number().min(1).max(50).default(10),
});

export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export const insertFlashcardSchema = z.object({
  subject: z.string().min(1),
  front: z.string().min(1),
  back: z.string().min(1),
});

export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;

export const insertStudySessionSchema = z.object({
  subject: z.string().min(1),
  topic: z.string().min(1),
  duration: z.number().min(1),
  notes: z.string().optional(),
});

export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;

export const sendMessageSchema = z.object({
  content: z.string().min(1),
});

export type SendMessage = z.infer<typeof sendMessageSchema>;

export const generateContentSchema = z.object({
  subject: z.string().min(1),
  topic: z.string().min(1),
  contentType: z.enum(['summary', 'quiz', 'flashcards']),
  content: z.string(),
});

export type GenerateContent = z.infer<typeof generateContentSchema>;
