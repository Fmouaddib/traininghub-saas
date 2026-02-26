-- Notifications table for in-app notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  center_id UUID REFERENCES training_centers(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- RLS: Users can only see their own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger: Notify center admin when a training session is created
CREATE OR REPLACE FUNCTION notify_session_created()
RETURNS TRIGGER AS $$
DECLARE
  center_admin RECORD;
  session_center_id UUID;
BEGIN
  -- Get the center_id from the trainer's profile
  SELECT center_id INTO session_center_id
  FROM profiles WHERE id = NEW.trainer_id;

  IF session_center_id IS NOT NULL THEN
    -- Notify all admins of the center
    FOR center_admin IN
      SELECT id FROM profiles
      WHERE center_id = session_center_id AND role = 'admin'
    LOOP
      INSERT INTO notifications (user_id, center_id, type, title, body, link, metadata)
      VALUES (
        center_admin.id,
        session_center_id,
        'session',
        'Nouvelle session creee',
        'La session "' || NEW.title || '" a ete creee.',
        '/sessions',
        jsonb_build_object('session_id', NEW.id, 'title', NEW.title)
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_session_created ON training_sessions;
CREATE TRIGGER trg_notify_session_created
  AFTER INSERT ON training_sessions
  FOR EACH ROW
  EXECUTE FUNCTION notify_session_created();
