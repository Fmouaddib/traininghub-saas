// Types de base pour TrainingHub
export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  session_type: 'in_person' | 'online' | 'hybrid';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  max_participants: number;
  current_participants: number;
  trainer_id: string;
  room_id?: string;
  program_id?: string;
  class_id?: string;
  subject_id?: string;
  zoom_meeting_id?: string;
  zoom_meeting_url?: string;
  created_at: string;
  updated_at: string;

  // Relations
  trainer?: Profile;
  room?: Room;
  program?: Program;
  participants?: SessionParticipant[];
  class?: StudentClass;
  subject?: { id: string; name: string };
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'trainer' | 'coordinator' | 'staff' | 'super_admin' | 'student';
  phone?: string;
  avatar_url?: string;
  center_id?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  room_type: 'classroom' | 'meeting_room' | 'lab' | 'auditorium' | 'virtual';
  location?: string;
  equipment?: string[];
  center_id: string;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  title: string;
  description?: string;
  duration_hours: number;
  level: string;
  center_id: string;
  created_at: string;
  updated_at: string;
}

export interface SessionParticipant {
  id: string;
  session_id: string;
  user_id?: string;
  participant_name: string;
  participant_email: string;
  company?: string;
  phone?: string;
  attendance_status: 'registered' | 'attended' | 'absent' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'refunded';
  registration_date: string;

  // Relations
  user?: Profile;
  session?: TrainingSession;
}

// Types pour les formulaires
export interface CreateSessionData {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  session_type: 'in_person' | 'online' | 'hybrid';
  max_participants: number;
  trainer_id: string;
  room_id?: string;
  program_id?: string;
  class_id?: string;
  subject_id?: string;
}

export interface UpdateSessionData extends Partial<CreateSessionData> {
  id: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

// Types pour le calendrier
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'in_person' | 'online' | 'hybrid';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  participants: number;
  maxParticipants: number;
  trainer: string;
  room?: string;
}

// Types pour les formulaires Salles
export interface CreateRoomData {
  name: string;
  capacity: number;
  room_type: 'classroom' | 'meeting_room' | 'lab' | 'auditorium' | 'virtual';
  location?: string;
  equipment?: string[];
  center_id?: string;
}

export interface UpdateRoomData extends Partial<CreateRoomData> {
  id: string;
}

// Types pour les formulaires Participants
export interface CreateParticipantData {
  session_id: string;
  participant_name: string;
  participant_email: string;
  company?: string;
  phone?: string;
}

export interface UpdateParticipantData {
  id: string;
  attendance_status?: 'registered' | 'attended' | 'absent' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'refunded';
}

// Types pour les stats dashboard
export interface DashboardStats {
  totalSessions: number;
  totalParticipants: number;
  totalRooms: number;
  upcomingSessions: number;
}

// Types pour les filtres
export interface SessionFilters {
  startDate?: string;
  endDate?: string;
  sessionType?: 'in_person' | 'online' | 'hybrid';
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  trainerId?: string;
  roomId?: string;
  programId?: string;
}

// Types pour les classes/groupes
export interface StudentClass {
  id: string;
  center_id?: string;
  name: string;
  diploma_id?: string;
  academic_year?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Relations (joins)
  diploma?: { id: string; title: string };
  students?: ClassStudent[];
  subjects?: ClassSubject[];
  student_count?: number;
  subject_count?: number;
}

export interface ClassStudent {
  id: string;
  class_id: string;
  student_id: string;
  enrolled_at: string;
  student?: Profile;
}

export interface ClassSubject {
  id: string;
  class_id: string;
  subject_id: string;
  trainer_id?: string;
  hours_planned: number;
  subject?: { id: string; name: string; code?: string };
  trainer?: Profile;
}

export interface CreateClassData {
  name: string;
  diploma_id?: string;
  academic_year?: string;
  start_date?: string;
  end_date?: string;
}

export interface UpdateClassData extends Partial<CreateClassData> {
  id: string;
  is_active?: boolean;
}

// Types pour les notifications in-app
export interface AppNotification {
  id: string;
  user_id: string;
  center_id?: string;
  type: 'info' | 'session' | 'alert' | 'system';
  title: string;
  body?: string;
  link?: string;
  is_read: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
}