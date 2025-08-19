import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Header from '../components/Header';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faRocket, 
  faCheck, 
  faSpinner,
  faDashboard,
  faFolder,
  faUsers,
  faCog,
  faLightbulb,
  faCrown,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const sidebarItems = [
    { 
      id: 'dashboard', 
      label: '대시보드', 
      icon: <FontAwesomeIcon icon={faDashboard} />,
      onClick: () => navigate('/dashboard')
    },
    { 
      id: 'projects', 
      label: '프로젝트 관리', 
      icon: <FontAwesomeIcon icon={faFolder} />,
      onClick: () => navigate('/projects')
    },
    { 
      id: 'users', 
      label: '사용자 관리', 
      icon: <FontAwesomeIcon icon={faUsers} />,
      onClick: () => navigate('/users')
    },
    { 
      id: 'settings', 
      label: '설정', 
      icon: <FontAwesomeIcon icon={faCog} />,
      onClick: () => navigate('/settings')
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      {/* 헤더 */}
      <Header 
        title="🚀 프로젝트 생성"
        user={user}
        onLogout={() => navigate('/login')}
      />

      <div className="flex">
        {/* 사이드바 */}
       

        {/* 메인 콘텐츠 */}
        <main className="flex-1">
          <div className="p-8 max-w-[1400px] mx-auto">
            {/* 뒤로가기 버튼 */}
            <div className="mb-6">
              <Button
                variant="ghost"
                icon={faArrowLeft}
                onClick={() => navigate('/dashboard')}
                className="bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md transition-all duration-300 px-4 py-2 rounded-xl border border-gray-200"
              >
                대시보드로 돌아가기
              </Button>
            </div>

            {/* 진행 단계 표시 */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 ${
                    step >= 1 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    1
                  </div>
                  <div className={`w-20 h-2 rounded-full transition-all duration-500 ${
                    step >= 2 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : 'bg-gray-200'
                  }`}></div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 ${
                    step >= 2 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg scale-110' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    2
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <span className={`text-lg font-semibold transition-all duration-300 ${
                  step === 1 ? 'text-blue-600' : 'text-purple-600'
                }`}>
                  {step === 1 ? '📝 프로젝트 정보 입력' : '👑 관리자 계정 생성'}
                </span>
              </div>
            </div>

            {/* 프로젝트 생성 폼 */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <FontAwesomeIcon icon={faWandMagicSparkles} className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  새 프로젝트 생성
                </h2>
                <p className="text-gray-600 text-lg">
                  자동으로 완성된 홈페이지와 관리자 시스템을 구축합니다
                </p>
              </div>

              {step === 1 ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="프로젝트 이름(타이틀)"
                      placeholder="예: 회사 홈페이지"
                      value={formData.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      required
                    />
                    <Input
                      label="프로젝트 설명"
                      placeholder="프로젝트에 대한 간단한 설명"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                    />
                  </div>

                  {/* 자동 생성될 기능들 미리보기 */}
                  <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <FontAwesomeIcon icon={faLightbulb} className="h-6 w-6 text-yellow-500" />
                      <h4 className="text-xl font-semibold text-gray-800">자동으로 생성될 기능들</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                        <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-gray-700">게시판 3개 (공지/자유/질문)</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                        <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-gray-700">회원관리 시스템</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                        <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-gray-700">카테고리 관리</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                        <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-gray-700">기본 홈페이지 레이아웃</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleNext}
                      disabled={!formData.projectName || !formData.description}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-3 rounded-xl font-semibold text-white"
                    >
                      다음 단계
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="관리자 아이디"
                      placeholder="프로젝트 관리자 아이디"
                      value={formData.adminUsername}
                      onChange={(e) => handleInputChange('adminUsername', e.target.value)}
                      required
                    />
                    <Input
                      label="관리자 비밀번호"
                      type="password"
                      placeholder="프로젝트 관리자 비밀번호"
                      value={formData.adminPassword}
                      onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                      required
                    />
                    <Input
                      label="관리자 이메일"
                      type="email"
                      placeholder="프로젝트 관리자 이메일"
                      value={formData.adminEmail}
                      onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                      required
                    />
                  </div>

                  {/* 관리자 계정 안내 */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <FontAwesomeIcon icon={faCrown} className="h-6 w-6 text-purple-500" />
                      <h4 className="text-xl font-semibold text-gray-800">프로젝트 관리자 계정</h4>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      생성된 프로젝트의 독립적인 관리자 계정입니다. 
                      이 계정으로 해당 프로젝트의 모든 기능을 관리할 수 있습니다.
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 px-6 py-3 rounded-xl"
                    >
                      이전 단계
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      icon={creating ? faSpinner : faRocket}
                      onClick={handleNext}
                      loading={creating}
                      disabled={!formData.adminUsername || !formData.adminPassword || !formData.adminEmail}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-3 rounded-xl font-semibold text-white"
                    >
                      {creating ? '프로젝트 생성 중...' : '프로젝트 생성하기'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateProjectPage;
