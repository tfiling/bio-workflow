import { Link } from 'react-router-dom';
import { PlusCircle, Settings, Users, Activity } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card, CardContent } from '../components/ui/Card';

export function AdminPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/admin/workflows/new">
              <Card className="h-full transition-all duration-200 hover:shadow-elevated hover:-translate-y-1">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <PlusCircle className="h-12 w-12 text-primary-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Workflow</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Add a new workflow template to the system
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/settings">
              <Card className="h-full transition-all duration-200 hover:shadow-elevated hover:-translate-y-1">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Settings className="h-12 w-12 text-gray-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Configure system preferences
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/analytics">
              <Card className="h-full transition-all duration-200 hover:shadow-elevated hover:-translate-y-1">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Activity className="h-12 w-12 text-success-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
                  <p className="text-sm text-gray-500 text-center">
                    View usage statistics and reports
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}