import { pgTable, text, serial, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profile table - stores user information
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  totalStudyHours: integer("total_study_hours").notNull().default(0),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
});

// Subjects table - stores available study subjects
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
});

// Study sessions table - stores individual study sessions
export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  duration: integer("duration").notNull(), // Duration in seconds
  day: date("day").notNull(),
});

// Streaks table - stores user's daily study streaks
export const streaks = pgTable("streaks", {
  id: serial("id").primaryKey(),
  currentStreak: integer("current_streak").notNull().default(0),
  lastStudyDate: date("last_study_date"),
});

// Define insert schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  name: true,
  joinedAt: true,
  totalStudyHours: true,
  level: true,
  xp: true,
});

export const updateUserProfileSchema = createInsertSchema(userProfiles).pick({
  name: true,
  totalStudyHours: true,
  level: true,
  xp: true,
}).partial();

export const insertSubjectSchema = createInsertSchema(subjects).pick({
  name: true,
  color: true,
});

// Criamos um schema personalizado para a inserção de sessões de estudo
// que possa lidar com strings ou dates para os campos de data/horário
export const insertStudySessionSchema = z.object({
  subjectId: z.number().int().positive(),
  startTime: z.union([z.date(), z.string().datetime()]),
  endTime: z.union([z.date(), z.string().datetime()]),
  duration: z.number().int().nonnegative(),
  day: z.union([z.date(), z.string().datetime()])
});

export const insertStreakSchema = createInsertSchema(streaks).pick({
  currentStreak: true,
  lastStudyDate: true,
});

// Define types
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;

export type Streak = typeof streaks.$inferSelect;
export type InsertStreak = z.infer<typeof insertStreakSchema>;

// Function to calculate level based on XP
export function calculateLevel(xp: number): number {
  // Simple level calculation: every 100 XP is a new level
  return Math.max(1, Math.floor(xp / 100) + 1);
}

// Function to calculate XP from study time (in seconds)
export function calculateXPFromStudyTime(seconds: number): number {
  // 1 XP per minute of study (60 seconds)
  return Math.floor(seconds / 60);
}

// Get user level title based on level
export function getLevelTitle(level: number): string {
  if (level === 1) return "Iniciante";
  if (level === 2) return "Estudante Regular";
  if (level === 3) return "Estudante Dedicado";
  if (level === 4) return "Estudante Avançado";
  if (level === 5) return "Mestre dos Estudos";
  if (level >= 6) return "Guru do Conhecimento";
  return "Iniciante";
}
