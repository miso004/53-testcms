import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faSignInAlt, 
  faTimes,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

const ProjectAdminLogin = ({ projectId, projectName, onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // 프로젝트 정보에서 관리자 계정 확인
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const project = projects.find(p => p.id === projectId);
      
      if (!project) {
        setError('프로젝트를 찾을 수 없습니다.');
        return;
      }

      // 관리자 계정 확인
      if (formData.username === project.adminUsername && formData.password === project.adminPassword) {
        // 프로젝트 관리자 로그인 성공
        const projectAdmin = {
          username: formData.username,
          password: formData.password,
          role: 'project_admin',
          projectId: projectId,
          loginTime: new Date().toISOString()
        };
        
        // 프로젝트별 사용자 정보 저장
        localStorage.setItem(`project_${projectId}_user`, JSON.stringify(projectAdmin));
        
        onLoginSuccess(projectAdmin);
        onClose();
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faShieldAlt} className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">프로젝트 관리자 로그인</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-blue-600">{projectName}</span> 프로젝트 관리자 계정으로 로그인하세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">관리자 ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="관리자 ID"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="비밀번호"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            disabled={!formData.username || !formData.password || loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>로그인 중...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} className="h-5 w-5" />
                <span>로그인</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-center">
            <p className="text-sm text-blue-800 font-medium mb-2">관리자 계정 정보</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-blue-600">아이디:</span>
                <div className="font-mono font-bold text-blue-800 bg-white px-2 py-1 rounded border mt-1">
                  {projectName === '회사 홈페이지' ? 'company_admin' : 
                   projectName === '쇼핑몰' ? 'shop_admin' : 
                   projectName === '블로그' ? 'blog_admin' : 'admin'}
                </div>
              </div>
              <div>
                <span className="text-blue-600">비밀번호:</span>
                <div className="font-mono font-bold text-blue-800 bg-white px-2 py-1 rounded border mt-1">
                  {projectName === '회사 홈페이지' ? 'company123' : 
                   projectName === '쇼핑몰' ? 'shop123' : 
                   projectName === '블로그' ? 'blog123' : 'admin123'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAdminLogin;

