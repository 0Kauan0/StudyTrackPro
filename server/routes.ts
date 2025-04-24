import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSubjectSchema, 
  insertStudySessionSchema, 
  updateUserProfileSchema,
  getLevelTitle
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Get all subjects
  app.get("/api/subjects", async (req, res) => {
    try {
      const subjects = await storage.getSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar matérias" });
    }
  });

  // Create a new subject
  app.post("/api/subjects", async (req, res) => {
    try {
      const validatedData = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(validatedData);
      res.status(201).json(subject);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erro ao criar matéria" });
      }
    }
  });

  // Get study sessions
  app.get("/api/study-sessions", async (req, res) => {
    try {
      if (req.query.day) {
        const day = new Date(req.query.day as string);
        const sessions = await storage.getStudySessionsByDay(day);
        res.json(sessions);
      } else if (req.query.startDate && req.query.endDate) {
        const startDate = new Date(req.query.startDate as string);
        const endDate = new Date(req.query.endDate as string);
        const sessions = await storage.getStudySessionsByDateRange(startDate, endDate);
        res.json(sessions);
      } else {
        const sessions = await storage.getStudySessions();
        res.json(sessions);
      }
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar sessões de estudo" });
    }
  });

  // Create a new study session
  app.post("/api/study-sessions", async (req, res) => {
    try {
      const validatedData = insertStudySessionSchema.parse(req.body);
      const session = await storage.createStudySession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erro ao criar sessão de estudo" });
      }
    }
  });

  // Get current streak
  app.get("/api/streak", async (req, res) => {
    try {
      const streak = await storage.getStreak() || { id: 0, currentStreak: 0, lastStudyDate: null };
      res.json(streak);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar streak" });
    }
  });

  // Get user profile
  app.get("/api/user-profile", async (req, res) => {
    try {
      const profile = await storage.getUserProfile();
      
      if (!profile) {
        return res.status(404).json({ message: "Perfil de usuário não encontrado" });
      }
      
      // Add level title to the profile
      const profileWithTitle = {
        ...profile,
        levelTitle: getLevelTitle(profile.level)
      };
      
      res.json(profileWithTitle);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar perfil de usuário" });
    }
  });
  
  // Update user profile
  app.patch("/api/user-profile", async (req, res) => {
    try {
      const validatedData = updateUserProfileSchema.parse(req.body);
      const profile = await storage.updateUserProfile(validatedData);
      
      // Add level title to the response
      const profileWithTitle = {
        ...profile,
        levelTitle: getLevelTitle(profile.level)
      };
      
      res.json(profileWithTitle);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erro ao atualizar perfil de usuário" });
      }
    }
  });

  return httpServer;
}
