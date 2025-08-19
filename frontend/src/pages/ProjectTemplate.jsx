import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faNewspaper, 
  faComments, 
  faQuestionCircle, 
  faUser, 
  faSignInAlt, 
  faUserPlus,
  faSearch,
  faCog,
  faRocket
} from '@fortawesome/free-solid-svg-icons';
import UserAuth from '../components/UserAuth';
import PostEditor from '../components/PostEditor';

const ProjectTemplate = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [posts, setPosts] = useState({
    notice: [
      { id: 1, title: '공지사항 게시판이 오픈되었습니다!', author: '관리자', date: '2024-01-15', views: 156 },
      { id: 2, title: '사이트 이용 안내', author: '관리자', date: '2024-01-14', views: 89 },
      { id: 3, title: '개인정보 처리방침', author: '관리자', date: '2024-01-13', views: 67 }
    ],
    free: [
      { id: 1, title: '안녕하세요! 처음 방문했습니다', author: '방문자1', date: '2024-01-15', views: 23 },
      { id: 2, title: '오늘 날씨가 정말 좋네요', author: '방문자2', date: '2024-01-14', views: 18 },
      { id: 3, title: '맛집 추천 부탁드려요', author: '방문자3', date: '2024-01-13', views: 45 }
    ],
    qna: [
      { id: 1, title: '회원가입은 어떻게 하나요?', author: '질문자1', date: '2024-01-15', views: 34 },
      { id: 2, title: '게시글 작성 방법', author: '질문자2', date: '2024-01-14', views: 28 },
      { id: 3, title: '비밀번호 변경 문의', author: '질문자3', date: '2024-01-13', views: 19 }
    ]
  });

  // 글쓰기 모달 상태 추가
  const [postEditor, setPostEditor] = useState({ isOpen: false, boardType: null, post: null });

  // 프로젝트 정보 (실제로는 API에서 가져올 데이터)
  const projectInfo = {
    id: projectId,
    name: '샘플 프로젝트',
    description: '자동으로 생성된 홈페이지입니다.',
    admin: 'project_admin',
    createdAt: '2024-01-15'
  };

  useEffect(() => {
    // 슈퍼 관리자 상태 확인
    const superAdmin = localStorage.getItem('superAdmin');
    if (superAdmin) {
      try {
        const adminData = JSON.parse(superAdmin);
        setCurrentUser({
          ...adminData,
          role: 'super_admin',
          isSuperAdmin: true
        });
        return; // 슈퍼 관리자인 경우 프로젝트별 사용자 로그인 확인하지 않음
      } catch (error) {
        console.error('슈퍼 관리자 정보 파싱 오류:', error);
      }
    }

    // 프로젝트별 사용자 로그인 상태 확인
    const savedUser = localStorage.getItem(`project_${projectId}_user`);
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
      }
    }

    // 샘플 사용자 데이터 생성 (첫 방문 시)
    const existingUsers = localStorage.getItem(`project_${projectId}_users`);
    if (!existingUsers) {
      const sampleUsers = [
        {
          id: 1,
          username: 'test_user',
          password: 'test123',
          email: 'test@example.com',
          projectId: projectId,
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(`project_${projectId}_users`, JSON.stringify(sampleUsers));
    }

    // 게시글 데이터 로드
    loadPosts();
  }, [projectId]);

  // 게시글 데이터 로드 함수
  const loadPosts = () => {
    const savedPosts = localStorage.getItem(`project_${projectId}_posts`);
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
      } catch (error) {
        console.error('게시글 데이터 파싱 오류:', error);
        loadSamplePosts();
      }
    } else {
      loadSamplePosts();
    }
  };

  // 샘플 게시글 데이터 로드 (첫 방문 시)
  const loadSamplePosts = () => {
    const samplePosts = {
      notice: [
        { id: 1, title: '공지사항 게시판이 오픈되었습니다!', author: '관리자', date: '2024-01-15', views: 156, content: '환영합니다!' },
        { id: 2, title: '사이트 이용 안내', author: '관리자', date: '2024-01-14', views: 89, content: '이용 방법을 확인하세요.' },
        { id: 3, title: '개인정보 처리방침', author: '관리자', date: '2024-01-13', views: 67, content: '개인정보 보호 정책입니다.' }
      ],
      free: [
        { id: 1, title: '안녕하세요! 처음 방문했습니다', author: '방문자1', date: '2024-01-15', views: 23, content: '반갑습니다!' },
        { id: 2, title: '오늘 날씨가 정말 좋네요', author: '방문자2', date: '2024-01-14', views: 18, content: '맑은 하늘이네요.' },
        { id: 3, title: '맛집 추천 부탁드려요', author: '방문자3', date: '2024-01-13', views: 45, content: '좋은 맛집 알려주세요.' }
      ],
      qna: [
        { id: 1, title: '회원가입은 어떻게 하나요?', author: '질문자1', date: '2024-01-15', views: 34, content: '회원가입 방법을 알려주세요.' },
        { id: 2, title: '게시글 작성 방법', author: '질문자2', date: '2024-01-14', views: 28, content: '게시글을 어떻게 작성하나요?' },
        { id: 3, title: '비밀번호 변경 문의', author: '질문자3', date: '2024-01-13', views: 19, content: '비밀번호를 변경하고 싶습니다.' }
      ]
    };
    setPosts(samplePosts);
    localStorage.setItem(`project_${projectId}_posts`, JSON.stringify(samplePosts));
  };

  const handleLogin = () => {
    setAuthModal({ isOpen: true, mode: 'login' });
  };

  const handleSignup = () => {
    setAuthModal({ isOpen: true, mode: 'signup' });
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    
    // 관리자인 경우 관리자 대시보드로 이동
    if (user.role === 'project_admin') {
      navigate(`/project/${projectId}/admin`);
    }
  };

  const handleAuthClose = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const switchAuthMode = (mode) => {
    setAuthModal({ isOpen: true, mode });
  };

  // 글쓰기 모달 핸들러 추가
  const handleOpenPostEditor = (boardType, post = null) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }
    setPostEditor({ isOpen: true, boardType, post });
  };

  const handleClosePostEditor = () => {
    setPostEditor({ isOpen: false, boardType: null, post: null });
  };

  const handlePostSave = (newPost) => {
    // 게시글 저장 후 목록 새로고침
    const updatedPosts = { ...posts };
    if (!updatedPosts[newPost.boardType]) {
      updatedPosts[newPost.boardType] = [];
    }
    
    if (newPost.id && updatedPosts[newPost.boardType].some(p => p.id === newPost.id)) {
      // 편집 모드: 기존 게시글 업데이트
      updatedPosts[newPost.boardType] = updatedPosts[newPost.boardType].map(p => 
        p.id === newPost.id ? newPost : p
      );
    } else {
      // 새 글 작성 모드: 새 게시글 추가
      updatedPosts[newPost.boardType].unshift(newPost);
    }
    
    setPosts(updatedPosts);
    localStorage.setItem(`project_${projectId}_posts`, JSON.stringify(updatedPosts));
    
    // 게시글 목록 새로고침
    loadPosts();
  };

  const renderHomeTab = () => (
    <div className="space-y-8">
      {/* 주요 기능 소개 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <FontAwesomeIcon icon={faNewspaper} className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">공지사항</h3>
          <p className="text-gray-600 text-center">중요한 소식과 업데이트를 확인하세요</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <FontAwesomeIcon icon={faComments} className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">자유게시판</h3>
          <p className="text-gray-600 text-center">자유롭게 의견을 나누고 소통하세요</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <FontAwesomeIcon icon={faQuestionCircle} className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">질문게시판</h3>
          <p className="text-gray-600 text-center">궁금한 점을 물어보고 답변을 받아보세요</p>
        </div>
      </div>

      {/* 최근 게시글 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">최근 게시글</h2>
        <div className="space-y-4">
          {posts.notice.slice(0, 3).map(post => (
            <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">공지</span>
                <span className="font-medium text-gray-800">{post.title}</span>
              </div>
              <div className="text-sm text-gray-500">
                {post.date} | 조회 {post.views}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBoardTab = (boardType) => {
    const boardData = posts[boardType];
    const boardNames = {
      notice: '공지사항',
      free: '자유게시판',
      qna: '질문게시판'
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">{boardNames[boardType]}</h2>
          {currentUser && (
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
              글쓰기
            </button>
          )}
        </div>

        {/* 검색바 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="게시글을 검색하세요..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
              검색
            </button>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 p-4 font-semibold text-gray-700">
            <div className="col-span-1">번호</div>
            <div className="col-span-6">제목</div>
            <div className="col-span-2">작성자</div>
            <div className="col-span-2">작성일</div>
            <div className="col-span-1">조회</div>
          </div>
          
          {boardData.map((post, index) => (
            <div 
              key={post.id} 
              className="grid grid-cols-12 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleOpenPostEditor(boardType, post)}
            >
              <div className="col-span-1 text-gray-500">{boardData.length - index}</div>
              <div className="col-span-5 font-medium text-gray-800">{post.title}</div>
              <div className="col-span-2 text-gray-600">{post.author}</div>
              <div className="col-span-2 text-gray-500">{post.date}</div>
              <div className="col-span-1 text-gray-500">{post.views}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 슬라이더 상태
  const [slideIndex, setSlideIndex] = useState(0);

  // 자동 슬라이드 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev === 2 ? 0 : prev + 1));
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    // 슈퍼 관리자인 경우 슈퍼 관리자 로그아웃
    if (currentUser?.isSuperAdmin) {
      localStorage.removeItem('superAdmin');
      navigate('/dashboard');
      return;
    }
    
    // 프로젝트별 사용자인 경우 프로젝트별 로그아웃
    setCurrentUser(null);
    localStorage.removeItem(`project_${projectId}_user`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-lg py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 상단 로고 및 프로젝트명 */}
          <div className="flex items-center justify-between h-16">
            {/* 왼쪽: 로고 및 프로젝트명 */}
            <div className="flex items-center space-x-3">
              
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{projectInfo.name}</h1>
                <p className="text-sm text-gray-500">프로젝트 홈페이지</p>
              </div>
            </div>

            {/* 가운데: 네비게이션 메뉴 */}
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('home')}
                className={`py-4 px-2 border-b-2 font-bold text-xl transition-colors ${
                  activeTab === 'home'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'border-b-2 border-transparent text-gray-700 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                홈
              </button>
              <div className="w-px bg-gray-200 h-8 self-center"></div>
              <button
                onClick={() => setActiveTab('notice')}
                className={`py-4 px-2 border-b-2 font-bold text-xl transition-colors ${
                  activeTab === 'notice'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'border-b-2 border-transparent text-gray-700 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                공지사항
              </button>
              <div className="w-px bg-gray-200 h-8 self-center"></div>
              <button
                onClick={() => setActiveTab('free')}
                className={`py-4 px-2 border-b-2 font-bold text-xl transition-colors ${
                  activeTab === 'free'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'border-b-2 border-transparent text-gray-700 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                자유게시판
              </button>
              <div className="w-px bg-gray-200 h-8 self-center"></div>
              <button
                onClick={() => setActiveTab('qna')}
                className={`py-4 px-2 border-b-2 font-bold text-xl transition-colors ${
                  activeTab === 'qna'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'border-b-2 border-transparent text-gray-700 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                질문게시판
              </button>
              {/* 관리자 메뉴 */}
              {currentUser?.role === 'project_admin' && (
                <>
                  <div className="w-px bg-gray-200 h-8 self-center"></div>
                  <button
                    onClick={() => navigate(`/project/${projectId}/admin`)}
                    className="py-4 px-2 border-b-2 font-medium text-sm border-transparent text-purple-600 hover:text-purple-700 hover:border-purple-300 transition-colors"
                  >
                    관리자 메뉴
                  </button>
                </>
              )}
            </nav>

            {/* 오른쪽: 사용자 메뉴 및 로그인 */}
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">안녕하세요, {currentUser.username}님!</span>
                  
                  {/* 슈퍼 관리자 또는 프로젝트 관리자인 경우 관리자 아이콘 표시 */}
                  {(currentUser?.isSuperAdmin || currentUser?.role === 'project_admin') && (
                    <>
                      <button
                        onClick={() => navigate(`/project/${projectId}/admin`)}
                        className="text-gray-400 p-3 rounded-xl hover:text-purple-500 transition-colors"
                        title="프로젝트 관리"
                      >
                        <FontAwesomeIcon icon={faCog} className="h-5 w-5" />
                      </button>
                      
                      {/* 프로젝트 관리자인 경우에만 프로젝트 관리자 대시보드 버튼 표시 */}
                      {currentUser?.role === 'project_admin' && !currentUser?.isSuperAdmin && (
                        <button
                          onClick={() => navigate(`/project/${projectId}/admin`)}
                          className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors text-sm"
                        >
                          관리자 대시보드
                        </button>
                      )}
                      
                      {/* 슈퍼 관리자인 경우 슈퍼 관리자 대시보드 버튼 표시 */}
                      {currentUser?.isSuperAdmin && (
                        <button
                          onClick={() => navigate('/dashboard')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm"
                        >
                          슈퍼 관리자 대시보드
                        </button>
                      )}
                    </>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors text-sm"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                  className=" text-gray-400 p-3 rounded-xl hover:text-blue-500 transition-colors"
                  title="로그인"
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 환영 메시지 섹션 - 전체 스크린 너비 */}
      {activeTab === 'home' && (
        <div className="w-full">
          <div className="relative overflow-hidden shadow-2xl">
            {/* 슬라이더 컨테이너 */}
            <div className="relative w-full h-[600px]">
              {/* 슬라이드 1 */}
              <div 
                className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat flex items-center justify-center transition-all duration-[5000ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  slideIndex === 0 ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-full scale-105'
                }`}
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70"></div>
                <div className={`relative z-10 text-center text-white px-8 transition-all duration-[5000ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  slideIndex === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  <h1 className="text-6xl font-bold mb-6 drop-shadow-2xl leading-tight">
                    현재 샘플 프로젝트에 오신 것을 환영합니다
                  </h1>
                  <p className="text-2xl opacity-95 drop-shadow-lg max-w-4xl mx-auto leading-relaxed">
                    프로젝트를 시작하고 팀과 함께 협업해보세요
                  </p>
                </div>
              </div>

              {/* 슬라이드 2 */}
              <div 
                className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat flex items-center justify-center transition-all duration-[5000ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  slideIndex === 1 ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-full scale-105'
                }`}
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-teal-900/70"></div>
                <div className={`relative z-10 text-center text-white px-8 transition-all duration-[5000ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  slideIndex === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  <h1 className="text-6xl font-bold mb-6 drop-shadow-2xl leading-tight">
                    효율적인 프로젝트 관리
                  </h1>
                  <p className="text-2xl opacity-95 drop-shadow-lg max-w-4xl mx-auto leading-relaxed">
                    체계적인 업무 프로세스로 성공적인 결과를 만들어보세요
                  </p>
                </div>
              </div>

              {/* 슬라이드 3 */}
              <div 
                className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat flex items-center justify-center transition-all duration-[5000ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  slideIndex === 2 ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-full scale-105'
                }`}
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-pink-900/70"></div>
                <div className={`relative z-10 text-center text-white px-8 transition-all duration-[5000ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  slideIndex === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  <h1 className="text-6xl font-bold mb-6 drop-shadow-2xl leading-tight">
                    혁신적인 아이디어 공유
                  </h1>
                  <p className="text-2xl opacity-95 drop-shadow-lg max-w-4xl mx-auto leading-relaxed">
                    창의적인 생각을 나누고 함께 성장하는 팀을 만들어보세요
                  </p>
                </div>
              </div>

              {/* 슬라이드 인디케이터 */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => setSlideIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      slideIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>

              {/* 1400px 컨테이너로 제한된 이전/다음 버튼 */}
              <div className="max-w-[1400px] mx-auto relative h-full">
                <button
                  onClick={() => setSlideIndex((prev) => (prev === 0 ? 2 : prev - 1))}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setSlideIndex((prev) => (prev === 2 ? 0 : prev + 1))}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'home' && renderHomeTab()}
          {activeTab === 'notice' && renderBoardTab('notice')}
          {activeTab === 'free' && renderBoardTab('free')}
          {activeTab === 'qna' && renderBoardTab('qna')}
        </div>
      </main>

      {/* 사용자 인증 모달 */}
      <UserAuth
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={handleAuthClose}
        onSuccess={handleAuthSuccess}
        projectId={projectId}
        onModeSwitch={switchAuthMode}
      />

      {/* 글쓰기 모달 */}
      <PostEditor
        isOpen={postEditor.isOpen}
        boardType={postEditor.boardType}
        post={postEditor.post}
        onClose={handleClosePostEditor}
        onSave={handlePostSave}
        currentUser={currentUser}
        projectId={projectId}
      />

      {/* 푸터 */}
      <footer className="bg-gray-200 border-t border-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* 왼쪽: 프로젝트 정보 */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faRocket} className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{projectInfo.name}</h3>
                <p className="text-sm text-gray-500">프로젝트 관리 시스템</p>
              </div>
            </div>

            {/* 가운데: 링크 */}
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-blue-600 transition-colors">이용약관</a>
              <a href="#" className="hover:text-blue-600 transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-blue-600 transition-colors">고객지원</a>
            </div>

            {/* 오른쪽: 카피라이트 */}
            <div className="text-sm text-gray-400">
              <p>&copy; 2025 {projectInfo.name}. All rights reserved.</p>
              <p className="mt-1">Powered by Project CMS</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectTemplate;
