export interface User {
  id: string;
  displayName: string;
  role: 'admin';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  objective: string;
  startDate: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Workflow {
  id: string;
  projectId: string;
  title: string;
  description: string;
  hypothesis: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTotalTime: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
}

export interface Assay {
  id: string;
  workflowId: string;
  title: string;
  description: string;
  protocol: string;
  materials: AssayMaterial[];
  parameters: AssayParameter[];
  estimatedTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssayMaterial {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  affiliateLink?: string;
}

export interface AssayParameter {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox';
  required: boolean;
  options?: string[];
  defaultValue?: string | number | boolean;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface Step {
  id: string;
  assayId: string;
  title: string;
  description: string;
  estimatedTime: string;
  warning?: string;
  notes?: string;
  order: number;
  calculationDependencies?: string[];
  calculationFormula?: string;
}

export interface UserWorkflow {
  id: string;
  projectId: string;
  workflowId: string;
  startedAt: string;
  completedAt?: string;
  currentAssayId: string;
  currentStepId: string;
  parameters: Record<string, string | number | boolean>;
  status: 'in-progress' | 'completed' | 'abandoned';
  notes?: string;
}