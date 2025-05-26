import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import { Search, Plus, Save, ArrowLeft } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useWorkflowStore } from '../store/workflowStore';
import 'reactflow/dist/style.css';

const workflowSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
});

type WorkflowFormData = z.infer<typeof workflowSchema>;

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export function CreateWorkflowPage() {
  const navigate = useNavigate();
  const { createWorkflow, assays } = useWorkflowStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowSchema),
  });

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const assayData = JSON.parse(event.dataTransfer.getData('application/json'));

      if (!reactFlowBounds || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `assay-${assayData.id}`,
        type: 'default',
        position,
        data: { label: assayData.title, assayId: assayData.id },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const filteredAssays = assays.filter((assay) =>
    assay.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onDragStart = (event: React.DragEvent, assay: any) => {
    event.dataTransfer.setData('application/json', JSON.stringify(assay));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onSubmit = async (data: WorkflowFormData) => {
    try {
      const workflowData = {
        ...data,
        description: data.description || '',
        category: data.category || '',
        assayDependencies: edges.map((edge) => ({
          fromAssayId: edge.source.replace('assay-', ''),
          toAssayId: edge.target.replace('assay-', ''),
        })),
        assays: nodes.map((node) => node.data.assayId),
      };

      await createWorkflow(workflowData);
      navigate('/workflows');
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/workflows')}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Workflows
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Create New Workflow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Title"
                    {...register('title')}
                    error={errors.title?.message}
                    placeholder="e.g., DNA Extraction Protocol"
                  />

                  <Input
                    label="Description (optional)"
                    {...register('description')}
                    error={errors.description?.message}
                    placeholder="Detailed description of the workflow"
                  />

                  <Input
                    label="Category (optional)"
                    {...register('category')}
                    error={errors.category?.message}
                    placeholder="e.g., Molecular Biology"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      {...register('difficulty')}
                      className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    {errors.difficulty?.message && (
                      <p className="mt-1 text-sm text-error-500">
                        {errors.difficulty.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Assay Dependencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="h-[600px] border border-gray-200 rounded-lg"
                    ref={reactFlowWrapper}
                  >
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      onConnect={onConnect}
                      onInit={setReactFlowInstance}
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      fitView
                    >
                      <Background />
                      <Controls />
                      <MiniMap />
                    </ReactFlow>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Available Assays</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input
                      placeholder="Search assays..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      leftIcon={<Search className="h-4 w-4" />}
                    />
                  </div>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {filteredAssays.map((assay) => (
                      <div
                        key={assay.id}
                        className="p-3 bg-gray-50 rounded-md cursor-move hover:bg-gray-100 transition-colors"
                        draggable
                        onDragStart={(e) => onDragStart(e, assay)}
                      >
                        <h4 className="font-medium text-gray-900">{assay.title}</h4>
                        <p className="text-sm text-gray-500">
                          {assay.estimatedTime}
                        </p>
                      </div>
                    ))}
                  </div>

                  {filteredAssays.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No assays found</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate('/admin/assays/new')}
                        leftIcon={<Plus className="h-4 w-4" />}
                      >
                        Create New Assay
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              leftIcon={<Save className="h-4 w-4" />}
            >
              {isSubmitting ? 'Creating...' : 'Create Workflow'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}