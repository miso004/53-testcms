import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faEnvelope, 
  faTimes, 
  faEye, 
  faEyeSlash,
  faSignInAlt,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';

const UserAuth = ({ 
  isOpen, 
  onClose, 
  mode = 'login', // 'login' or 'signup'
  projectId,
  onSuccess,
  onModeSwitch // 모드 전환 콜백 추가
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // 입력 시 에러 메시지 제거
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        // 회원가입 로직
        if (formData.password !== formData.confirmPassword) {
          setError('비밀번호가 일치하지 않습니다.');
          return;
        }

        // 가상 데이터에 사용자 추가
        const newUser = {
          id: Date.now(),
          username: formData.username,
          password: formData.password, // 비밀번호 저장 추가
          email: formData.email,
          projectId: projectId,
          createdAt: new Date().toISOString()
        };

        // localStorage에 저장 (실제로는 API 호출)
        const existingUsers = JSON.parse(localStorage.getItem(`project_${projectId}_users`) || '[]');
        existingUsers.push(newUser);
        localStorage.setItem(`project_${projectId}_users`, JSON.stringify(existingUsers));

        // 로그인 상태로 설정
        localStorage.setItem(`project_${projectId}_user`, JSON.stringify(newUser));
        
        onSuccess(newUser);
        onClose();
      } else {
        // 로그인 로직
        // 1. 슈퍼어드민 로그인 시도
        const superAdmin = localStorage.getItem('superAdmin');
        if (superAdmin) {
          try {
            const adminData = JSON.parse(superAdmin);
            if (formData.username === adminData.username && formData.password === 'admin123') {
              const superAdminUser = {
                ...adminData,
                role: 'super_admin',
                isSuperAdmin: true,
                projectId: projectId
              };
              // 슈퍼 관리자도 프로젝트별 사용자로 저장 (권한 유지)
              localStorage.setItem(`project_${projectId}_user`, JSON.stringify(superAdminUser));
              onSuccess(superAdminUser);
              onClose();
              return;
            }
          } catch (error) {
            console.error('슈퍼어드민 정보 파싱 오류:', error);
          }
        }

        // 2. 프로젝트 관리자 로그인 시도
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const currentProject = projects.find(p => p.id === projectId);
        if (currentProject && 
            formData.username === currentProject.adminUsername && 
            formData.password === currentProject.adminPassword) {
          const projectAdminUser = {
            id: Date.now(),
            username: currentProject.adminUsername,
            password: currentProject.adminPassword,
            email: currentProject.adminEmail,
            role: 'project_admin',
            projectId: projectId,
            createdAt: currentProject.createdAt
          };
          localStorage.setItem(`project_${projectId}_user`, JSON.stringify(projectAdminUser));
          onSuccess(projectAdminUser);
          onClose();
          return;
        }

        // 3. 프로젝트별 사용자 목록에서 프로젝트 관리자 찾기
        const projectUsers = JSON.parse(localStorage.getItem(`project_${projectId}_users`) || '[]');
        const projectAdmin = projectUsers.find(u => 
          u.role === 'project_admin' && 
          u.username === formData.username && 
          u.password === formData.password
        );
        
        if (projectAdmin) {
          localStorage.setItem(`project_${projectId}_user`, JSON.stringify(projectAdmin));
          onSuccess(projectAdmin);
          onClose();
          return;
        }

        // 4. 일반 사용자 로그인 시도
        const users = JSON.parse(localStorage.getItem(`project_${projectId}_users`) || '[]');
        const user = users.find(u => 
          u.username === formData.username && u.password === formData.password
        );

        if (user) {
          localStorage.setItem(`project_${projectId}_user`, JSON.stringify(user));
          onSuccess(user);
          onClose();
        } else {
          setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
      }
    } catch (err) {
      setError('처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      confirmPassword: ''
    });
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* 모달 */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* 헤더 */}
        <div className="bg-blue-600 from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon 
                  icon={mode === 'login' ? faSignInAlt : faUserPlus} 
                  className="h-5 w-5" 
                />
              </div>
              <h2 className="text-2xl font-bold">
                {mode === 'login' ? '로그인' : '회원가입'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 폼 */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 사용자명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사용자명
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="사용자명을 입력하세요"
                  required
                />
                <FontAwesomeIcon 
                  icon={faUser} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
              </div>
            </div>

            {/* 이메일 (회원가입 시에만) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-10 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="이메일을 입력하세요"
                    required
                  />
                  <FontAwesomeIcon 
                    icon={faEnvelope} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                </div>
              </div>
            )}

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-10 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
                <FontAwesomeIcon 
                  icon={faLock} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 (회원가입 시에만) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-10 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                  />
                  <FontAwesomeIcon 
                    icon={faLock} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {mode === 'login' ? '로그인 중...' : '가입 중...'}
                </div>
              ) : (
                mode === 'login' ? '로그인' : '회원가입'
              )}
            </button>
          </form>

          {/* 모드 전환 */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'login' ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
              <button
                onClick={() => {
                  resetForm();
                  onModeSwitch(mode === 'login' ? 'signup' : 'login');
                }}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                {mode === 'login' ? '회원가입' : '로그인'}
              </button>
            </p>
          </div>

          {/* 테스트 계정 정보 (로그인 모드에서만) */}
          {mode === 'login' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">테스트 계정</p>
              <div className="text-xs text-blue-700 space-y-1">
                <div>사용자명: <span className="font-mono">test_user</span></div>
                <div>비밀번호: <span className="font-mono">test123</span></div>
              </div>
            </div>
          )}

          {/* 프로젝트 관리자 로그인 안내 (로그인 모드에서만) */}
          {mode === 'login' && (
            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-green-800 font-medium mb-2">프로젝트 관리자 로그인</p>
              <div className="text-xs text-green-700 space-y-1">
                <p>프로젝트 관리자 계정으로도 로그인할 수 있습니다.</p>
                <p>관리자 계정 정보는 프로젝트 생성 시 설정됩니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAuth;
