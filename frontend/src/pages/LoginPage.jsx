import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'flowbite-react';

import Input from '../components/Input';
import Button from '../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faShieldAlt, 
  faExclamationTriangle, 
  faRocket, 
  faCog, 
  faUsers, 
  faFolder, 
  faCheck 
} from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
  const navigate = useNavigate();
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
    
    console.log('로그인 시도:', formData); // 디버깅 로그

    try {
      if (formData.username === 'admin' && formData.password === 'admin123') {
        console.log('로그인 성공, 대시보드로 이동'); // 디버깅 로그
        localStorage.setItem('superAdmin', JSON.stringify({
          username: formData.username,
          password: formData.password, // 비밀번호도 저장 (로그인 검증용)
          loginTime: new Date().toISOString()
        }));
        navigate('/dashboard');
      } else {
        console.log('로그인 실패: 잘못된 자격증명'); // 디버깅 로그
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('로그인 오류:', err); // 디버깅 로그
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#6875e0] flex items-center justify-center p-4 font-pretendard">
      {/* 상단 네비게이션 */}
      <div className="absolute top-6 left-6">
        <a href="/" className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Home page</span>
        </a>
      </div>

      {/* 브랜드 로고 */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
        
        <span className="text-2xl font-bold text-white"></span>
      </div>

      {/* 메인 로그인 카드 */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 환영 메시지 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome CMS System!</h1>
            <p className="text-gray-600">Welcome to the full management system</p>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* id입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin ID</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="admin id"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => {
                    const input = document.querySelector('input[type="password"]');
                    if (input.type === 'password') {
                      input.type = 'text';
                    } else {
                      input.type = 'password';
                    }
                  }}
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 옵션 행 */}
            

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!formData.username || !formData.password || loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>

          
            
          </form>

          {/* 계정 생성 링크 */}
          <div className="text-center mt-8">
           
          </div>
        </div>

        {/* 테스트 계정 정보 */}
        <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
          <div className="text-center">
            <p className="text-sm text-blue-800 font-medium mb-2">테스트 계정</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-blue-600">아이디:</span>
                <div className="font-mono font-bold text-blue-800 bg-white px-2 py-1 rounded border mt-1">admin</div>
              </div>
              <div>
                <span className="text-blue-600">비밀번호:</span>
                <div className="font-mono font-bold text-blue-800 bg-white px-2 py-1 rounded border mt-1">admin123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
