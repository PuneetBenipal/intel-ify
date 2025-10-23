import type { Express } from "express";
import { storage } from "./storage.js";
import {
  insertUserSchema,
  insertStudyPlanSchema,
  insertQuizSchema,
  insertFlashcardSchema,
  insertStudySessionSchema,
  sendMessageSchema,
  generateContentSchema,
} from "../shared/schema.js";
import {
  generateQuiz,
  generateFlashcards,
  generateSummary,
  generateStudyPlan,
  chatWithTutor,
  extractTextFromImage,
} from "./openai.js";

export function registerRoutes(app: Express) {
  // User routes
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser("user-1"); // Demo user
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/user", async (req, res) => {
    try {
      const user = await storage.updateUser("user-1", req.body);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Study plan routes
  app.get("/api/study-plans", async (req, res) => {
    try {
      const plans = await storage.getStudyPlans("user-1");
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/study-plans", async (req, res) => {
    try {
      const validated = insertStudyPlanSchema.parse(req.body);
      const plan = await storage.createStudyPlan("user-1", validated);
      res.json(plan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/study-plans/generate", async (req, res) => {
    try {
      const { subject, topics, daysAvailable, hoursPerDay } = req.body;
      const aiPlan = await generateStudyPlan(subject, topics, daysAvailable, hoursPerDay);
      
      const plan = await storage.createStudyPlan("user-1", {
        title: aiPlan.plan.title,
        description: aiPlan.plan.description,
        subject,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + daysAvailable * 24 * 60 * 60 * 1000).toISOString(),
      });
      
      res.json({ ...plan, aiGenerated: aiPlan.plan });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Quiz routes
  app.get("/api/quizzes", async (req, res) => {
    try {
      const quizzes = await storage.getQuizzes("user-1");
      res.json(quizzes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const quiz = await storage.getQuiz(req.params.id);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/quizzes/generate", async (req, res) => {
    try {
      const validated = insertQuizSchema.parse(req.body);
      const aiQuiz = await generateQuiz(
        validated.subject,
        validated.title,
        validated.content || "",
        validated.numberOfQuestions
      );

      const quiz = await storage.createQuiz("user-1", {
        title: validated.title,
        subject: validated.subject,
        questions: aiQuiz.questions.map((q: any, i: number) => ({
          id: `q-${i}`,
          ...q,
        })),
        completed: false,
      });

      res.json(quiz);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/quizzes/:id", async (req, res) => {
    try {
      const quiz = await storage.updateQuiz(req.params.id, req.body);
      
      // Update user stats if quiz completed
      if (req.body.completed && req.body.score) {
        // Could trigger achievement unlocking here
      }
      
      res.json(quiz);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Flashcard routes
  app.get("/api/flashcards", async (req, res) => {
    try {
      const subject = req.query.subject as string | undefined;
      const flashcards = await storage.getFlashcards("user-1", subject);
      res.json(flashcards);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/flashcards/generate", async (req, res) => {
    try {
      const { subject, topic, content } = req.body;
      const aiCards = await generateFlashcards(subject, topic, content);

      const flashcards = await Promise.all(
        aiCards.flashcards.map((card: any) =>
          storage.createFlashcard("user-1", {
            subject,
            front: card.front,
            back: card.back,
          })
        )
      );

      res.json(flashcards);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/flashcards/:id", async (req, res) => {
    try {
      const flashcard = await storage.updateFlashcard(req.params.id, req.body);
      res.json(flashcard);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Study session routes
  app.get("/api/study-sessions", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const sessions = await storage.getStudySessions("user-1", limit);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/study-sessions", async (req, res) => {
    try {
      const validated = insertStudySessionSchema.parse(req.body);
      const session = await storage.createStudySession("user-1", validated);
      
      // Update user total study hours
      const user = await storage.getUser("user-1");
      if (user) {
        await storage.updateUser("user-1", {
          totalStudyHours: user.totalStudyHours + validated.duration / 60,
        });
      }
      
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements("user-1");
      res.json(achievements);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Progress routes
  app.get("/api/progress", async (req, res) => {
    try {
      const progress = await storage.getProgress("user-1");
      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI Tutor chat routes
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages("user-1");
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const validated = sendMessageSchema.parse(req.body);
      
      // Save user message
      await storage.createMessage("user-1", "user", validated.content);
      
      // Get conversation history
      const messages = await storage.getMessages("user-1");
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));
      
      // Get AI response
      const response = await chatWithTutor(conversationHistory);
      
      // Save assistant message
      const assistantMessage = await storage.createMessage("user-1", "assistant", response);
      
      res.json(assistantMessage);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Content generation routes
  app.post("/api/generate/summary", async (req, res) => {
    try {
      const { content } = req.body;
      const summary = await generateSummary(content);
      res.json({ summary });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/generate/extract-image", async (req, res) => {
    try {
      const { image } = req.body; // base64 image
      const text = await extractTextFromImage(image);
      res.json({ text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
