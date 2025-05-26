export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      workflows: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string | null
          difficulty: string
          estimated_total_time: string | null
          created_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category?: string | null
          difficulty: string
          estimated_total_time?: string | null
          created_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string | null
          difficulty?: string
          estimated_total_time?: string | null
          created_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
      }
      assays: {
        Row: {
          id: string
          title: string
          description: string
          protocol: string
          materials: Json
          parameters: Json
          estimated_time: string | null
          created_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          protocol: string
          materials?: Json
          parameters?: Json
          estimated_time?: string | null
          created_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          protocol?: string
          materials?: Json
          parameters?: Json
          estimated_time?: string | null
          created_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
      }
      workflow_assays: {
        Row: {
          id: string
          workflow_id: string
          assay_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          workflow_id: string
          assay_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          workflow_id?: string
          assay_id?: string
          created_at?: string | null
        }
      }
      assay_dependencies: {
        Row: {
          id: string
          workflow_id: string
          from_assay_id: string
          to_assay_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          workflow_id: string
          from_assay_id: string
          to_assay_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          workflow_id?: string
          from_assay_id?: string
          to_assay_id?: string
          created_at?: string | null
        }
      }
      steps: {
        Row: {
          id: string
          assay_id: string
          title: string
          description: string
          estimated_time: string
          warning: string | null
          notes: string | null
          order_index: number
          calculation_dependencies: string[] | null
          calculation_formula: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          assay_id: string
          title: string
          description: string
          estimated_time: string
          warning?: string | null
          notes?: string | null
          order_index: number
          calculation_dependencies?: string[] | null
          calculation_formula?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          assay_id?: string
          title?: string
          description?: string
          estimated_time?: string
          warning?: string | null
          notes?: string | null
          order_index?: number
          calculation_dependencies?: string[] | null
          calculation_formula?: string | null
          created_at?: string | null
        }
      }
      user_workflows: {
        Row: {
          id: string
          workflow_id: string
          user_id: string
          started_at: string | null
          completed_at: string | null
          current_assay_id: string | null
          current_step_id: string | null
          parameters: Json
          status: string
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          workflow_id: string
          user_id: string
          started_at?: string | null
          completed_at?: string | null
          current_assay_id?: string | null
          current_step_id?: string | null
          parameters?: Json
          status: string
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          workflow_id?: string
          user_id?: string
          started_at?: string | null
          completed_at?: string | null
          current_assay_id?: string | null
          current_step_id?: string | null
          parameters?: Json
          status?: string
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}