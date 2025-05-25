import { create } from 'zustand';
import { Workflow, UserWorkflow } from '../types';

interface WorkflowState {
  workflows: Workflow[];
  userWorkflows: UserWorkflow[];
  loading: boolean;
  error: string | null;
  
  // Workflow actions
  fetchWorkflows: () => Promise<void>;
  getWorkflowById: (id: string) => Promise<Workflow | null>;
  createWorkflow: (workflow: Omit<Workflow, 'id'>) => Promise<string>;
  updateWorkflow: (id: string, data: Partial<Workflow>) => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;
  
  // User workflow actions
  fetchUserWorkflows: () => Promise<void>;
  getUserWorkflowById: (id: string) => Promise<UserWorkflow | null>;
  startWorkflow: (workflowId: string, parameters: Record<string, any>) => Promise<string>;
  updateUserWorkflow: (id: string, data: Partial<UserWorkflow>) => Promise<void>;
  completeUserWorkflow: (id: string) => Promise<void>;
}

// In-memory storage for demo purposes
let workflowsData: Workflow[] = [];
let userWorkflowsData: UserWorkflow[] = [];
let nextWorkflowId = 1;
let nextUserWorkflowId = 1;

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  userWorkflows: [],
  loading: false,
  error: null,
  
  fetchWorkflows: async () => {
    try {
      set({ loading: true, error: null });
      set({ workflows: workflowsData, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  getWorkflowById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const workflow = workflowsData.find(w => w.id === id) || null;
      set({ loading: false });
      return workflow;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return null;
    }
  },
  
  createWorkflow: async (workflow: Omit<Workflow, 'id'>) => {
    try {
      set({ loading: true, error: null });
      const id = String(nextWorkflowId++);
      const newWorkflow = { id, ...workflow } as Workflow;
      workflowsData.push(newWorkflow);
      set((state) => ({
        workflows: [...state.workflows, newWorkflow],
        loading: false,
      }));
      return id;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  updateWorkflow: async (id: string, data: Partial<Workflow>) => {
    try {
      set({ loading: true, error: null });
      workflowsData = workflowsData.map(workflow =>
        workflow.id === id ? { ...workflow, ...data } : workflow
      );
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
  
  deleteWorkflow: async (id: string) => {
    try {
      set({ loading: true, error: null });
      workflowsData = workflowsData.filter(workflow => workflow.id !== id);
      set((state) => ({
        workflows: state.workflows.filter((workflow) => workflow.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  fetchUserWorkflows: async () => {
    try {
      set({ loading: true, error: null });
      set({ userWorkflows: userWorkflowsData, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  getUserWorkflowById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const userWorkflow = userWorkflowsData.find(w => w.id === id) || null;
      set({ loading: false });
      return userWorkflow;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return null;
    }
  },
  
  startWorkflow: async (workflowId: string, parameters: Record<string, any>) => {
    try {
      set({ loading: true, error: null });
      
      const workflow = await get().getWorkflowById(workflowId);
      
      if (!workflow || !workflow.steps.length) {
        throw new Error('Workflow not found or has no steps');
      }
      
      const id = String(nextUserWorkflowId++);
      const userWorkflow: UserWorkflow = {
        id,
        workflowId,
        parameters,
        startedAt: new Date().toISOString(),
        currentStepId: workflow.steps[0].id,
        status: 'in-progress',
      };
      
      userWorkflowsData.push(userWorkflow);
      set((state) => ({
        userWorkflows: [...state.userWorkflows, userWorkflow],
        loading: false,
      }));
      
      return id;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  updateUserWorkflow: async (id: string, data: Partial<UserWorkflow>) => {
    try {
      set({ loading: true, error: null });
      userWorkflowsData = userWorkflowsData.map(userWorkflow =>
        userWorkflow.id === id ? { ...userWorkflow, ...data } : userWorkflow
      );
      set((state) => ({
        userWorkflows: state.userWorkflows.map((userWorkflow) =>
          userWorkflow.id === id ? { ...userWorkflow, ...data } : userWorkflow
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  completeUserWorkflow: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      const completionData = {
        status: 'completed' as const,
        completedAt: new Date().toISOString(),
      };
      
      userWorkflowsData = userWorkflowsData.map(userWorkflow =>
        userWorkflow.id === id ? { ...userWorkflow, ...completionData } : userWorkflow
      );
      
      set((state) => ({
        userWorkflows: state.userWorkflows.map((userWorkflow) =>
          userWorkflow.id === id
            ? { ...userWorkflow, ...completionData }
            : userWorkflow
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));