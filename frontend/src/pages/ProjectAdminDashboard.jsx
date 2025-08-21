import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDashboard, 
  faNewspaper, 
  faComments, 
  faQuestionCircle, 
  faUsers, 
  faCog, 
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faSearch,
  faBars,
  faTimes,
  faChartLine,
  faFileAlt,
  faUserCog,
  faSignOutAlt,
  faHome,
  faFolder
} from '@fortawesome/free-solid-svg-icons';
import FileUpload from '../components/FileUpload';
import DashboardTab from '../components/admin/DashboardTab';
import BoardManagementTab from '../components/admin/BoardManagementTab';
import UserManagementTab from '../components/admin/UserManagementTab';
import CategoryManagementTab from '../components/admin/CategoryManagementTab';
import SettingsTab from '../components/admin/SettingsTab';
import { getCurrentUser, hasProjectManagementPermission } from '../utils/permissions';

const ProjectAdminDashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projectInfo, setProjectInfo] = useState(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalBoards: 3, // 공지사항, 자유게시판, 질문게시판
    todayVisitors: 0,
    recentPosts: []
  });

  // 게시글 데이터 상태
  const [posts, setPosts] = useState({
    notice: [],
    free: [],
    qna: []
  });

  // 사용자 데이터 상태
  const [users, setUsers] = useState([]);

  // 카테고리 데이터 상태
  const [categories, setCategories] = useState([]);

  // 게시글 편집/삭제 상태
  const [editingPost, setEditingPost] = useState(null);
  const [showPostEditor, setShowPostEditor] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState([]);
  
  // 게시글 상세보기 상태
  const [viewingPost, setViewingPost] = useState(null);

  // 게시글 편집 모달
  const [postEditorModal, setPostEditorModal] = useState({
    isOpen: false,
    post: null,
    boardType: null
  });

  // 사용자 관리 상태
  const [userModal, setUserModal] = useState({
    isOpen: false,
    user: null,
    mode: 'add' // 'add' or 'edit'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  // 설정 관련 상태
  const [projectSettings, setProjectSettings] = useState({
    name: '',
    description: ''
  });
  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    category: null,
    mode: 'add'
  });

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    if (tab === 'board-management') {
      setActiveTab('board-notice');
    } else {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    // URL 파라미터에서 tab 값 읽기
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['dashboard', 'user-management', 'settings', 'file-management', 'board-notice', 'board-free', 'board-qna'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    // 권한 확인 및 사용자 설정
    const currentUser = getCurrentUser(projectId);
    if (!currentUser) {
      navigate(`/project/${projectId}`);
      return;
    }

    // 슈퍼 관리자이거나 프로젝트 관리자인 경우만 허용
    if (!hasProjectManagementPermission(projectId)) {
      navigate(`/project/${projectId}`);
      return;
    }

    setCurrentUser(currentUser);
    loadProjectData();
  }, [projectId, navigate, location.search]);

  const loadProjectData = () => {
    try {
      // 프로젝트 정보 로드
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setProjectInfo(project);
        // 프로젝트 설정 초기화
        setProjectSettings({
          name: project.name || '',
          description: project.description || ''
        });
      }

      // 게시글 데이터 로드
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

      // 사용자 데이터 로드
      const savedUsers = localStorage.getItem(`project_${projectId}_users`);
      if (savedUsers) {
        try {
          const parsedUsers = JSON.parse(savedUsers);
          setUsers(parsedUsers);
        } catch (error) {
          console.error('사용자 데이터 파싱 오류:', error);
          setUsers([]);
        }
      } else {
        // 샘플 사용자 데이터 생성
        const sampleUsers = [
          {
            id: 1,
            username: 'test_user',
            password: 'test123',
            email: 'test@example.com',
            role: 'user',
            projectId: projectId,
            createdAt: new Date().toISOString()
          }
        ];
        setUsers(sampleUsers);
        localStorage.setItem(`project_${projectId}_users`, JSON.stringify(sampleUsers));
      }

      // 카테고리 데이터 로드
      const savedCategories = localStorage.getItem(`project_${projectId}_categories`);
      if (savedCategories) {
        try {
          const parsedCategories = JSON.parse(savedCategories);
          setCategories(parsedCategories);
        } catch (error) {
          console.error('카테고리 데이터 파싱 오류:', error);
          loadSampleCategories();
        }
      } else {
        loadSampleCategories();
      }
    } catch (error) {
      console.error('프로젝트 데이터 로딩 오류:', error);
    }
  };

  const loadSamplePosts = () => {
    // 기본 게시글 설정 (저장된 게시글이 없는 경우에만)
    const samplePosts = {
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
          category: '게시판'
        }
      ],
      gallery: [
        { 
          id: 2, 
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
    
    setPosts(samplePosts);
    localStorage.setItem(`project_${projectId}_posts`, JSON.stringify(samplePosts));
    
    console.log('기본 게시글 설정 완료:', samplePosts);
  };

  const loadSampleCategories = () => {
    // 기본 카테고리 설정 (저장된 카테고리가 없는 경우에만)
    const defaultCategories = [
      { id: 1, name: '소개', boardType: 'intro', type: 'page', content: '<h1>프로젝트 소개</h1><p>이곳에 프로젝트에 대한 소개를 작성해주세요.</p>', order: 1 },
      { id: 2, name: '일반', boardType: 'general', type: 'page', content: '<h1>일반 정보</h1><p>프로젝트의 일반적인 정보를 작성해주세요.</p>', order: 2 },
      { id: 3, name: '게시판', boardType: 'board', type: 'board', order: 3 },
      { id: 4, name: '갤러리', boardType: 'gallery', type: 'board', order: 4 }
    ];
    
    setCategories(defaultCategories);
    localStorage.setItem(`project_${projectId}_categories`, JSON.stringify(defaultCategories));
    
    console.log('기본 카테고리 설정 완료:', defaultCategories);
  };

  const updateStats = () => {
    try {
      const totalPosts = Object.values(posts).flat().length;
      const totalUsers = users.length;
      const totalCategories = categories.length;
      
      // 오늘 방문자 수 계산 (샘플 데이터)
      const todayVisitors = Math.floor(Math.random() * 50) + 20; // 20-70명 랜덤
      
      // 전체 게시판의 최근 게시글 (날짜순 정렬)
      let recentPosts = [];
      if (Object.keys(posts).length > 0) {
        recentPosts = Object.values(posts).flat()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
      }

      setStats({
        totalPosts,
        totalUsers,
        totalCategories,
        totalBoards: 2, // 게시판, 갤러리
        todayVisitors,
        recentPosts
      });
    } catch (error) {
      console.error('통계 업데이트 오류:', error);
    }
  };

  const handleLogout = () => {
    // 슈퍼 관리자인 경우 슈퍼 관리자 로그아웃
    if (currentUser?.isSuperAdmin) {
      localStorage.removeItem('superAdmin');
      navigate('/dashboard');
      return;
    }
    
    // 프로젝트 관리자인 경우 프로젝트별 로그아웃
    localStorage.removeItem(`project_${projectId}_user`);
    navigate(`/project/${projectId}`);
  };

  const handleGoToProject = () => {
    navigate(`/project/${projectId}`);
  };

  // 게시글 편집/삭제 함수들
  const handleEditPost = (post, boardType) => {
    setPostEditorModal({
      isOpen: true,
      post,
      boardType
    });
  };

  const handleViewPost = (post, boardType) => {
    setViewingPost({ ...post, boardType });
  };

  const handleDeletePost = (postId, boardType) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        const updatedPosts = { ...posts };
        updatedPosts[boardType] = updatedPosts[boardType].filter(p => p.id !== postId);
        setPosts(updatedPosts);
        localStorage.setItem(`project_${projectId}_posts`, JSON.stringify(updatedPosts));
        updateStats();
        alert('게시글이 삭제되었습니다.');
      } catch (error) {
        console.error('게시글 삭제 오류:', error);
        alert('게시글 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedPosts.length === 0) {
      alert('삭제할 게시글을 선택해주세요.');
      return;
    }
    
    if (window.confirm(`선택된 ${selectedPosts.length}개의 게시글을 삭제하시겠습니까?`)) {
      try {
        const updatedPosts = { ...posts };
        selectedPosts.forEach(({ postId, boardType }) => {
          updatedPosts[boardType] = updatedPosts[boardType].filter(p => p.id !== postId);
        });
        setPosts(updatedPosts);
        localStorage.setItem(`project_${projectId}_posts`, JSON.stringify(updatedPosts));
        setSelectedPosts([]);
        updateStats();
        alert('선택된 게시글들이 삭제되었습니다.');
      } catch (error) {
        console.error('게시글 일괄 삭제 오류:', error);
        alert('게시글 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handlePostSelection = (postId, boardType, checked) => {
    if (checked) {
      setSelectedPosts([...selectedPosts, { postId, boardType }]);
    } else {
      setSelectedPosts(selectedPosts.filter(p => !(p.postId === postId && p.boardType === boardType)));
    }
  };

  const handleSavePost = (updatedPost, boardType) => {
    try {
      const updatedPosts = { ...posts };
      if (updatedPost.id) {
        // 편집 모드
        updatedPosts[boardType] = updatedPosts[boardType].map(p => 
          p.id === updatedPost.id ? updatedPost : p
        );
        alert('게시글이 수정되었습니다.');
      } else {
        // 새 게시글 모드
        updatedPost.id = Date.now();
        updatedPost.date = new Date().toISOString().split('T')[0];
        updatedPost.views = 0;
        updatedPost.author = currentUser?.username || '관리자';
        updatedPosts[boardType].unshift(updatedPost);
        alert('새 게시글이 작성되었습니다.');
      }
      
      setPosts(updatedPosts);
      localStorage.setItem(`project_${projectId}_posts`, JSON.stringify(updatedPosts));
      setPostEditorModal({ isOpen: false, post: null, boardType: null });
      updateStats();
    } catch (error) {
      console.error('게시글 저장 오류:', error);
      alert('게시글 저장 중 오류가 발생했습니다.');
    }
  };

  // 사용자 관리 함수들
  const handleAddUser = () => {
    setUserModal({
      isOpen: true,
      user: null,
      mode: 'add'
    });
  };

  const handleEditUser = (user) => {
    setUserModal({
      isOpen: true,
      user: user,
      mode: 'edit'
    });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      try {
        const updatedUsers = users.filter(u => u.id !== userId);
        setUsers(updatedUsers);
        localStorage.setItem(`project_${projectId}_users`, JSON.stringify(updatedUsers));
        updateStats();
        alert('사용자가 삭제되었습니다.');
      } catch (error) {
        console.error('사용자 삭제 오류:', error);
        alert('사용자 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleBulkDeleteUsers = () => {
    if (selectedUsers.length === 0) {
      alert('삭제할 사용자를 선택해주세요.');
      return;
    }
    
    if (window.confirm(`선택된 ${selectedUsers.length}명의 사용자를 삭제하시겠습니까?`)) {
      try {
        const updatedUsers = users.filter(u => !selectedUsers.includes(u.id));
        setUsers(updatedUsers);
        localStorage.setItem(`project_${projectId}_users`, JSON.stringify(updatedUsers));
        setSelectedUsers([]);
        updateStats();
        alert('선택된 사용자들이 삭제되었습니다.');
      } catch (error) {
        console.error('사용자 일괄 삭제 오류:', error);
        alert('사용자 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleUserSelection = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSaveUser = (userData) => {
    try {
      let updatedUsers;
      
      if (userModal.mode === 'add') {
        // 새 사용자 추가 - 비밀번호 필수
        if (!userData.password) {
          alert('새 사용자 추가 시에는 비밀번호를 입력해야 합니다.');
          return;
        }
        
        const newUser = {
          ...userData,
          id: Date.now(),
          projectId: projectId,
          createdAt: new Date().toISOString()
        };
        updatedUsers = [...users, newUser];
        alert('새 사용자가 추가되었습니다.');
      } else {
        // 기존 사용자 수정
        updatedUsers = users.map(u => u.id === userData.id ? { ...u, ...userData } : u);
        alert('사용자 정보가 수정되었습니다.');
      }
      
      setUsers(updatedUsers);
      localStorage.setItem(`project_${projectId}_users`, JSON.stringify(updatedUsers));
      setUserModal({ isOpen: false, user: null, mode: 'add' });
      updateStats();
    } catch (error) {
      console.error('사용자 저장 오류:', error);
      alert('사용자 정보 저장 중 오류가 발생했습니다.');
    }
  };

  // 검색된 사용자 필터링
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 설정 관련 함수들
  const handleProjectSettingsChange = (field, value) => {
    setProjectSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProjectSettings = () => {
    try {
      // 프로젝트 설정 저장 로직
      if (projectInfo) {
        const updatedProject = {
          ...projectInfo,
          name: projectSettings.name || projectInfo.name,
          description: projectSettings.description || projectInfo.description
        };
        
        // localStorage 업데이트
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const projectIndex = projects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
          projects[projectIndex] = updatedProject;
          localStorage.setItem('projects', JSON.stringify(projects));
          setProjectInfo(updatedProject);
          alert('프로젝트 설정이 저장되었습니다.');
        } else {
          alert('프로젝트를 찾을 수 없습니다.');
        }
      }
    } catch (error) {
      console.error('프로젝트 설정 저장 오류:', error);
      alert('프로젝트 설정 저장 중 오류가 발생했습니다.');
    }
  };

  const handleAddCategory = () => {
    setCategoryModal({
      isOpen: true,
      category: null,
      mode: 'add'
    });
  };

  // 프로젝트 홈페이지에 카테고리 변경 알림
  const notifyProjectHomepage = () => {
    // localStorage 변경 이벤트를 트리거하여 프로젝트 홈페이지가 변경사항을 감지하도록 함
    const currentCategories = localStorage.getItem(`project_${projectId}_categories`);
    if (currentCategories) {
      // 같은 데이터로 다시 저장하여 이벤트 트리거
      localStorage.setItem(`project_${projectId}_categories`, currentCategories);
      
      // 강제로 storage 이벤트 트리거
      window.dispatchEvent(new StorageEvent('storage', {
        key: `project_${projectId}_categories`,
        newValue: currentCategories,
        oldValue: currentCategories,
        url: window.location.href
      }));
    }
    
    // window.postMessage를 사용하여 같은 탭 내에서도 통신
    try {
      window.postMessage({
        type: 'CATEGORY_UPDATED',
        projectId: projectId,
        categories: currentCategories
      }, window.location.origin);
    } catch (error) {
      console.log('postMessage 전송 실패 (다른 탭에서만 작동)');
    }
    
    // 추가적으로 setTimeout을 사용하여 지연된 알림도 전송
    setTimeout(() => {
      try {
        window.postMessage({
          type: 'CATEGORY_UPDATED',
          projectId: projectId,
          categories: currentCategories
        }, window.location.origin);
      } catch (error) {
        console.log('지연된 postMessage 전송 실패');
      }
    }, 100);
  };

  const handleEditCategory = (category) => {
    setCategoryModal({
      isOpen: true,
      category: category,
      mode: 'edit'
    });
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
      try {
        const updatedCategories = categories.filter(cat => cat.id !== categoryId);
        setCategories(updatedCategories);
        localStorage.setItem(`project_${projectId}_categories`, JSON.stringify(updatedCategories));
        
        // 프로젝트 홈페이지에 카테고리 변경 알림
        notifyProjectHomepage();
        
        alert('카테고리가 삭제되었습니다.');
      } catch (error) {
        console.error('카테고리 삭제 오류:', error);
        alert('카테고리 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSaveCategory = (categoryData) => {
    try {
      let updatedCategories;
      
      if (categoryModal.mode === 'add') {
        // 새 카테고리 추가
        const newCategory = {
          id: Date.now(),
          ...categoryData,
          projectId: projectId
        };
        
        // 일반 페이지인 경우 boardType을 고유하게 설정하고 기본 내용 설정
        if (categoryData.type === 'page') {
          if (!categoryData.content) {
            newCategory.content = `<h1>${categoryData.name}</h1><p>페이지 내용을 입력해주세요.</p>`;
          }
          // 일반 페이지의 경우 boardType을 'page_' + 카테고리명으로 설정하여 고유성 보장
          newCategory.boardType = `page_${categoryData.name.toLowerCase().replace(/\s+/g, '_')}`;
        }
        
        // 게시판인 경우 기본 게시글 데이터 생성
        if (categoryData.type === 'board') {
          const existingPosts = JSON.parse(localStorage.getItem(`project_${projectId}_posts`) || '{}');
          if (!existingPosts[categoryData.boardType]) {
            existingPosts[categoryData.boardType] = [
              {
                id: Date.now(),
                title: `${categoryData.name}이 오픈되었습니다!`,
                author: '관리자',
                authorId: 'admin',
                date: new Date().toLocaleDateString('ko-KR'),
                views: 0,
                content: `${categoryData.name}입니다. 글을 작성해보세요.`,
                boardType: categoryData.boardType,
                category: categoryData.name
              }
            ];
            localStorage.setItem(`project_${projectId}_posts`, JSON.stringify(existingPosts));
          }
        }
        
        updatedCategories = [...categories, newCategory];
        alert('새 카테고리가 추가되었습니다.');
      } else {
        // 기존 카테고리 수정
        updatedCategories = categories.map(cat => 
          cat.id === categoryData.id ? { ...cat, ...categoryData } : cat
        );
        alert('카테고리가 수정되었습니다.');
      }
      
      setCategories(updatedCategories);
      localStorage.setItem(`project_${projectId}_categories`, JSON.stringify(updatedCategories));
      
      // 프로젝트 홈페이지에 카테고리 변경 알림
      notifyProjectHomepage();
      
      setCategoryModal({ isOpen: false, category: null, mode: 'add' });
    } catch (error) {
      console.error('카테고리 저장 오류:', error);
      alert('카테고리 저장 중 오류가 발생했습니다.');
    }
  };

  // 카테고리 순서 변경 함수
  const handleMoveCategory = (categoryId, direction) => {
    try {
      const currentIndex = categories.findIndex(cat => cat.id === categoryId);
      if (currentIndex === -1) return;

      let newIndex;
      if (direction === 'up' && currentIndex > 0) {
        newIndex = currentIndex - 1;
      } else if (direction === 'down' && currentIndex < categories.length - 1) {
        newIndex = currentIndex + 1;
      } else {
        return; // 이동할 수 없는 경우
      }

      // 카테고리 배열에서 순서 변경
      const updatedCategories = [...categories];
      const [movedCategory] = updatedCategories.splice(currentIndex, 1);
      updatedCategories.splice(newIndex, 0, movedCategory);

      setCategories(updatedCategories);
      localStorage.setItem(`project_${projectId}_categories`, JSON.stringify(updatedCategories));
      
      // 프로젝트 홈페이지에 카테고리 변경 알림
      notifyProjectHomepage();
      
      alert('카테고리 순서가 변경되었습니다.');
    } catch (error) {
      console.error('카테고리 순서 변경 오류:', error);
      alert('카테고리 순서 변경 중 오류가 발생했습니다.');
    }
  };

  









  // 파일 관리 탭 렌더링
  const renderFileManagementTab = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">📁 파일 관리</h2>
        <FileUpload 
          projectId={projectId}
          onFileUpload={(files) => {
            console.log('업로드된 파일들:', files);
            // 파일 업로드 후 처리 로직
          }}
          onFileDelete={(fileId) => {
            console.log('삭제된 파일:', fileId);
            // 파일 삭제 후 처리 로직
          }}
        />
      </div>
    );
  };

  // 게시글 편집 모달 컴포넌트
  const renderPostEditorModal = () => {
    if (!postEditorModal.isOpen) return null;

    const { post, boardType } = postEditorModal;
    const isEdit = !!post;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {isEdit ? '게시글 편집' : '새 게시글 작성'}
            </h3>
            <button
              onClick={() => setPostEditorModal({ isOpen: false, post: null, boardType: null })}
              className="text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const postData = {
              title: formData.get('title'),
              content: formData.get('content'),
              author: currentUser.username,
              boardType: boardType
            };
            
            if (isEdit) {
              postData.id = post.id;
              postData.date = post.date;
              postData.views = post.views;
            }
            
            handleSavePost(postData, boardType);
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={post?.title || ''}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="게시글 제목을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                <textarea
                  name="content"
                  defaultValue={post?.content || ''}
                  required
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="게시글 내용을 입력하세요"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setPostEditorModal({ isOpen: false, post: null, boardType: null })}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  {isEdit ? '수정' : '작성'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // 사용자 편집 모달 컴포넌트
  const renderUserEditorModal = () => {
    if (!userModal.isOpen) return null;

    const { user, mode } = userModal;
    const isEdit = mode === 'edit';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {isEdit ? '사용자 편집' : '새 사용자 추가'}
            </h3>
            <button
              onClick={() => setUserModal({ isOpen: false, user: null, mode: 'add' })}
              className="text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const userData = {
              username: formData.get('username'),
              email: formData.get('email'),
              password: formData.get('password'),
              role: formData.get('role')
            };
            
            if (isEdit) {
              userData.id = user.id;
              if (!userData.password) {
                userData.password = user.password;
              }
            }
            
            handleSaveUser(userData);
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사용자명</label>
                <input
                  type="text"
                  name="username"
                  defaultValue={user?.username || ''}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="사용자명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={user?.email || ''}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="이메일을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isEdit ? '새 비밀번호 (변경 시에만 입력)' : '비밀번호'}
                </label>
                <input
                  type="password"
                  name="password"
                  required={!isEdit}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={isEdit ? '변경 시에만 입력하세요' : '비밀번호를 입력하세요'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">역할</label>
                <select
                  name="role"
                  defaultValue={user?.role || 'user'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">일반 사용자</option>
                  <option value="project_admin">프로젝트 관리자</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setUserModal({ isOpen: false, user: null, mode: 'add' })}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  {isEdit ? '수정' : '추가'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

    // 카테고리 편집 모달 컴포넌트
  const renderCategoryEditorModal = () => {
    if (!categoryModal.isOpen) return null;

    const { category, mode } = categoryModal;
    const isEdit = mode === 'edit';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {isEdit ? '카테고리 편집' : '새 카테고리 추가'}
            </h3>
            <button
              onClick={() => setCategoryModal({ isOpen: false, category: null, mode: 'add' })}
              className="text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const categoryData = {
              name: formData.get('name'),
              type: formData.get('type'),
              boardType: formData.get('boardType'),
              color: formData.get('color'),
              content: formData.get('content') || ''
            };
            
            if (isEdit) {
              categoryData.id = category.id;
            }
            
            handleSaveCategory(categoryData);
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리명</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={category?.name || ''}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="카테고리명을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 타입</label>
                <select
                  name="type"
                  defaultValue={category?.type || 'board'}
                  onChange={(e) => {
                    const boardTypeSection = e.target.form?.querySelector('#boardTypeSection');
                    const contentSection = e.target.form?.querySelector('#contentSection');
                    if (boardTypeSection && contentSection) {
                      if (e.target.value === 'page') {
                        boardTypeSection.style.display = 'none';
                        contentSection.style.display = 'block';
                      } else {
                        boardTypeSection.style.display = 'block';
                        contentSection.style.display = 'none';
                      }
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="board">게시판</option>
                  <option value="page">일반 페이지</option>
                </select>
              </div>
              
              <div id="boardTypeSection" style={{ display: category?.type === 'page' ? 'none' : 'block' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">게시판 타입</label>
                <select
                  name="boardType"
                  defaultValue={category?.boardType || 'free'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="notice">공지사항</option>
                  <option value="free">자유게시판</option>
                  <option value="qna">질문게시판</option>
                  <option value="gallery">갤러리게시판</option>
                </select>
              </div>
              
              <div id="contentSection" style={{ display: category?.type === 'page' ? 'block' : 'none' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">페이지 내용</label>
                <textarea
                  name="content"
                  defaultValue={category?.content || ''}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="페이지 내용을 입력하세요 (HTML 태그 사용 가능)"
                />
                <p className="text-sm text-gray-500 mt-1">HTML 태그를 사용하여 페이지 내용을 작성할 수 있습니다.</p>
              </div>
              


              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCategoryModal({ isOpen: false, category: null, mode: 'add' })}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  {isEdit ? '수정' : '추가'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // 게시글 상세보기 모달 컴포넌트
  const renderPostViewModal = () => {
    if (!viewingPost) return null;

    const boardNames = {
      notice: '공지사항',
      free: '자유게시판',
      qna: '질문게시판',
      gallery: '갤러리게시판'
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">게시글 상세보기</h3>
            <button
              onClick={() => setViewingPost(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* 제목 및 메타 정보 */}
            <div className="border-b border-gray-200 pb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{viewingPost.title}</h1>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>작성자: {viewingPost.author}</span>
                  <span>작성일: {viewingPost.date}</span>
                  <span>조회수: {viewingPost.views}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    viewingPost.boardType === 'notice' ? 'bg-blue-100 text-blue-600' :
                    viewingPost.boardType === 'free' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {boardNames[viewingPost.boardType]}
                  </span>
                  {viewingPost.category && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {viewingPost.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 내용 */}
            <div className="prose max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                {viewingPost.content}
              </div>
            </div>

            {/* 첨부파일 (있다면) */}
            {viewingPost.files && viewingPost.files.length > 0 && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">첨부파일</h3>
                <div className="space-y-2">
                  {viewingPost.files.map((file, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-700">{file.name}</span>
                      <span className="text-sm text-gray-500">({file.size})</span>
                      <button className="ml-auto text-blue-600 hover:text-blue-800 text-sm">
                        다운로드
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={() => setViewingPost(null)}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  };

  // useEffect에서 프로젝트 설정 초기화
  useEffect(() => {
    if (projectInfo) {
      setProjectSettings({
        name: projectInfo.name || '',
        description: projectInfo.description || ''
      });
    }
  }, [projectInfo]);

  // posts, users, categories 상태가 변경될 때마다 통계 업데이트
  useEffect(() => {
    if (Object.keys(posts).length > 0 && users.length > 0 && categories.length > 0) {
      updateStats();
    }
  }, [posts, users, categories]);

  // 샘플 카테고리 데이터 로드
  useEffect(() => {
    if (categories.length === 0) {
      const sampleCategories = [
        { id: 1, name: '일반', boardType: 'free', color: 'blue', type: 'board' },
        { id: 2, name: '공지', boardType: 'notice', color: 'red', type: 'board' },
        { id: 3, name: '질문', boardType: 'qna', color: 'green', type: 'board' }
      ];
      setCategories(sampleCategories);
    }
  }, [categories.length]);

  if (!currentUser || !projectInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-lg">
        <div className="w-[1400px] mx-auto ">
          <div className="flex items-center justify-between h-16">
            {/* 로고 및 프로젝트명 */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faDashboard} className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">{projectInfo.name} 관리자</h1>
              </div>
            </div>

            {/* 사용자 메뉴 */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoToProject}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faHome} className="h-4 w-4" />
                <span>프로젝트 홈으로</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserCog} className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-800 font-medium">{currentUser.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex justify-center">
        <div className='w-[1400px] flex'>
        {/* 사이드바 */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="h-full flex flex-col">
            {/* 사이드바 헤더 */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">관리 메뉴</h2>
            </div>

            {/* 네비게이션 메뉴 */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2 flex flex-col items-center">
                <li className="w-full">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === 'dashboard' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FontAwesomeIcon icon={faDashboard} className="h-5 w-5" />
                    <span>대시보드</span>
                  </button>
                </li>
                <li className="w-full">
                  <button
                    onClick={() => setActiveTab('category-management')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === 'category-management' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FontAwesomeIcon icon={faChartLine} className="h-5 w-5" />
                    <span>카테고리 관리</span>
                  </button>
                </li>
                <li className="w-full">
                  <button
                    onClick={() => setActiveTab('user-management')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === 'user-management' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
                    <span>사용자 관리</span>
                  </button>
                </li>
                <li className="w-full">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === 'settings' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FontAwesomeIcon icon={faCog} className="h-5 w-5" />
                    <span>설정</span>
                  </button>
                </li>
                <li className="w-full">
                  <button
                    onClick={() => setActiveTab('file-management')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === 'file-management' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FontAwesomeIcon icon={faFolder} className="h-5 w-5" />
                    <span>파일 관리</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardTab 
                projectInfo={projectInfo} 
                stats={stats} 
              />
            )}
            {activeTab === 'board-management' && (
              <BoardManagementTab 
                posts={posts}
                selectedPosts={selectedPosts}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setSelectedPosts={setSelectedPosts}
                handleEditPost={handleEditPost}
                handleDeletePost={handleDeletePost}
                handleViewPost={handleViewPost}
                handleBulkDelete={handleBulkDelete}
                setPostEditorModal={setPostEditorModal}
              />
            )}
            {activeTab === 'user-management' && (
              <UserManagementTab 
                users={users}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                handleAddUser={handleAddUser}
                handleEditUser={handleEditUser}
                handleDeleteUser={handleDeleteUser}
                handleBulkDelete={handleBulkDeleteUsers}
                setUserModal={setUserModal}
              />
            )}
            {activeTab === 'category-management' && (
              <CategoryManagementTab 
                categories={categories}
                handleAddCategory={handleAddCategory}
                handleEditCategory={handleEditCategory}
                handleDeleteCategory={handleDeleteCategory}
                handleMoveCategory={handleMoveCategory}
                setCategoryModal={setCategoryModal}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsTab 
                projectSettings={projectSettings}
                handleProjectSettingsChange={handleProjectSettingsChange}
                handleSaveProjectSettings={handleSaveProjectSettings}
              />
            )}
            {activeTab === 'file-management' && renderFileManagementTab()}
            {renderPostEditorModal()}
            {renderUserEditorModal()}
            {renderCategoryEditorModal()}
            {renderPostViewModal()}
          </div>
        </main>
      </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-gray-200 border-t border-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* 왼쪽: 프로젝트 정보 */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faDashboard} className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{projectInfo?.name || '프로젝트'} 관리자</h3>
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
              <p>&copy; 2025 {projectInfo?.name || '프로젝트'}. All rights reserved.</p>
              <p className="mt-1">Powered by Project CMS</p>
            </div>
          </div>
        </div>
      </footer>

      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectAdminDashboard;
