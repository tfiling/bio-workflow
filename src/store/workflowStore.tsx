import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Project, Workflow, Assay, Step, UserWorkflow } from '../types';

interface WorkflowState {
  projects: Project[];
  workflows: Workflow[];
  assays: Assay[];
  steps: Step[];
  userWorkflows: UserWorkflow[];
  loading: boolean;
  error: string | null;
  
  // Project actions
  fetchProjects: () => Promise<void>;
  getProjectById: (id: string) => Promise<Project | null>;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  
  // Workflow actions
  fetchWorkflows: () => Promise<void>;
  getWorkflowById: (id: string) => Promise<Workflow | null>;
  createWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateWorkflow: (id: string, data: Partial<Workflow>) => Promise<void>;
  
  // Assay actions
  fetchAssays: () => Promise<void>;
  getAssayById: (id: string) => Promise<Assay | null>;
  createAssay: (assay: Omit<Assay, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateAssay: (id: string, data: Partial<Assay>) => Promise<void>;
  
  // Step actions
  fetchSteps: (assayId: string) => Promise<void>;
  getStepById: (id: string) => Promise<Step | null>;
  createStep: (step: Omit<Step, 'id'>) => Promise<string>;
  updateStep: (id: string, data: Partial<Step>) => Promise<void>;
  
  // User workflow actions
  fetchUserWorkflows: () => Promise<void>;
  getUserWorkflowById: (id: string) => Promise<UserWorkflow | null>;
  startWorkflow: (workflowId: string, parameters: Record<string, any>) => Promise<string>;
  updateUserWorkflow: (id: string, data: Partial<UserWorkflow>) => Promise<void>;
  completeUserWorkflow: (id: string) => Promise<void>;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  projects: [],
  workflows: [],
  assays: [],
  steps: [],
  userWorkflows: [],
  loading: false,
  error: null,
  
  // Project actions
  fetchProjects: async () => {
    try {
      set({ loading: true, error: null });
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ projects: projects || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  getProjectById: async (id: string) => {
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return project;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },
  
  createProject: async (project) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();
      
      if (error) throw error;
      set((state) => ({
        projects: [data, ...state.projects],
        loading: false,
      }));
      return data.id;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  updateProject: async (id: string, data: Partial<Project>) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? { ...project, ...data } : project
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  // Workflow actions
  fetchWorkflows: async () => {
    try {
      set({ loading: true, error: null });
      const { data: workflows, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ workflows: workflows || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  getWorkflowById: async (id: string) => {
    try {
      const { data: workflow, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return workflow;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },
  
  createWorkflow: async (workflow) => {
    try {
      set({ loading: true, error: null });
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: workflowData, error: workflowError } = await supabase
        .from('workflows')
        .insert([{
          ...workflow,
          user_id: user.user.id
        }])
        .select()
        .single();
      
      if (workflowError) throw workflowError;

      // Insert workflow assays
      if (workflow.assays?.length) {
        const workflowAssays = workflow.assays.map(assayId => ({
          workflow_id: workflowData.id,
          assay_id: assayId
        }));

        const { error: assayError } = await supabase
          .from('workflow_assays')
          .insert(workflowAssays);

        if (assayError) throw assayError;
      }

      // Insert assay dependencies
      if (workflow.assayDependencies?.length) {
        const dependencies = workflow.assayDependencies.map(dep => ({
          workflow_id: workflowData.id,
          from_assay_id: dep.fromAssayId,
          to_assay_id: dep.toAssayId
        }));

        const { error: depError } = await supabase
          .from('assay_dependencies')
          .insert(dependencies);

        if (depError) throw depError;
      }

      set((state) => ({
        workflows: [workflowData, ...state.workflows],
        loading: false,
      }));
      
      return workflowData.id;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  updateWorkflow: async (id: string, data: Partial<Workflow>) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('workflows')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      set((state) => ({
        workflows: state.workflows.map((workflow) =>
          workflow.id === id ? { ...workflow, ...data } : workflow
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  // Assay actions
  fetchAssays: async () => {
    try {
      set({ loading: true, error: null });
      const { data: assays, error } = await supabase
        .from('assays')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ assays: assays || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  getAssayById: async (id: string) => {
    try {
      const { data: assay, error } = await supabase
        .from('assays')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return assay;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },
  
  createAssay: async (assay) => {
    try {
      set({ loading: true, error: null });
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('assays')
        .insert([{
          ...assay,
          user_id: user.user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      set((state) => ({
        assays: [data, ...state.assays],
        loading: false,
      }));
      return data.id;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  updateAssay: async (id: string, data: Partial<Assay>) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('assays')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      set((state) => ({
        assays: state.assays.map((assay) =>
          assay.id === id ? { ...assay, ...data } : assay
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  // Step actions
  fetchSteps,
  getStepById,
  createStep,
  updateStep,
  
  // User workflow actions
  fetchUserWorkflows,
  getUserWorkflowById,
  startWorkflow,
  updateUserWorkflow,
  completeUserWorkflow,
}));

// Helper functions for steps and user workflows
async function fetchSteps(assayId: string) {
  // Implementation for steps will be added later
}

async function getStepById(id: string) {
  // Implementation for steps will be added later
  return null;
}

async function createStep(step: Omit<Step, 'id'>) {
  // Implementation for steps will be added later
  return '';
}

async function updateStep(id: string, data: Partial<Step>) {
  // Implementation for steps will be added later
}

async function fetchUserWorkflows() {
  // Implementation for user workflows will be added later
}

async function getUserWorkflowById(id: string) {
  // Implementation for user workflows will be added later
  return null;
}

async function startWorkflow(workflowId: string, parameters: Record<string, any>) {
  // Implementation for user workflows will be added later
  return '';
}

async function updateUserWorkflow(id: string, data: Partial<UserWorkflow>) {
  // Implementation for user workflows will be added later
}

async function completeUserWorkflow(id: string) {
  // Implementation for user workflows will be added later
}