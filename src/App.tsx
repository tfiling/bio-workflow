import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { AssaysPage } from './pages/AssaysPage';
import { CreateAssayPage } from './pages/CreateAssayPage';
import { CreateWorkflowPage } from './pages/CreateWorkflowPage';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/admin/workflows/new" element={<CreateWorkflowPage />} />
          <Route path="/assays" element={<AssaysPage />} />
          <Route path="/admin/assays/new" element={<CreateAssayPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;