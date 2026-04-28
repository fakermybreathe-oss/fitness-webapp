import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './hooks/useAuth';
import MobileLayout from './components/layout/MobileLayout';
import { useEffect } from 'react';
import { generateWeeklyPlan } from './data/workoutPlans';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Equipment = lazy(() => import('./pages/Equipment'));
const Plan = lazy(() => import('./pages/Plan'));
const Progress = lazy(() => import('./pages/Progress'));
const CheckIn = lazy(() => import('./pages/CheckIn'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const BodyDataForm = lazy(() => import('./components/profile/BodyDataForm'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useApp();
  if (!state.user) {
    return <Navigate to="/login" replace />;
  }
  return <MobileLayout>{children}</MobileLayout>;
};

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <MobileLayout>{children}</MobileLayout>;
};

const AppRoutes: React.FC = () => {
  const { state, saveWeeklyPlan } = useApp();
  const location = useLocation();

  // 1. 自动补全逻辑：如果已登录且有身体数据但没计划，或计划与目标不一致
  useEffect(() => {
    if (state.user && state.bodyData) {
      const needsNewPlan = !state.weeklyPlan || (state.weeklyPlan.goal && state.weeklyPlan.goal !== state.bodyData.goal);
      
      if (needsNewPlan) {
        console.log('Detected missing or inconsistent plan, generating auto-recovery plan...');
        const newPlan = generateWeeklyPlan(state.bodyData);
        newPlan.userId = state.user.id;
        saveWeeklyPlan(newPlan);
      }
    }
  }, [state.user, state.bodyData, state.weeklyPlan, saveWeeklyPlan]);

  // 2. 强制引导逻辑：如果已登录但没有身体数据，且不在填报页，则重定向
  if (state.user && !state.bodyData && location.pathname !== '/body-data') {
    return <Navigate to="/body-data" replace />;
  }


  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">加载中...</p>
        </div>
      </div>
    }>
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/login" element={state.user ? <Navigate to="/dashboard" /> : <PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={state.user ? <Navigate to="/dashboard" /> : <PublicLayout><Register /></PublicLayout>} />
      <Route
        path="/body-data"
        element={
          <ProtectedRoute>
            <BodyDataForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/equipment" element={<ProtectedRoute><Equipment /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
      <Route path="/checkin" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
      <Route path="/checkin/:date" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route
        path="/plan"
        element={
          <ProtectedRoute>
            <Plan />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
