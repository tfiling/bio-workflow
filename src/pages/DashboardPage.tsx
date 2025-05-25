import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useWorkflowStore } from '../store/workflowStore';
import { formatDate } from '../lib/utils';

export function DashboardPage() {
  const { userWorkflows, fetchUserWorkflows, loading } = useWorkflowStore();

  useEffect(() => {
    fetchUserWorkflows();
  }, [fetchUserWorkflows]);

  const activeWorkflows = userWorkflows.filter(w => w.status === 'in-progress');
  const completedWorkflows = userWorkflows.filter(w => w.status === 'completed');

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Active Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary-600">
                  {activeWorkflows.length}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  In Progress
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completed Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success-600">
                  {completedWorkflows.length}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Finished
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Workflows</h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="h-24">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userWorkflows.length > 0 ? (
              <div className="space-y-4">
                {userWorkflows.slice(0, 5).map((workflow) => (
                  <Link key={workflow.id} to={`/workflows/${workflow.workflowId}`}>
                    <Card className="transition-all duration-200 hover:shadow-elevated hover:-translate-y-1">
                      <CardContent className="flex items-center justify-between py-4">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Workflow #{workflow.id}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Started {formatDate(workflow.startedAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge
                            variant={workflow.status === 'completed' ? 'success' : 'primary'}
                          >
                            {workflow.status === 'completed' ? 'Completed' : 'In Progress'}
                          </Badge>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
                  <p className="text-gray-500 mb-6">Start a new workflow to track your progress.</p>
                  <Link to="/workflows">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
                      Browse Workflows
                    </button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}