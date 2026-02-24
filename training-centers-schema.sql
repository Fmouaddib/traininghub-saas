-- TrainingHub - Schema pour Centres de Formation
-- Version adaptée pour simplicité + fonctionnalités spécialisées

-- Enable RLS (Row Level Security)
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'trainer', 'coordinator', 'staff');
CREATE TYPE session_type AS ENUM ('in_person', 'online', 'hybrid');
CREATE TYPE session_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE room_type AS ENUM ('classroom', 'meeting_room', 'lab', 'auditorium', 'virtual');

-- Users profile table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'trainer',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training Centers table
CREATE TABLE IF NOT EXISTS training_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms/Spaces table (physiques et virtuelles)
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id UUID REFERENCES training_centers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  room_type room_type NOT NULL DEFAULT 'classroom',
  capacity INTEGER NOT NULL DEFAULT 0,
  equipment JSONB DEFAULT '[]',
  zoom_room_id TEXT, -- ID salle Zoom permanente
  location TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training Programs/Courses table
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id UUID REFERENCES training_centers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  description TEXT,
  duration_hours INTEGER DEFAULT 0,
  max_participants INTEGER DEFAULT 20,
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training Sessions table (remplace "bookings")
CREATE TABLE IF NOT EXISTS training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  trainer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  session_type session_type DEFAULT 'in_person',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status session_status DEFAULT 'scheduled',
  max_participants INTEGER DEFAULT 20,
  current_participants INTEGER DEFAULT 0,
  
  -- Zoom/Online specifics
  zoom_meeting_id TEXT,
  zoom_join_url TEXT,
  zoom_password TEXT,
  
  -- Additional info
  materials_url TEXT,
  notes TEXT,
  price DECIMAL(10,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_time_range CHECK (start_time < end_time),
  CONSTRAINT valid_participants CHECK (current_participants >= 0),
  CONSTRAINT valid_max_participants CHECK (max_participants > 0)
);

-- Session Participants table
CREATE TABLE IF NOT EXISTS session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES training_sessions(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  attendance_status TEXT DEFAULT 'registered', -- registered, present, absent
  payment_status TEXT DEFAULT 'pending', -- pending, paid, cancelled
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(session_id, participant_email)
);

-- Email Templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id UUID REFERENCES training_centers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  template_type TEXT NOT NULL, -- reminder, confirmation, cancellation, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Log table (pour tracking)
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES training_sessions(id) ON DELETE SET NULL,
  participant_email TEXT NOT NULL,
  email_type TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent', -- sent, failed, bounced
  error_message TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_rooms_center ON rooms(center_id);
CREATE INDEX IF NOT EXISTS idx_rooms_type ON rooms(room_type);
CREATE INDEX IF NOT EXISTS idx_programs_center ON programs(center_id);
CREATE INDEX IF NOT EXISTS idx_sessions_program ON training_sessions(program_id);
CREATE INDEX IF NOT EXISTS idx_sessions_trainer ON training_sessions(trainer_id);
CREATE INDEX IF NOT EXISTS idx_sessions_time ON training_sessions(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON training_sessions(status);
CREATE INDEX IF NOT EXISTS idx_participants_session ON session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_participants_email ON session_participants(participant_email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_centers_updated_at BEFORE UPDATE ON training_centers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_sessions_updated_at BEFORE UPDATE ON training_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Policies for training sessions
CREATE POLICY "Users can view all sessions" ON training_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Trainers can manage their sessions" ON training_sessions FOR ALL USING (auth.uid() = trainer_id);
CREATE POLICY "Admins can manage all sessions" ON training_sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'coordinator'))
);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'trainer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data pour demo
INSERT INTO training_centers (name, address, email) VALUES
('FormaPro Paris', '123 Avenue des Champs-Elysees, Paris', 'contact@formapro-paris.fr'),
('TechSkills Lyon', '456 Rue de la Republique, Lyon', 'info@techskills-lyon.fr');

INSERT INTO rooms (center_id, name, room_type, capacity, equipment) VALUES
((SELECT id FROM training_centers WHERE name = 'FormaPro Paris'), 'Salle Alpha', 'classroom', 20, '["projecteur", "tableau", "wifi"]'),
((SELECT id FROM training_centers WHERE name = 'FormaPro Paris'), 'Salle Beta', 'classroom', 15, '["ecran", "visio"]'),
((SELECT id FROM training_centers WHERE name = 'FormaPro Paris'), 'Lab Informatique', 'lab', 12, '["ordinateurs", "logiciels", "imprimante"]'),
((SELECT id FROM training_centers WHERE name = 'FormaPro Paris'), 'Zoom Room 1', 'virtual', 100, '["zoom_pro", "enregistrement", "partage_ecran"]');

INSERT INTO programs (center_id, name, code, duration_hours, max_participants, color) VALUES
((SELECT id FROM training_centers WHERE name = 'FormaPro Paris'), 'Excel Avance', 'EXCEL-ADV', 14, 12, '#10B981'),
((SELECT id FROM training_centers WHERE name = 'FormaPro Paris'), 'Leadership Management', 'LEAD-MGT', 21, 15, '#F59E0B'),
((SELECT id FROM training_centers WHERE name = 'FormaPro Paris'), 'Marketing Digital', 'MARK-DIG', 28, 20, '#EF4444'),
((SELECT id FROM training_centers WHERE name = 'FormaPro Paris'), 'Gestion de Projet', 'PROJ-MGT', 35, 18, '#8B5CF6');

-- Success message
SELECT 'Base de donnees TrainingHub creee avec succes! 🎉' AS message;