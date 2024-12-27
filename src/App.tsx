import { AutoAuth } from '@/components/auth/AutoAuth';
import { Routes, Route } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import { useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ProjectHeader } from '@/components/ProjectHeader';
import { Navigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const handleDialogClose = () => {
    navigate('/home', { replace: true });
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      <AutoAuth />
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/home" replace />}
        />
        {AppRoutes}
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;