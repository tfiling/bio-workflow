import { create } from 'zustand';
import { collection, getDocs, query, where, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
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
  fetchUserWorkflows: (userId: string) => Promise<void>;
  getUserWorkflowById: (id: string) => Promise<UserWorkflow | null>;
  startWorkflow: (workflowId: string, userId: string, parameters: Record<string, any>) => Promise<string>;
  updateUserWorkflow: (id: string, data: Partial<UserWorkflow>) => Promise<void>;
  completeUserWorkflow: (id: string) => Promise<void>;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  userWorkflows: [],
  loading: false,
  error: null,
  
  // Workflow actions
  fetchWorkflows: async () => {
    try {
      set({ loading: true, error: null });
      
      const workflowsCollection = collection(db, 'workflows');
      const workflowsQuery = query(workflowsCollection, where('publishStatus', '==', 'published'));
      const querySnapshot = await getDocs(workflowsQuery);
      
      const workflows: Workflow[] = [];
      querySnapshot.forEach((doc) => {
        workflows.push({
          id: doc.id,
          ...doc.data(),
        } as Workflow);
      });
      
      set({ workflows, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  getWorkflowById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      const workflowDoc = await getDoc(doc(db, 'workflows', id));
      
      if (workflowDoc.exists()) {
        const workflow = {
          id: workflowDoc.id,
          ...workflowDoc.data(),
        } as Workflow;
        
        set({ loading: false });
        return workflow;
      }
      
      set({ loading: false });
      return null;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return null;
    }
  },
  
  createWorkflow: async (workflow: Omit<Workflow, 'id'>) => {
    try {
      set({ loading: true, error: null });
      
      const docRef = await addDoc(collection(db, 'workflows'), workflow);
      const newWorkflow = { id: docRef.id, ...workflow } as Workflow;
      
      set((state) => ({
        workflows: [...state.workflows, newWorkflow],
        loading: false,
      }));
      
      return docRef.id;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  updateWorkflow: async (id: string, data: Partial<Workflow>) => {
    try {
      set({ loading: true, error: null });
      
      await updateDoc(doc(db, 'workflows', id), data);
      
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
      
      await deleteDoc(doc(db, 'workflows', id));
      
      set((state) => ({
        workflows: state.workflows.filter((workflow) => workflow.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  // User workflow actions
  fetchUserWorkflows: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      
      const userWorkflowsCollection = collection(db, 'userWorkflows');
      const userWorkflowsQuery = query(userWorkflowsCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(userWorkflowsQuery);
      
      const userWorkflows: UserWorkflow[] = [];
      querySnapshot.forEach((doc) => {
        userWorkflows.push({
          id: doc.id,
          ...doc.data(),
        } as UserWorkflow);
      });
      
      set({ userWorkflows, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  getUserWorkflowById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      const userWorkflowDoc = await getDoc(doc(db, 'userWorkflows', id));
      
      if (userWorkflowDoc.exists()) {
        const userWorkflow = {
          id: userWorkflowDoc.id,
          ...userWorkflowDoc.data(),
        } as UserWorkflow;
        
        set({ loading: false });
        return userWorkflow;
      }
      
      set({ loading: false });
      return null;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return null;
    }
  },
  
  startWorkflow: async (workflowId: string, userId: string, parameters: Record<string, any>) => {
    try {
      set({ loading: true, error: null });
      
      // Get workflow to determine first step
      const workflow = await get().getWorkflowById(workflowId);
      
      if (!workflow || !workflow.steps.length) {
        throw new Error('Workflow not found or has no steps');
      }
      
      const userWorkflow: Omit<UserWorkflow, 'id'> = {
        userId,
        workflowId,
        parameters,
        startedAt: new Date().toISOString(),
        currentStepId: workflow.steps[0].id,
        status: 'in-progress',
      };
      
      const docRef = await addDoc(collection(db, 'userWorkflows'), userWorkflow);
      const newUserWorkflow = { id: docRef.id, ...userWorkflow } as UserWorkflow;
      
      set((state) => ({
        userWorkflows: [...state.userWorkflows, newUserWorkflow],
        loading: false,
      }));
      
      return docRef.id;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  updateUserWorkflow: async (id: string, data: Partial<UserWorkflow>) => {
    try {
      set({ loading: true, error: null });
      
      await updateDoc(doc(db, 'userWorkflows', id), data);
      
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
        status: 'completed',
        completedAt: new Date().toISOString(),
      };
      
      await updateDoc(doc(db, 'userWorkflows', id), completionData);
      
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