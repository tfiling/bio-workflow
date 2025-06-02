-- Create workflows table
CREATE TABLE workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  difficulty text NOT NULL,
  estimated_total_time text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own workflows"
  ON workflows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflows"
  ON workflows
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflows"
  ON workflows
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflows"
  ON workflows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create assays table
CREATE TABLE assays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  protocol text NOT NULL,
  materials jsonb DEFAULT '[]'::jsonb,
  parameters jsonb DEFAULT '[]'::jsonb,
  estimated_time text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE assays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own assays"
  ON assays
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own assays"
  ON assays
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own assays"
  ON assays
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assays"
  ON assays
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create workflow_assays junction table
CREATE TABLE workflow_assays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE NOT NULL,
  assay_id uuid REFERENCES assays(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(workflow_id, assay_id)
);

ALTER TABLE workflow_assays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage workflow assays for their workflows"
  ON workflow_assays
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

-- Create assay_dependencies table
CREATE TABLE assay_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE NOT NULL,
  from_assay_id uuid REFERENCES assays(id) ON DELETE CASCADE NOT NULL,
  to_assay_id uuid REFERENCES assays(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(workflow_id, from_assay_id, to_assay_id)
);

ALTER TABLE assay_dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage assay dependencies for their workflows"
  ON assay_dependencies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assays_updated_at
  BEFORE UPDATE ON assays
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();