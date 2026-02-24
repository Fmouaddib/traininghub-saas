import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-project-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour notre application
export interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'teacher' | 'student' | 'staff'
  created_at: string
}

export interface Room {
  id: string
  name: string
  capacity: number
  equipment: string[]
  building: string
  floor: number
  created_at: string
}

export interface Booking {
  id: string
  room_id: string
  user_id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  status: 'confirmed' | 'pending' | 'cancelled'
  created_at: string
  room?: Room
  user?: User
}