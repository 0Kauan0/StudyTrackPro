import { 
  subjects, 
  studySessions, 
  streaks,
  userProfiles, 
  calculateLevel,
  calculateXPFromStudyTime,
  type Subject, 
  type InsertSubject, 
  type StudySession, 
  type InsertStudySession, 
  type Streak, 
  type InsertStreak,
  type UserProfile,
  type InsertUserProfile,
  type UpdateUserProfile
} from "@shared/schema";

// Define the storage interface
export interface IStorage {
  // User profile methods
  getUserProfile(): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(profile: UpdateUserProfile): Promise<UserProfile>;
  
  // Subject methods
  getSubjects(): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  
  // Study session methods
  getStudySessions(): Promise<StudySession[]>;
  getStudySessionsByDay(day: Date): Promise<StudySession[]>;
  getStudySessionsByDateRange(startDate: Date, endDate: Date): Promise<StudySession[]>;
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  
  // Streak methods
  getStreak(): Promise<Streak | undefined>;
  updateStreak(streak: InsertStreak): Promise<Streak>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private subjects: Map<number, Subject>;
  private studySessions: Map<number, StudySession>;
  private streak: Streak | undefined;
  private userProfile: UserProfile | undefined;
  
  private subjectId: number;
  private sessionId: number;
  private streakId: number;
  private userProfileId: number;
  
  constructor() {
    this.subjects = new Map();
    this.studySessions = new Map();
    this.streak = undefined;
    this.userProfile = undefined;
    
    this.subjectId = 1;
    this.sessionId = 1;
    this.streakId = 1;
    this.userProfileId = 1;
    
    // Add default subjects
    this.initializeSubjects();
    
    // Create default user profile
    this.initializeUserProfile();
  }
  
  private initializeUserProfile() {
    const defaultProfile: InsertUserProfile = {
      name: "Novo Usuário",
      joinedAt: new Date(),
      totalStudyHours: 0,
      level: 1,
      xp: 0
    };
    
    this.createUserProfile(defaultProfile);
  }
  
  private initializeSubjects() {
    const defaultSubjects: InsertSubject[] = [
      { name: "Matemática", color: "#6366f1" },
      { name: "Física", color: "#8b5cf6" },
      { name: "Química", color: "#ec4899" },
      { name: "Biologia", color: "#10b981" },
      { name: "História", color: "#f59e0b" },
      { name: "Geografia", color: "#0ea5e9" },
      { name: "Literatura", color: "#8b5cf6" },
      { name: "Redação", color: "#ef4444" }
    ];
    
    defaultSubjects.forEach(subject => {
      this.createSubject(subject);
    });
  }

  // Subject methods
  async getSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }
  
  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }
  
  async createSubject(subject: InsertSubject): Promise<Subject> {
    const id = this.subjectId++;
    const newSubject: Subject = { id, ...subject };
    this.subjects.set(id, newSubject);
    return newSubject;
  }
  
  // Study session methods
  async getStudySessions(): Promise<StudySession[]> {
    return Array.from(this.studySessions.values());
  }
  
  async getStudySessionsByDay(day: Date): Promise<StudySession[]> {
    const targetDate = new Date(day);
    targetDate.setHours(0, 0, 0, 0);
    
    return Array.from(this.studySessions.values()).filter(session => {
      const sessionDate = new Date(session.day);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === targetDate.getTime();
    });
  }
  
  async getStudySessionsByDateRange(startDate: Date, endDate: Date): Promise<StudySession[]> {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return Array.from(this.studySessions.values()).filter(session => {
      const sessionDate = new Date(session.day);
      return sessionDate >= start && sessionDate <= end;
    });
  }
  
  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const id = this.sessionId++;
    const newSession: StudySession = { id, ...session };
    this.studySessions.set(id, newSession);
    
    // Update streak when creating a new session
    await this.updateStreakFromSession(newSession);
    
    // Update user XP and level based on the session
    await this.updateUserXPFromSession(newSession);
    
    return newSession;
  }
  
  // Helper method to update streak based on new session
  private async updateStreakFromSession(session: StudySession): Promise<void> {
    const currentStreak = await this.getStreak();
    const sessionDay = new Date(session.day);
    sessionDay.setHours(0, 0, 0, 0);
    
    if (!currentStreak) {
      // Initialize streak if it doesn't exist
      await this.updateStreak({
        currentStreak: 1,
        lastStudyDate: sessionDay.toISOString()
      });
      return;
    }
    
    const lastStudyDate = currentStreak.lastStudyDate ? new Date(currentStreak.lastStudyDate) : null;
    if (lastStudyDate) {
      lastStudyDate.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastStudyDate.getTime() === yesterday.getTime() || 
          (lastStudyDate.getTime() === today.getTime() && sessionDay.getTime() === today.getTime())) {
        // If last study was yesterday or already today, increment streak
        await this.updateStreak({
          currentStreak: currentStreak.currentStreak + 1,
          lastStudyDate: sessionDay.toISOString()
        });
      } else if (lastStudyDate.getTime() < yesterday.getTime()) {
        // If there was a gap, reset streak
        await this.updateStreak({
          currentStreak: 1,
          lastStudyDate: sessionDay.toISOString()
        });
      }
    }
  }
  
  // User profile methods
  async getUserProfile(): Promise<UserProfile | undefined> {
    return this.userProfile;
  }
  
  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const id = this.userProfileId++;
    const newProfile: UserProfile = { id, ...profile };
    this.userProfile = newProfile;
    return newProfile;
  }
  
  async updateUserProfile(profile: UpdateUserProfile): Promise<UserProfile> {
    if (!this.userProfile) {
      throw new Error("User profile does not exist");
    }
    
    this.userProfile = { ...this.userProfile, ...profile };
    return this.userProfile;
  }
  
  // Update user XP and level based on study session
  private async updateUserXPFromSession(session: StudySession): Promise<void> {
    if (!this.userProfile) return;
    
    // Calculate XP from session duration
    const sessionXP = calculateXPFromStudyTime(session.duration);
    const newXP = this.userProfile.xp + sessionXP;
    const newLevel = calculateLevel(newXP);
    
    // Convert duration from seconds to hours
    const durationInHours = session.duration / 3600;
    const newTotalStudyHours = this.userProfile.totalStudyHours + durationInHours;
    
    // Update user profile
    await this.updateUserProfile({
      xp: newXP,
      level: newLevel,
      totalStudyHours: newTotalStudyHours
    });
  }
  
  // Streak methods
  async getStreak(): Promise<Streak | undefined> {
    return this.streak;
  }
  
  async updateStreak(streak: InsertStreak): Promise<Streak> {
    if (this.streak) {
      this.streak = { ...this.streak, ...streak };
    } else {
      this.streak = { id: this.streakId++, ...streak };
    }
    return this.streak;
  }
}

// Create and export the storage instance
export const storage = new MemStorage();
