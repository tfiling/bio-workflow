import { create } from 'zustand';
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
  fetchWorkflows: (projectId: string) => Promise<void>;
  getWorkflowById: (id: string) => Promise<Workflow | null>;
  createWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateWorkflow: (id: string, data: Partial<Workflow>) => Promise<void>;
  
  // Assay actions
  fetchAssays: (workflowId: string) => Promise<void>;
  getAssayById: (id: string) => Promise<Assay | null>;
  createAssay: (assay: Omit<Assay, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateAssay: (id: string, data: Partial<Assay>) => Promise<void>;
  
  // Step actions
  fetchSteps: (assayId: string) => Promise<void>;
  getStepById: (id: string) => Promise<Step | null>;
  createStep: (step: Omit<Step, 'id'>) => Promise<string>;
  updateStep: (id: string, data: Partial<Step>) => Promise<void>;
  
  // User workflow actions
  fetchUserWorkflows: (projectId: string) => Promise<void>;
  getUserWorkflowById: (id: string) => Promise<UserWorkflow | null>;
  startWorkflow: (projectId: string, workflowId: string, parameters: Record<string, any>) => Promise<string>;
  updateUserWorkflow: (id: string, data: Partial<UserWorkflow>) => Promise<void>;
  completeUserWorkflow: (id: string) => Promise<void>;
}

// In-memory storage for demo purposes
let projectsData: Project[] = [];
let workflowsData: Workflow[] = [];
let assaysData: Assay[] = [];
let stepsData: Step[] = [];
let userWorkflowsData: UserWorkflow[] = [];

let nextId = 1;

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
      set({ projects: projectsData, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  getProjectById: async (id: string) => {
    try {
      const project = projectsData.find(p => p.id === id) || null;
      return project;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },
  
  createProject: async (project) => {
    try {
      set({ loading: true, error: null });
      const id = String(nextId++);
      const timestamp = new Date().toISOString();
      const newProject = {
        id,
        ...project,
        createdAt: timestamp,
        updatedAt: timestamp,
      } as Project;
      
      projectsData.push(newProject);
      set((state) => ({
        projects: [...state.projects, newProject],
        loading: false,
      }));
      return id;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  updateProject: async (id: string, data: Partial<Project>) => {
    try {
      set({ loading: true, error: null });
      const timestamp = new Date().toISOString();
      projectsData = projectsData.map(project =>
        project.id === id ? { ...project, ...data, updatedAt: timestamp } : project
      );
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? { ...project, ...data, updatedAt: timestamp } : project
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  // Workflow actions
  fetchWorkflows: async (projectId: string) => {
    try {
      set({ loading: true, error: null });
      const filteredWorkflows = workflowsData.filter(w => w.projectId === projectId);
      set({ workflows: filteredWorkflows, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  getWorkflowById: async (id: string) => {
    try {
      const workflow = workflowsData.find(w => w.id === id) || null;
      return workflow;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },
  
  createWorkflow: async (workflow) => {
    try {
      set({ loading: true, error: null });
      const id = String(nextId++);
      const timestamp = new Date().toISOString();
      const newWorkflow = {
        id,
        ...workflow,
        createdAt: timestamp,
        updatedAt: timestamp,
      } as Workflow;
      
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
      const timestamp = new Date().toISOString();
      workflowsData = workflowsData.map(workflow =>
        workflow.id === id ? { ...workflow, ...data, updatedAt: timestamp } : workflow
      );
      set((state) => ({
        workflows: state.workflows.map((workflow) =>
          workflow.id === id ? { ...workflow, ...data, updatedAt: timestamp } : workflow
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  // Assay actions
  fetchAssays: async (workflowId: string) => {
    try {
      set({ loading: true, error: null });
      const filteredAssays = assaysData.filter(a => a.workflowId === workflowId);
      set({ assays: filteredAssays, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  getAssayById: async (id: string) => {
    try {
      const assay = assaysData.find(a => a.id === id) || null;
      return assay;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },
  
  createAssay: async (assay) => {
    try {
      set({ loading: true, error: null });
      const id = String(nextId++);
      const timestamp = new Date().toISOString();
      const newAssay = {
        id,
        ...assay,
        createdAt: timestamp,
        updatedAt: timestamp,
      } as Assay;
      
      assaysData.push(newAssay);
      set((state) => ({
        assays: [...state.assays, newAssay],
        loading: false,
      }));
      return id;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  updateAssay: async (id: string, data: Partial<Assay>) => {
    try {
      set({ loading: true, error: null });
      const timestamp = new Date().toISOString();
      assaysData = assaysData.map(assay =>
        assay.id === id ? { ...assay, ...data, updatedAt: timestamp } : assay
      );
      set((state) => ({
        assays: state.assays.map((assay) =>
          assay.id === id ? { ...assay, ...data, updatedAt: timestamp } : assay
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  // Step actions
  fetchSteps: async (assayId: string) => {
    try {
      set({ loading: true, error: null });
      const filteredSteps = stepsData.filter(s => s.assayId === assayId);
      set({ steps: filteredSteps, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  getStepById: async (id: string) => {
    try {
      const step = stepsData.find(s => s.id === id) || null;
      return step;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },
  
  createStep: async (step) => {
    try {
      set({ loading: true, error: null });
      const id = String(nextId++);
      const newStep = { id, ...step } as Step;
      
      stepsData.push(newStep);
      set((state) => ({
        steps: [...state.steps, newStep],
        loading: false,
      }));
      return id;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  updateStep: async (id: string, data: Partial<Step>) => {
    try {
      set({ loading: true, error: null });
      stepsData = stepsData.map(step =>
        step.id === id ? { ...step, ...data } : step
      );
      set((state) => ({
        steps: state.steps.map((step) =>
          step.id === id ? { ...step, ...data } : step
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  // User workflow actions
  fetchUserWorkflows: async (projectId: string) => {
    try {
      set({ loading: true, error: null });
      const filteredWorkflows = userWorkflowsData.filter(w => w.projectId === projectId);
      set({ userWorkflows: filteredWorkflows, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  getUserWorkflowById: async (id: string) => {
    try {
      const userWorkflow = userWorkflowsData.find(w => w.id === id) || null;
      return userWorkflow;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },
  
  startWorkflow: async (projectId: string, workflowId: string, parameters: Record<string, any>) => {
    try {
      set({ loading: true, error: null });
      
      const workflow = await get().getWorkflowById(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }
      
      const assays = assaysData.filter(a => a.workflowId === workflowId);
      if (!assays.length) {
        throw new Error('No assays found for workflow');
      }
      
      const firstAssay = assays[0];
      const steps = stepsData.filter(s => s.assayId === firstAssay.id);
      if (!steps.length) {
        throw new Error('No steps found for first assay');
      }
      
      const id = String(nextId++);
      const userWorkflow: UserWorkflow = {
        id,
        projectId,
        workflowId,
        parameters,
        startedAt: new Date().toISOString(),
        currentAssayId: firstAssay.id,
        currentStepId: steps[0].id,
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