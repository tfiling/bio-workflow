/*
  # Add steps and user workflows tables

  1. New Tables
    - `steps`: Stores step information for assays
    - `user_workflows`: Tracks user progress through workflows
    
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create steps table
CREATE TABLE steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assay_id uuid REFERENCES assays(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  estimated_time text NOT NULL,
  warning text,
  notes text,
  order_index integer NOT NULL,
  calculation_dependencies text[] DEFAULT array[]::text[],
  calculation_formula text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage steps for their assays"
  ON steps
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assays
      WHERE assays.id = assay_id
      AND assays.user_id = auth.uid()
    )
  );

-- Create user_workflows table
CREATE TABLE user_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  current_assay_id uuid REFERENCES assays(id),
  current_step_id uuid REFERENCES steps(id),
  parameters jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL CHECK (status IN ('in-progress', 'completed', 'abandoned')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own workflow progress"
  ON user_workflows
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_workflows_updated_at
  BEFORE UPDATE ON user_workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();