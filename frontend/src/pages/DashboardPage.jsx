import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faFolder, 
  faUsers, 
  faChartLine, 
  faRocket,
  faSignOutAlt,
  faDashboard,
  faCog,
  faExclamationTriangle,
  faArrowUp,
  faClock,
  faCheckCircle,
  faStar,
  faTimes,
  faCalendar,
  faUser,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { isSuperAdmin, getCurrentUser } from '../utils/permissions';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalUsers: 0,
    recentActivity: []
  });

  // 프로젝트 목록 상태 추가
  const [projects, setProjects] = useState([]);

  // 성공 메시지 상태 추가
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // 슈퍼 관리자 권한 확인
    if (!isSuperAdmin()) {
      navigate('/login');
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);
    loadStats();
    loadProjects();

    // URL state에서 성공 메시지 확인
    const location = window.location;
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);
      // URL state 초기화
      window.history.replaceState({}, document.title);
    }
  }, [navigate]);

  const loadStats = () => {
    // 가상 데이터 (실제로는 API에서 가져올 예정)
    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    // 샘플 프로젝트가 없으면 생성
    if (projects.length === 0) {
      const sampleProjects = [
        {
          id: 'sample_project_1',
          name: '회사 홈페이지',
          description: '회사 소개와 서비스를 보여주는 공식 홈페이지입니다.',
          adminUsername: 'company_admin',
          adminPassword: 'company123',
          adminEmail: 'admin@company.com',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
          features: ['게시판 3개', '회원관리', '카테고리 관리', '홈페이지 레이아웃']
        },
        {
          id: 'sample_project_2',
          name: '쇼핑몰',
          description: '온라인 쇼핑을 위한 전자상거래 플랫폼입니다.',
          adminUsername: 'shop_admin',
          adminPassword: 'shop123',
          adminEmail: 'admin@shop.com',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
          features: ['게시판 3개', '회원관리', '카테고리 관리', '홈페이지 레이아웃']
        },
        {
          id: 'sample_project_3',
          name: '블로그',
          description: '개인적인 생각과 경험을 공유하는 블로그입니다.',
          adminUsername: 'blog_admin',
          adminPassword: 'blog123',
          adminEmail: 'admin@blog.com',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 전
          features: ['게시판 3개', '회원관리', '카테고리 관리', '홈페이지 레이아웃']
        }
      ];
      
      localStorage.setItem('projects', JSON.stringify(sampleProjects));
      projects = sampleProjects;
    }
    
    setStats({
      totalProjects: projects.length,
      activeProjects: projects.length,
      totalUsers: 156,
      recentActivity: [
        { id: 1, action: '새 프로젝트 생성', project: '회사 홈페이지', time: '2시간 전', type: 'success' },
        { id: 2, action: '사용자 등록', user: '김철수', time: '4시간 전', type: 'info' },
        { id: 3, action: '프로젝트 업데이트', project: '쇼핑몰', time: '1일 전', type: 'warning' },
        { id: 4, action: '새 프로젝트 생성', project: '블로그', time: '2일 전', type: 'success' }
      ]
    });
  };

  // 프로젝트 목록 로드
  const loadProjects = () => {
    // localStorage에서 프로젝트 목록 로드
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
      } catch (error) {
        console.error('프로젝트 데이터 파싱 오류:', error);
        loadSampleProjects();
      }
    } else {
      loadSampleProjects();
    }
  };

  // 샘플 프로젝트 데이터 로드 (기본값)
  const loadSampleProjects = () => {
    const sampleProjects = [
      { 
        id: 'company-website', 
        name: '회사 홈페이지', 
        description: '기업 브랜딩을 위한 공식 홈페이지', 
        adminUsername: 'company_admin',
        adminPassword: 'company123',
        status: 'active', 
        createdAt: '2024-01-15', 
        users: 45 
      },
      { 
        id: 'shopping-mall', 
        name: '쇼핑몰', 
        description: '온라인 쇼핑몰 플랫폼', 
        adminUsername: 'shop_admin',
        adminPassword: 'shop123',
        status: 'active', 
        createdAt: '2024-01-10', 
        users: 89 
      },
      { 
        id: 'blog-platform', 
        name: '블로그 플랫폼', 
        description: '개인 및 팀 블로그 서비스', 
        adminUsername: 'blog_admin',
        adminPassword: 'blog123',
        status: 'active', 
        createdAt: '2024-01-05', 
        users: 23 
      },
      { 
        id: 'portfolio-site', 
        name: '포트폴리오 사이트', 
        description: '디자이너 포트폴리오 전시', 
        adminUsername: 'portfolio_admin',
        adminPassword: 'portfolio123',
        status: 'draft', 
        createdAt: '2024-01-12', 
        users: 12 
      }
    ];
    setProjects(sampleProjects);
  };

  const handleLogout = () => {
    localStorage.removeItem('superAdmin');
    navigate('/login');
  };

  const handleCreateProject = () => {
    navigate('/create-project');
  };

  const handleViewProject = (projectId) => {
    window.open(`/project/${projectId}`, '_blank');
  };

  // 프로젝트 삭제 함수 추가
  const handleDeleteProject = (projectId) => {
    if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        // 프로젝트 관련 데이터 모두 삭제
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const updatedProjects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
        
        // 프로젝트별 데이터 삭제
        localStorage.removeItem(`project_${projectId}_posts`);
        localStorage.removeItem(`project_${projectId}_users`);
        localStorage.removeItem(`project_${projectId}_categories`);
        localStorage.removeItem(`project_${projectId}_user`);
        
        setProjects(updatedProjects);
        loadStats();
        alert('프로젝트가 삭제되었습니다.');
      } catch (error) {
        console.error('프로젝트 삭제 오류:', error);
        alert('프로젝트 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 프로젝트 클릭 핸들러 추가
  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
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

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success': return <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 text-success" />;
      case 'info': return <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-info" />;
      case 'warning': return <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 text-warning" />;
      default: return <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-base-content/60" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* 성공 메시지 알림 */}
        {successMessage && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800">프로젝트 생성 완료!</h3>
                  <p className="text-green-700">{successMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-green-400 hover:text-green-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* 환영 메시지 */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <FontAwesomeIcon icon={faStar} className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  안녕하세요, {user.username}님! 
                </h1>
                <p className="text-lg text-gray-600 ">
                  오늘도 <span className="font-semibold text-blue-600">완벽한 웹사이트</span>를 만들어보세요
                </p>
              </div>
            </div>
            
            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-2 py-1 mt-4 bg-white border border-gray-300 text-gray-600 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              <span>로그아웃</span>
            </button>
          </div>
        </div>

        {/* 프로젝트 생성 버튼 */}
        <div className="mb-10">
          <div className="bg-blue-600 rounded-2xl p-10 text-white border-0 shadow-2xl relative overflow-hidden">
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <FontAwesomeIcon icon={faRocket} className="h-12 w-12 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-4">
                새로운 프로젝트를 만들어보세요!
              </h2>
              <p className="text-white/90 text-xl mb-10 leading-relaxed max-w-3xl mx-auto">
                버튼을 클릭하면 자동으로 완성된 홈페이지와<br />
                관리자 시스템이 구축됩니다
              </p>
              <button
                onClick={handleCreateProject}
                className="bg-white text-blue-600 border-white hover:bg-white/90 hover:text-blue-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 px-12 py-4 rounded-2xl font-bold text-lg flex items-center mx-auto space-x-3"
              >
                <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                <span>프로젝트 만들기</span>
              </button>
            </div>
          </div>
        </div>

        {/* 기존 프로젝트 목록 */}
        <Card title="기존 프로젝트" subtitle="생성된 프로젝트들을 확인하고 관리하세요" className="shadow-lg mb-10 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(() => {
              const projects = JSON.parse(localStorage.getItem('projects') || '[]');
              if (projects.length === 0) {
                return (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <FontAwesomeIcon icon={faFolder} className="h-12 w-12 text-gray-300 mb-4" />
                    <p>아직 생성된 프로젝트가 없습니다.</p>
                    <p className="text-sm">위의 "프로젝트 만들기" 버튼을 클릭하여 첫 번째 프로젝트를 생성해보세요!</p>
                  </div>
                );
              }
              
              return projects.map((project, index) => (
                <div 
                  key={project.id}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 mb-3">{project.description}</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div>생성일: {new Date(project.createdAt).toLocaleDateString()}</div>
                        <div>관리자: {project.adminUsername}</div>
                      </div>
                    </div>
                    <div className="flex flex-row gap-2 mt-4 ">
                      <button
                        onClick={() => handleViewProject(project.id)}
                        className="w-2/3 flex items-center h-10 justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FontAwesomeIcon icon={faRocket} className="h-4 w-4" />
                        <span>프로젝트 보기</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="w-1/3 flex items-center h-10 justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                        <span>삭제</span>
                      </button>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </Card>

        
      </div>
      {/* 푸터 */}
      <footer className="mt-14 pt-12 pb-8 border-t border-gray-300 bg-gray-300 text-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              {/* 왼쪽: 브랜드 정보 */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Project CMS</h3>
                  <p className="text-sm text-gray-600">완벽한 웹사이트 구축 시스템</p>
                </div>
              </div>

              {/* 가운데: 링크 */}
              <div className="flex space-x-8 text-sm text-gray-600">
                <a href="#" className="hover:text-blue-600 transition-colors duration-200">이용약관</a>
                <a href="#" className="hover:text-blue-600 transition-colors duration-200">개인정보처리방침</a>
                <a href="#" className="hover:text-blue-600 transition-colors duration-200">고객지원</a>
                <a href="#" className="hover:text-blue-600 transition-colors duration-200">문의하기</a>
              </div>

              {/* 오른쪽: 카피라이트 */}
              <div className="text-sm text-gray-600 text-center md:text-right">
                <p>&copy; 2025 Project CMS. All rights reserved.</p>
                <p className="mt-1">Made with ❤️ for better web experiences</p>
              </div>
            </div>
            
            {/* 하단 구분선 */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <p className="text-xs text-gray-600">
                  현재 버전: v1.0.0 | 최종 업데이트: {new Date().toLocaleDateString('ko-KR')}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <span>React 19.1.1</span>
                  <span>•</span>
                  <span>Vite 7.1.2</span>
                  <span>•</span>
                  <span>Tailwind CSS 3.4.17</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
};

export default DashboardPage;
