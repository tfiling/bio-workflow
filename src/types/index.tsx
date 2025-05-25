export interface User {
  id: string;
  displayName: string;
  role: 'admin';
}

export interface WorkflowParameter {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox';
  required: boolean;
  options?: string[]; // For select, radio, checkbox types
  defaultValue?: string | number | boolean;
  unit?: string; // For number types (e.g., "µL", "mg", "°C")
  min?: number; // For number types
  max?: number; // For number types
  step?: number; // For number types
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  estimatedTime?: string; // e.g., "30 minutes"
  warning?: string;
  notes?: string;
  materials?: WorkflowMaterial[];
  calculationDependencies?: string[]; // IDs of parameters used in calculations
  calculationFormula?: string; // Formula to calculate values based on parameters
}

export interface WorkflowMaterial {
  id: string;
  name: string;
  quantity: string;
  affiliateLink?: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTotalTime: string;
  createdAt: string;
  updatedAt: string;
  parameters: WorkflowParameter[];
  steps: WorkflowStep[];
  publishStatus: 'draft' | 'published' | 'archived';
}

export interface UserWorkflow {
  id: string;
  workflowId: string;
  startedAt: string;
  completedAt?: string;
  currentStepId: string;
  parameters: Record<string, string | number | boolean>;
  status: 'in-progress' | 'completed' | 'abandoned';
  notes?: string;
}