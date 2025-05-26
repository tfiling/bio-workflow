import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Minus, Save, ArrowLeft, Clock } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useWorkflowStore } from '../store/workflowStore';
import { calculateDuration } from '../lib/utils';

const materialSchema = z.object({
  name: z.string(),
  quantity: z.string(),
  unit: z.string(),
  affiliateLink: z.string().optional(),
});

const parameterSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['text', 'number', 'select', 'radio', 'checkbox']),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  unit: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
});

const stepSchema = z.object({
  title: z.string(),
  description: z.string(),
  duration: z.string().regex(/^\d{2}:\d{2}$/, 'Duration must be in HH:MM format'),
  warning: z.string().optional(),
  notes: z.string().optional(),
  calculationDependencies: z.array(z.string()).optional(),
  calculationFormula: z.string().optional(),
});

const assaySchema = z.object({
  title: z.string(),
  description: z.string(),
  protocol: z.string(),
});

type AssayFormData = z.infer<typeof assaySchema>;

export function CreateAssayPage() {
  const navigate = useNavigate();
  const { createAssay } = useWorkflowStore();
  const [materials, setMaterials] = useState<z.infer<typeof materialSchema>[]>([]);
  const [parameters, setParameters] = useState<z.infer<typeof parameterSchema>[]>([]);
  const [steps, setSteps] = useState<z.infer<typeof stepSchema>[]>([]);

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

  const addStep = () => {
    setSteps([
      ...steps,
      {
        title: '',
        description: '',
        duration: '00:00',
        warning: '',
        notes: '',
        calculationDependencies: [],
        calculationFormula: '',
      },
    ]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (
    index: number,
    field: keyof z.infer<typeof stepSchema>,
    value: string | string[]
  ) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setSteps(updatedSteps);
  };

  const setStepDuration = (index: number, totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const minutes = (totalMinutes % 60).toString().padStart(2, '0');
    updateStep(index, 'duration', `${hours}:${minutes}`);
  };

  const calculateTotalTime = () => {
    const totalMinutes = steps.reduce((total, step) => {
      const [hours, minutes] = step.duration.split(':').map(Number);
      return total + (hours * 60) + minutes;
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`.trim();
  };

  const onSubmit = async (data: AssayFormData) => {
    try {
      await createAssay({
        ...data,
        estimatedTime: calculateTotalTime(),
        materials,
        parameters,
        steps: steps.map((step, index) => {
          const [hours, minutes] = step.duration.split(':').map(Number);
          return {
            ...step,
            order: index + 1,
            estimatedTime: `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`.trim()
          };
        }),
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

                <div className="text-sm text-gray-600">
                  Estimated Time: {calculateTotalTime() || 'No steps added yet'}
                </div>
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

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Steps</CardTitle>
              </CardHeader>
              <CardContent>
                {steps.map((step, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium">Step {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeStep(index)}
                        leftIcon={<Minus className="h-4 w-4" />}
                      >
                        Remove Step
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <Input
                        placeholder="Step title"
                        value={step.title}
                        onChange={(e) => updateStep(index, 'title', e.target.value)}
                      />
                      <Input
                        placeholder="Step description"
                        value={step.description}
                        onChange={(e) => updateStep(index, 'description', e.target.value)}
                      />
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (HH:MM)
                          </label>
                          <Input
                            type="text"
                            pattern="[0-9]{2}:[0-9]{2}"
                            placeholder="00:00"
                            value={step.duration}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,2}:\d{0,2}$/.test(value)) {
                                updateStep(index, 'duration', value);
                              }
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">
                            Duration Slider (in minutes)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="480"
                            value={(() => {
                              const [hours, minutes] = step.duration.split(':').map(Number);
                              return (hours * 60) + minutes;
                            })()}
                            onChange={(e) => setStepDuration(index, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setStepDuration(index, 30)}
                            leftIcon={<Clock className="h-4 w-4" />}
                          >
                            30 mins
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setStepDuration(index, 60)}
                            leftIcon={<Clock className="h-4 w-4" />}
                          >
                            1 hour
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setStepDuration(index, 120)}
                            leftIcon={<Clock className="h-4 w-4" />}
                          >
                            2 hours
                          </Button>
                        </div>
                      </div>

                      <Input
                        placeholder="Warning (optional)"
                        value={step.warning || ''}
                        onChange={(e) => updateStep(index, 'warning', e.target.value)}
                      />
                      <Input
                        placeholder="Notes (optional)"
                        value={step.notes || ''}
                        onChange={(e) => updateStep(index, 'notes', e.target.value)}
                      />
                      <Input
                        placeholder="Calculation formula (optional)"
                        value={step.calculationFormula || ''}
                        onChange={(e) => updateStep(index, 'calculationFormula', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addStep}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Step
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