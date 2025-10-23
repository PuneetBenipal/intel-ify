import type {
  User,
  StudyPlan,
  Quiz,
  Flashcard,
  StudySession,
  Achievement,
  Message,
  Progress,
  InsertUser,
  InsertStudyPlan,
  InsertQuiz,
  InsertFlashcard,
  InsertStudySession,
} from "../shared/schema.js";

export interface IStorage {
  // User operations
  getUser(userId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<User>;
  
  // Study plan operations
  getStudyPlans(userId: string): Promise<StudyPlan[]>;
  getStudyPlan(id: string): Promise<StudyPlan | undefined>;
  createStudyPlan(userId: string, plan: InsertStudyPlan): Promise<StudyPlan>;
  updateStudyPlan(id: string, updates: Partial<StudyPlan>): Promise<StudyPlan>;
  
  // Quiz operations
  getQuizzes(userId: string): Promise<Quiz[]>;
  getQuiz(id: string): Promise<Quiz | undefined>;
  createQuiz(userId: string, quiz: Omit<Quiz, 'id' | 'userId' | 'createdAt'>): Promise<Quiz>;
  updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz>;
  
  // Flashcard operations
  getFlashcards(userId: string, subject?: string): Promise<Flashcard[]>;
  createFlashcard(userId: string, flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard>;
  
  // Study session operations
  getStudySessions(userId: string, limit?: number): Promise<StudySession[]>;
  createStudySession(userId: string, session: InsertStudySession): Promise<StudySession>;
  
  // Achievement operations
  getAchievements(userId: string): Promise<Achievement[]>;
  unlockAchievement(userId: string, achievement: Omit<Achievement, 'id' | 'userId' | 'unlockedAt'>): Promise<Achievement>;
  
  // Message operations
  getMessages(userId: string): Promise<Message[]>;
  createMessage(userId: string, role: 'user' | 'assistant', content: string): Promise<Message>;
  
  // Progress operations
  getProgress(userId: string): Promise<Progress[]>;
  updateProgress(userId: string, subject: string, topic: string, mastery: number): Promise<Progress>;
}

class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private studyPlans: Map<string, StudyPlan> = new Map();
  private quizzes: Map<string, Quiz> = new Map();
  private flashcards: Map<string, Flashcard> = new Map();
  private studySessions: Map<string, StudySession> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private messages: Map<string, Message> = new Map();
  private progress: Map<string, Progress> = new Map();
  
  constructor() {
    // Initialize with demo user
    const demoUser: User = {
      id: 'user-1',
      name: 'Alex',
      email: 'alex@example.com',
      subjects: ['Mathematics', 'Physics', 'Chemistry'],
      studyTimePerDay: 120,
      currentStreak: 7,
      totalStudyHours: 24.5,
      createdAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);
    
    // Initialize demo progress
    const subjects = ['Mathematics', 'Physics', 'Chemistry'];
    subjects.forEach(subject => {
      const key = `user-1-${subject}`;
      this.progress.set(key, {
        userId: 'user-1',
        subject,
        topic: 'General',
        mastery: subject === 'Mathematics' ? 85 : subject === 'Physics' ? 60 : 45,
        lastStudied: new Date(),
        totalTime: 0,
      });
    });
  }
  
  async getUser(userId: string): Promise<User | undefined> {
    return this.users.get(userId);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...user,
      currentStreak: 0,
      totalStudyHours: 0,
      createdAt: new Date(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }
  
  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    const updated = { ...user, ...updates };
    this.users.set(userId, updated);
    return updated;
  }
  
  async getStudyPlans(userId: string): Promise<StudyPlan[]> {
    return Array.from(this.studyPlans.values()).filter(plan => plan.userId === userId);
  }
  
  async getStudyPlan(id: string): Promise<StudyPlan | undefined> {
    return this.studyPlans.get(id);
  }
  
  async createStudyPlan(userId: string, plan: InsertStudyPlan): Promise<StudyPlan> {
    const newPlan: StudyPlan = {
      id: `plan-${Date.now()}`,
      userId,
      ...plan,
      startDate: new Date(plan.startDate),
      endDate: new Date(plan.endDate),
      dailyTasks: [],
      status: 'active',
    };
    this.studyPlans.set(newPlan.id, newPlan);
    return newPlan;
  }
  
  async updateStudyPlan(id: string, updates: Partial<StudyPlan>): Promise<StudyPlan> {
    const plan = this.studyPlans.get(id);
    if (!plan) throw new Error('Study plan not found');
    const updated = { ...plan, ...updates };
    this.studyPlans.set(id, updated);
    return updated;
  }
  
  async getQuizzes(userId: string): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(quiz => quiz.userId === userId);
  }
  
