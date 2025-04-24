import { pgTable, text, serial, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
export const insertSubjectSchema = createInsertSchema(subjects).pick({
  name: true,
  color: true,
});

export const insertStudySessionSchema = createInsertSchema(studySessions).pick({
  subjectId: true,
  startTime: true,
  endTime: true,
  duration: true,
  day: true,
});

export const insertStreakSchema = createInsertSchema(streaks).pick({
  currentStreak: true,
  lastStudyDate: true,
});

// Define types
export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;

export type Streak = typeof streaks.$inferSelect;
export type InsertStreak = z.infer<typeof insertStreakSchema>;
