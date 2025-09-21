/**
 * Supabase Client Configuration for Flint Spark
 *
 * This module sets up the Supabase client for frontend database operations.
 * It provides direct access to the PostgreSQL database for real-time features
 * and can complement the existing Flask API or potentially replace it.
 */

import { createClient } from '@supabase/supabase-js'

// Environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  )
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for database tables
export interface Database {
  public: {
    Tables: {
      issues: {
        Row: {
          id: string
          name: string
          icon: string
          description: string
          count: number
          related_offices: string[]
          related_measures: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          icon: string
          description: string
          count?: number
          related_offices?: string[]
          related_measures?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          description?: string
          count?: number
          related_offices?: string[]
          related_measures?: string[]
          updated_at?: string
        }
      }
      offices: {
        Row: {
          id: string
          name: string
          description: string
          explanation: string
          level: 'local' | 'state' | 'federal'
          related_issues: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          description: string
          explanation: string
          level: 'local' | 'state' | 'federal'
          related_issues?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          explanation?: string
          level?: 'local' | 'state' | 'federal'
          related_issues?: string[]
          updated_at?: string
        }
      }
      ballot_measures: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          impact: string
          related_issues: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title: string
          description: string
          category: string
          impact: string
          related_issues?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          impact?: string
          related_issues?: string[]
          updated_at?: string
        }
      }
      candidates: {
        Row: {
          id: string
          name: string
          party: string
          photo: string
          positions: string[]
          office_id: string
          related_issues: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          party: string
          photo: string
          positions: string[]
          office_id: string
          related_issues?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          party?: string
          photo?: string
          positions?: string[]
          office_id?: string
          related_issues?: string[]
          updated_at?: string
        }
      }
      user_completions: {
        Row: {
          id: number
          user_profile: any
          starred_candidates: string[]
          starred_measures: string[]
          readiness_response: 'yes' | 'no' | 'still-thinking'
          session_id: string
          completed_at: string
          created_at: string
        }
        Insert: {
          user_profile: any
          starred_candidates: string[]
          starred_measures: string[]
          readiness_response: 'yes' | 'no' | 'still-thinking'
          session_id: string
          completed_at: string
          created_at?: string
        }
        Update: {
          user_profile?: any
          starred_candidates?: string[]
          starred_measures?: string[]
          readiness_response?: 'yes' | 'no' | 'still-thinking'
          session_id?: string
          completed_at?: string
        }
      }
      email_signups: {
        Row: {
          id: number
          email: string
          source: 'thankyou' | 'cast'
          wants_updates: boolean
          user_profile: any
          ballot_data: any
          session_id: string
          timestamp: string
          created_at: string
        }
        Insert: {
          email: string
          source: 'thankyou' | 'cast'
          wants_updates?: boolean
          user_profile?: any
          ballot_data?: any
          session_id?: string
          timestamp: string
          created_at?: string
        }
        Update: {
          email?: string
          source?: 'thankyou' | 'cast'
          wants_updates?: boolean
          user_profile?: any
          ballot_data?: any
          session_id?: string
          timestamp?: string
        }
      }
    }
  }
}

// Create typed client
export const typedSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey)