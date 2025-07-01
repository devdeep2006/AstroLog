import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          location: string | null
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          location?: string | null
          timezone?: string | null
        }
        Update: {
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          location?: string | null
          timezone?: string | null
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          item_type: string
          item_id: string
          item_data: any
          created_at: string
        }
        Insert: {
          user_id: string
          item_type: string
          item_id: string
          item_data?: any
        }
        Update: {
          item_data?: any
        }
      }
      user_notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          enabled: boolean
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          type: string
          enabled?: boolean
          settings?: any
        }
        Update: {
          enabled?: boolean
          settings?: any
        }
      }
      user_locations: {
        Row: {
          id: string
          user_id: string
          name: string
          latitude: number
          longitude: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          name: string
          latitude: number
          longitude: number
          is_primary?: boolean
        }
        Update: {
          name?: string
          latitude?: number
          longitude?: number
          is_primary?: boolean
        }
      }
    }
  }
}
