import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Beaker } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card, CardContent } from '../components/ui/Card';
import { useWorkflowStore } from '../store/workflowStore';
import { truncateText } from '../lib/utils';

export function WorkflowsPage() {
  const { workflows, fetchWorkflows, loading } = useWorkflowStore();

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">All Workflows</h1>
            <Link to="/admin/workflows/new" className="text-primary-500 hover:text-primary-600 flex items-center">
              Create Workflow <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="h-64">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="h-24 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : workflows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <Link key={workflow.id} to={`/workflows/${workflow.id}`}>
                  <Card className="h-full transition-all duration-200 hover:shadow-elevated hover:-translate-y-1">
                    <CardContent className="h-full flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {workflow.title}
                      </h3>
                      <div className="mb-2 flex items-center text-sm text-gray-500">
                        <Beaker className="h-4 w-4 mr-1" />
                        <span>{workflow.category}</span>
                        <span className="mx-2">•</span>
                        <span>{workflow.difficulty}</span>
                      </div>
                      <p className="text-gray-600 mb-4 flex-grow">
                        {truncateText(workflow.description, 120)}
                      </p>
                      <div className="mt-auto pt-4 flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          {workflow.estimatedTotalTime}
                        </span>
                        <span className="text-primary-500 font-medium flex items-center">
                          View workflow <ArrowRight className="h-4 w-4 ml-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Beaker className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows available yet</h3>
              <p className="text-gray-500 mb-6">Create your first workflow to get started.</p>
              <Link to="/admin/workflows/new">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
                  Create Workflow
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}