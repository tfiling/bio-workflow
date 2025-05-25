import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, FlaskRound as Flask, Beaker, Microscope, BookOpen } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { useWorkflowStore } from '../store/workflowStore';
import { Workflow } from '../types';
import { truncateText } from '../lib/utils';

export function HomePage() {
  const { workflows, fetchWorkflows, loading } = useWorkflowStore();
  const [featuredWorkflows, setFeaturedWorkflows] = useState<Workflow[]>([]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  useEffect(() => {
    if (workflows.length > 0) {
      setFeaturedWorkflows(workflows.slice(0, 3));
    }
  }, [workflows]);

  return (
    <AppLayout>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Streamline Your Microbiology Lab Workflows
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Step-by-step guides for producing custom Plasmid DNA sections
              and other critical laboratory processes.
            </p>
            <div className="flex justify-center">
              <Link to="/workflows">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Explore Workflows
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search section */}
      <section className="py-12 bg-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Find the workflow you need
              </h2>
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Search for workflows, techniques, or materials..."
                  fullWidth
                  leftIcon={<Search className="h-4 w-4" />}
                  className="rounded-r-none"
                />
                <Button className="rounded-l-none">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured workflows */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Workflows</h2>
              <Link to="/workflows" className="text-primary-500 hover:text-primary-600 flex items-center">
                View all <ArrowRight className="h-4 w-4 ml-1" />
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
            ) : featuredWorkflows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredWorkflows.map((workflow) => (
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
                <Flask className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows available yet</h3>
                <p className="text-gray-500 mb-6">Check back soon or create your own workflow.</p>
                <Link to="/admin/workflows/new">
                  <Button>Create Workflow</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Use BioWorkflow
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform helps researchers streamline lab work, reduce errors, and discover the best products for your experiments.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-card">
                <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                  <Microscope className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Precise Protocols
                </h3>
                <p className="text-gray-600">
                  Step-by-step workflows with automated calculations ensure precision in every lab procedure.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-card">
                <div className="h-12 w-12 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center mb-4">
                  <Beaker className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Customizable Parameters
                </h3>
                <p className="text-gray-600">
                  Personalize workflows with your specific requirements and get real-time adjustments to your protocol.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-card">
                <div className="h-12 w-12 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Quality Resources
                </h3>
                <p className="text-gray-600">
                  Discover top-quality lab supplies and materials with our curated recommendations and affiliate links.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-primary-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Optimize Your Lab Work?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of researchers who save time and reduce errors with our workflow platform.
            </p>
            <Link to="/workflows">
              <Button size="lg" variant="secondary">
                Browse Workflows
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}