  async getQuiz(id: string): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }
  
  async createQuiz(userId: string, quiz: Omit<Quiz, 'id' | 'userId' | 'createdAt'>): Promise<Quiz> {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      userId,
      ...quiz,
      createdAt: new Date(),
    };
    this.quizzes.set(newQuiz.id, newQuiz);
    return newQuiz;
  }
  
  async updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz> {
    const quiz = this.quizzes.get(id);
    if (!quiz) throw new Error('Quiz not found');
    const updated = { ...quiz, ...updates };
    this.quizzes.set(id, updated);
    return updated;
  }
  
  async getFlashcards(userId: string, subject?: string): Promise<Flashcard[]> {
    let cards = Array.from(this.flashcards.values()).filter(card => card.userId === userId);
    if (subject) {
      cards = cards.filter(card => card.subject === subject);
    }
    return cards;
  }
  
  async createFlashcard(userId: string, flashcard: InsertFlashcard): Promise<Flashcard> {
    const newCard: Flashcard = {
      id: `card-${Date.now()}`,
      userId,
      ...flashcard,
      mastered: false,
      nextReview: new Date(),
      reviewCount: 0,
    };
    this.flashcards.set(newCard.id, newCard);
    return newCard;
  }
  
  async updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard> {
    const card = this.flashcards.get(id);
    if (!card) throw new Error('Flashcard not found');
    const updated = { ...card, ...updates };
    this.flashcards.set(id, updated);
    return updated;
  }
  
  async getStudySessions(userId: string, limit?: number): Promise<StudySession[]> {
    let sessions = Array.from(this.studySessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    if (limit) {
      sessions = sessions.slice(0, limit);
    }
    return sessions;
  }
  
  async createStudySession(userId: string, session: InsertStudySession): Promise<StudySession> {
    const newSession: StudySession = {
      id: `session-${Date.now()}`,
      userId,
      ...session,
      date: new Date(),
    };
    this.studySessions.set(newSession.id, newSession);
    return newSession;
  }
  
  async getAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(ach => ach.userId === userId);
  }
  
  async unlockAchievement(userId: string, achievement: Omit<Achievement, 'id' | 'userId' | 'unlockedAt'>): Promise<Achievement> {
    const newAchievement: Achievement = {
      id: `ach-${Date.now()}`,
      userId,
      ...achievement,
      unlockedAt: new Date(),
    };
    this.achievements.set(newAchievement.id, newAchievement);
    return newAchievement;
  }
  
  async getMessages(userId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  async createMessage(userId: string, role: 'user' | 'assistant', content: string): Promise<Message> {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      userId,
      role,
      content,
      timestamp: new Date(),
    };
    this.messages.set(newMessage.id, newMessage);
    return newMessage;
  }
  
  async getProgress(userId: string): Promise<Progress[]> {
    return Array.from(this.progress.values()).filter(p => p.userId === userId);
  }
  
  async updateProgress(userId: string, subject: string, topic: string, mastery: number): Promise<Progress> {
    const key = `${userId}-${subject}`;
    const existing = this.progress.get(key);
    const updated: Progress = {
      userId,
      subject,
      topic,
      mastery,
      lastStudied: new Date(),
      totalTime: (existing?.totalTime || 0),
    };
    this.progress.set(key, updated);
    return updated;
  }
}

export const storage = new MemStorage();
