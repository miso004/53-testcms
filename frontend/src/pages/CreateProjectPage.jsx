import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faRocket, 
  faCheck, 
  faSpinner,
  faLightbulb,
  faCrown,
  faWandMagicSparkles,
  faStar,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    adminUsername: '',
    adminPassword: '',
    adminEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const superAdmin = localStorage.getItem('superAdmin');
    if (!superAdmin) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(superAdmin));
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (step === 1 && formData.projectName && formData.description) {
      setStep(2);
    } else if (step === 2 && formData.adminUsername && formData.adminPassword && formData.adminEmail) {
      handleCreateProject();
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleCreateProject = async () => {
    setCreating(true);
    
    try {
      // 가상 프로젝트 생성 프로세스 (실제로는 API 호출)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 프로젝트 정보 생성
      const newProject = {
        id: `project_${Date.now()}`,
        name: formData.projectName,
        description: formData.description,
        adminUsername: formData.adminUsername,
        adminPassword: formData.adminPassword,
        adminEmail: formData.adminEmail,
        createdAt: new Date().toISOString(),
        features: [
          '게시판 3개 (공지/자유/질문)',
          '회원관리 시스템',
          '카테고리 관리',
          '기본 홈페이지 레이아웃'
        ]
      };
      
      // 기존 프로젝트 목록에 추가
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      existingProjects.push(newProject);
      localStorage.setItem('projects', JSON.stringify(existingProjects));
      
      // 프로젝트 관리자 계정을 프로젝트별 사용자 목록에 추가
      const projectAdminUser = {
        id: Date.now(),
        username: formData.adminUsername,
        password: formData.adminPassword,
        email: formData.adminEmail,
        role: 'project_admin',
        projectId: newProject.id,
        createdAt: newProject.createdAt
      };
      
      // 프로젝트별 사용자 목록에 관리자 추가
      localStorage.setItem(`project_${newProject.id}_users`, JSON.stringify([projectAdminUser]));
      
      // 기본 카테고리 생성
      const defaultCategories = [
        {
          id: 1,
          name: '소개',
          boardType: 'intro',
          type: 'page',
          content: '<h1>프로젝트 소개</h1><p>이곳에 프로젝트에 대한 소개를 작성해주세요.</p>',
          order: 1
        },
        {
          id: 2,
          name: '일반',
          boardType: 'general',
          type: 'page',
          content: '<h1>일반 정보</h1><p>프로젝트의 일반적인 정보를 작성해주세요.</p>',
          order: 2
        },
        {
          id: 3,
          name: '게시판',
          boardType: 'board',
          type: 'board',
          content: '',
          order: 3
        },
        {
          id: 4,
          name: '갤러리',
          boardType: 'gallery',
          type: 'board',
          content: '',
          order: 4
        }
      ];
      
      // 프로젝트별 카테고리 저장
      localStorage.setItem(`project_${newProject.id}_categories`, JSON.stringify(defaultCategories));
      
      // 기본 게시글 데이터 생성
      const defaultPosts = {
        board: [
          {
            id: 1,
            title: '게시판이 오픈되었습니다!',
            author: '관리자',
            authorId: 'admin',
            date: new Date().toLocaleDateString('ko-KR'),
            views: 0,
            content: '일반 게시판입니다. 자유롭게 글을 작성해보세요.',
            boardType: 'board',
            category: '일반'
          }
        ],
        gallery: [
          {
            id: 1,
            title: '갤러리가 오픈되었습니다!',
            author: '관리자',
            authorId: 'admin',
            date: new Date().toLocaleDateString('ko-KR'),
            views: 0,
            content: '갤러리 게시판입니다. 이미지와 함께 글을 작성해보세요.',
            boardType: 'gallery',
            category: '갤러리'
          }
        ]
      };
      
      // 프로젝트별 게시글 저장
      localStorage.setItem(`project_${newProject.id}_posts`, JSON.stringify(defaultPosts));
      
      // 프로젝트 홈페이지로 이동
      navigate(`/project/${newProject.id}`, { 
        state: { 
          message: `프로젝트 "${formData.projectName}"이 성공적으로 생성되었습니다!` 
        } 
      });
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
    } finally {
      setCreating(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-pretendard">
      {/* 상단 헤더 */}
      {/* <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faStar} className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-800">Project CMS</span>
          </div>
          
        
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">안녕하세요, {user.username}님</span>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div> */}

      {/* 메인 콘텐츠 */}
      <div className="p-8 max-w-[1200px] mx-auto">
        {/* 뒤로가기 버튼 */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-300 rounded-2xl border border-gray-200/50 hover:border-gray-300"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            <span className="font-medium">대시보드로 돌아가기</span>
          </button>
        </div>

        {/* 진행 단계 표시 */}
        <div className="mb-10">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-500 ${
                step >= 1 
                  ? 'bg-blue-500 text-white shadow-xl scale-105' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                1
              </div>
              <div className={`w-24 h-2 rounded-full transition-all duration-500 ${
                step >= 2 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                  : 'bg-gray-200'
              }`}></div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-500 ${
                step >= 2 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl scale-105' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                2
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <span className={`text-xl font-semibold transition-all duration-300 ${
              step === 1 ? 'text-blue-600' : 'text-purple-600'
            }`}>
              {step === 1 ? '📝 프로젝트 정보 입력' : '👑 관리자 계정 생성'}
            </span>
          </div>
        </div>

        {/* 프로젝트 생성 폼 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-10">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-3">
              새 프로젝트 생성
            </h2>
            <p className="text-gray-600 text-xl leading-relaxed">
              자동으로 완성된 홈페이지와 관리자 시스템을 구축합니다
            </p>
          </div>

          {step === 1 ? (
            <div className="space-y-10">
              {/* 프로젝트 정보 입력 */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">프로젝트 기본 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-gray-700">프로젝트 이름</label>
                    <input
                      type="text"
                      placeholder="예: 회사 홈페이지"
                      value={formData.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-gray-700">프로젝트 설명</label>
                    <textarea
                      placeholder="프로젝트에 대한 간단한 설명"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows="3"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 자동 생성될 기능들 미리보기 */}
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-8 rounded-3xl border border-blue-100/50">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faLightbulb} className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800">자동으로 생성될 기능들</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    '게시판 3개 (공지/자유/질문)',
                    '회원관리 시스템',
                    '카테고리 관리',
                    '기본 홈페이지 레이아웃'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-white/70 rounded-2xl border border-white/50">
                      <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-700 text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNext}
                  disabled={!formData.projectName || !formData.description}
                  className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    formData.projectName && formData.description
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover: bg-blue-500 text-white shadow-xl hover:shadow-2xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  다음 단계
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {/* 관리자 계정 입력 */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">관리자 계정 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-gray-700">관리자 아이디</label>
                    <input
                      type="text"
                      placeholder="프로젝트 관리자 아이디"
                      value={formData.adminUsername}
                      onChange={(e) => handleInputChange('adminUsername', e.target.value)}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 text-lg"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-gray-700">관리자 비밀번호</label>
                    <input
                      type="password"
                      placeholder="프로젝트 관리자 비밀번호"
                      value={formData.adminPassword}
                      onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 text-lg"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-gray-700">관리자 이메일</label>
                    <input
                      type="email"
                      placeholder="프로젝트 관리자 이메일"
                      value={formData.adminEmail}
                      onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 text-lg"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 관리자 계정 안내 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-3xl border border-purple-100/50">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faCrown} className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800">프로젝트 관리자 계정</h4>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  생성된 프로젝트의 독립적인 관리자 계정입니다. 
                  이 계정으로 해당 프로젝트의 모든 기능을 관리할 수 있습니다.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={handleBack}
                  className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 rounded-2xl font-bold text-lg text-gray-700"
                >
                  이전 단계
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.adminUsername || !formData.adminPassword || !formData.adminEmail || creating}
                  className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    formData.adminUsername && formData.adminPassword && formData.adminEmail && !creating
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {creating ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>프로젝트 생성 중...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faRocket} className="h-5 w-5" />
                      <span>프로젝트 생성하기</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
