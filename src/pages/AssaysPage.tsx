import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TestTube, Clock, Beaker } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useWorkflowStore } from '../store/workflowStore';
import { truncateText } from '../lib/utils';

export function AssaysPage() {
  const { assays, fetchAssays, loading } = useWorkflowStore();

  useEffect(() => {
    fetchAssays();
  }, [fetchAssays]);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Assay Inventory</h1>
            <Link to="/admin/assays/new" className="text-primary-500 hover:text-primary-600 flex items-center">
              Create Assay <ArrowRight className="h-4 w-4 ml-1" />
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
          ) : assays.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {assays.map((assay) => (
                <Link key={assay.id} to={`/assays/${assay.id}`}>
                  <Card className="h-full transition-all duration-200 hover:shadow-elevated hover:-translate-y-1">
                    <CardContent className="h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        <TestTube className="h-6 w-6 text-primary-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {assay.title}
                        </h3>
                      </div>
                      <div className="mb-2 flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{assay.estimatedTime}</span>
                      </div>
                      <p className="text-gray-600 mb-4 flex-grow">
                        {truncateText(assay.description, 120)}
                      </p>
                      <div className="mt-4 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {assay.materials.slice(0, 3).map((material, index) => (
                            <Badge key={index} variant="secondary" size="sm">
                              {material.name}
                            </Badge>
                          ))}
                          {assay.materials.length > 3 && (
                            <Badge variant="outline" size="sm">
                              +{assay.materials.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center text-gray-500">
                            <Beaker className="h-4 w-4 mr-1" />
                            <span>{assay.parameters.length} parameters</span>
                          </div>
                          <span className="text-primary-500 font-medium flex items-center">
                            View details <ArrowRight className="h-4 w-4 ml-1" />
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assays available</h3>
                <p className="text-gray-500 mb-6">Create your first assay to get started with experimental procedures.</p>
                <Link to="/admin/assays/new">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
                    Create Assay
                  </button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}