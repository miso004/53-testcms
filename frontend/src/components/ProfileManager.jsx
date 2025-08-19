import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faKey, 
  faSave, 
  faTimes,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';

const ProfileManager = ({ isOpen, onClose, currentUser, projectId, onUpdateProfile }) => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (currentUser && isOpen) {
      setProfile({
        username: currentUser.username || '',
        email: currentUser.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [currentUser, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 프로필 정보 업데이트
      if (profile.username !== currentUser.username || profile.email !== currentUser.email) {
        // 사용자 정보 업데이트
        const updatedUser = {
          ...currentUser,
          username: profile.username,
          email: profile.email
        };

        // localStorage 업데이트
        if (currentUser.isSuperAdmin) {
          localStorage.setItem('superAdmin', JSON.stringify(updatedUser));
        } else {
          localStorage.setItem(`project_${projectId}_user`, JSON.stringify(updatedUser));
          
          // 프로젝트 사용자 목록도 업데이트
          const existingUsers = JSON.parse(localStorage.getItem(`project_${projectId}_users`) || '[]');
          const updatedUsers = existingUsers.map(user => 
            user.id === currentUser.id ? updatedUser : user
          );
          localStorage.setItem(`project_${projectId}_users`, JSON.stringify(updatedUsers));
        }

        onUpdateProfile(updatedUser);
        setMessage({ type: 'success', text: '프로필 정보가 업데이트되었습니다.' });
      }

      // 비밀번호 변경
      if (profile.newPassword && profile.currentPassword) {
        if (profile.newPassword !== profile.confirmPassword) {
          setMessage({ type: 'error', text: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.' });
          setIsLoading(false);
          return;
        }

        if (profile.newPassword.length < 6) {
          setMessage({ type: 'error', text: '새 비밀번호는 최소 6자 이상이어야 합니다.' });
          setIsLoading(false);
          return;
        }

        // 현재 비밀번호 확인 (간단한 검증)
        if (currentUser.password !== profile.currentPassword) {
          setMessage({ type: 'error', text: '현재 비밀번호가 올바르지 않습니다.' });
          setIsLoading(false);
          return;
        }

        // 비밀번호 업데이트
        const updatedUser = {
          ...currentUser,
          password: profile.newPassword
        };

        if (currentUser.isSuperAdmin) {
          localStorage.setItem('superAdmin', JSON.stringify(updatedUser));
        } else {
          localStorage.setItem(`project_${projectId}_user`, JSON.stringify(updatedUser));
          
          const existingUsers = JSON.parse(localStorage.getItem(`project_${projectId}_users`) || '[]');
          const updatedUsers = existingUsers.map(user => 
            user.id === currentUser.id ? updatedUser : user
          );
          localStorage.setItem(`project_${projectId}_users`, JSON.stringify(updatedUsers));
        }

        onUpdateProfile(updatedUser);
        setMessage({ type: 'success', text: '비밀번호가 성공적으로 변경되었습니다.' });
        
        // 비밀번호 필드 초기화
        setProfile(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }

      // 성공 메시지 표시 후 3초 뒤 모달 닫기
      if (message.type === 'success') {
        setTimeout(() => {
          onClose();
        }, 2000);
      }

    } catch (error) {
      setMessage({ type: 'error', text: '프로필 업데이트 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setProfile({
      username: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage({ type: '', text: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">프로필 관리</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          </button>
        </div>

        {/* 메시지 */}
        {message.text && (
          <div className={`mx-6 mt-4 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 사용자명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              사용자명
            </label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* 비밀번호 변경 섹션 */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">비밀번호 변경</h3>
            
            {/* 현재 비밀번호 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faKey} className="mr-2" />
                현재 비밀번호
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={profile.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="비밀번호 변경 시에만 입력"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* 새 비밀번호 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새 비밀번호
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={profile.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="6자 이상"
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* 새 비밀번호 확인 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새 비밀번호 확인
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={profile.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="새 비밀번호 재입력"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  저장
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600 transition-colors flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileManager;

