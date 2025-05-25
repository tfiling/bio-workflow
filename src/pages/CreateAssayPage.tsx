import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Minus, Save, ArrowLeft } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useWorkflowStore } from '../store/workflowStore';

const materialSchema = z.object({
  name: z.string().min(1, 'Material name is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  unit: z.string().min(1, 'Unit is required'),
  affiliateLink: z.string().optional(),
});

const parameterSchema = z.object({
  name: z.string().min(1, 'Parameter name is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['text', 'number', 'select', 'radio', 'checkbox']),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  unit: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
});

const assaySchema = z.object({
  workflowId: z.string().min(1, 'Workflow is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  protocol: z.string().min(10, 'Protocol must be at least 10 characters'),
  estimatedTime: z.string().min(1, 'Estimated time is required'),
});

type AssayFormData = z.infer<typeof assaySchema>;

export function CreateAssayPage() {
  const navigate = useNavigate();
  const { createAssay } = useWorkflowStore();
  const [materials, setMaterials] = useState<z.infer<typeof materialSchema>[]>([]);
  const [parameters, setParameters] = useState<z.infer<typeof parameterSchema>[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssayFormData>({
    resolver: zodResolver(assaySchema),
  });

  const addMaterial = () => {
    setMaterials([...materials, { name: '', quantity: '', unit: '' }]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: keyof z.infer<typeof materialSchema>, value: string) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    setMaterials(updatedMaterials);
  };

  const addParameter = () => {
    setParameters([
      ...parameters,
      {
        name: '',
        description: '',
        type: 'text',
        required: false,
      },
    ]);
  };

  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const updateParameter = (
    index: number,
    field: keyof z.infer<typeof parameterSchema>,
    value: string | boolean
  ) => {
    const updatedParameters = [...parameters];
    updatedParameters[index] = { ...updatedParameters[index], [field]: value };
    setParameters(updatedParameters);
  };

  const onSubmit = async (data: AssayFormData) => {
    try {
      await createAssay({
        ...data,
        materials,
        parameters,
      });
      navigate('/assays');
    } catch (error) {
      console.error('Error creating assay:', error);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/assays')}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Assays
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Create New Assay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Title"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="e.g., PCR Amplification"
                />

                <Input
                  label="Description"
                  {...register('description')}
                  error={errors.description?.message}
                  placeholder="Brief description of the assay"
                />

                <Input
                  label="Protocol"
                  {...register('protocol')}
                  error={errors.protocol?.message}
                  placeholder="Detailed protocol instructions"
                />

                <Input
                  label="Estimated Time"
                  {...register('estimatedTime')}
                  error={errors.estimatedTime?.message}
                  placeholder="e.g., 2 hours"
                />

                <Input
                  label="Workflow ID"
                  {...register('workflowId')}
                  error={errors.workflowId?.message}
                  placeholder="Associated workflow ID"
                />
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Materials</CardTitle>
              </CardHeader>
              <CardContent>
                {materials.map((material, index) => (
                  <div key={index} className="flex gap-4 mb-4">
                    <Input
                      placeholder="Material name"
                      value={material.name}
                      onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Quantity"
                      value={material.quantity}
                      onChange={(e) => updateMaterial(index, 'quantity', e.target.value)}
                    />
                    <Input
                      placeholder="Unit"
                      value={material.unit}
                      onChange={(e) => updateMaterial(index, 'unit', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeMaterial(index)}
                      leftIcon={<Minus className="h-4 w-4" />}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addMaterial}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Material
                </Button>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                {parameters.map((parameter, index) => (
                  <div key={index} className="flex gap-4 mb-4">
                    <Input
                      placeholder="Parameter name"
                      value={parameter.name}
                      onChange={(e) => updateParameter(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Description"
                      value={parameter.description}
                      onChange={(e) => updateParameter(index, 'description', e.target.value)}
                    />
                    <select
                      className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      value={parameter.type}
                      onChange={(e) => updateParameter(index, 'type', e.target.value as any)}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Select</option>
                      <option value="radio">Radio</option>
                      <option value="checkbox">Checkbox</option>
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeParameter(index)}
                      leftIcon={<Minus className="h-4 w-4" />}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addParameter}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Parameter
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                leftIcon={<Save className="h-4 w-4" />}
              >
                {isSubmitting ? 'Creating...' : 'Create Assay'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}