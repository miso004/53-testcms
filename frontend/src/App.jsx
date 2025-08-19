import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectHomePage from './pages/ProjectHomePage';
import ProjectAdminDashboard from './pages/ProjectAdminDashboard';
import { isSuperAdmin, hasProjectManagementPermission } from './utils/permissions';

// 슈퍼 관리자 전용 보호된 라우트 컴포넌트
const SuperAdminRoute = ({ children }) => {
  if (isSuperAdmin()) {
    return children;
  }
  return <Navigate to="/login" replace />;
};

// 프로젝트 관리 권한이 있는 사용자를 위한 보호된 라우트 컴포넌트
const ProjectManagementRoute = ({ children }) => {
  const { projectId } = useParams();
  if (hasProjectManagementPermission(projectId)) {
    return children;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* 슈퍼 관리자 전용 라우트 */}
          <Route path="/dashboard" element={
            <SuperAdminRoute>
              <DashboardPage />
            </SuperAdminRoute>
          } />
          
          <Route path="/create-project" element={
            <SuperAdminRoute>
              <CreateProjectPage />
            </SuperAdminRoute>
          } />
          
          {/* 프로젝트 홈페이지 (공개) */}
          <Route path="/project/:projectId" element={<ProjectHomePage />} />
          
          {/* 프로젝트 관리자 대시보드 (프로젝트 관리 권한 필요) */}
          <Route path="/project/:projectId/admin" element={
            <ProjectManagementRoute>
              <ProjectAdminDashboard />
            </ProjectManagementRoute>
          } />
          
          {/* 기본 리다이렉트 */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
