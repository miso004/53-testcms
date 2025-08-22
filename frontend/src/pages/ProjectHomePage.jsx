import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faNewspaper, 
  faComments, 
  faQuestionCircle, 
  faUser, 
  faRightToBracket, 
  faUserPlus,
  faSearch,
  faCog,
  faRocket,
  faShieldAlt,
  faImage,
  faEye,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import UserAuth from '../components/UserAuth';
import PostEditor from '../components/PostEditor';
import ProfileManager from '../components/ProfileManager';
import PageEditor from '../components/PageEditor';
import ProjectAdminLogin from '../components/ProjectAdminLogin';

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
  
  // 글 상세보기 상태 추가
  const [selectedPost, setSelectedPost] = useState(null);
  
  // 댓글 상태 추가
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  
  // 검색 상태 추가
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // 프로필 관리 모달 상태
  const [profileModal, setProfileModal] = useState({ isOpen: false });
  
  // 페이지 편집 모달 상태
  const [pageEditor, setPageEditor] = useState({ isOpen: false, category: null });
  
  // 프로젝트 관리자 로그인 모달 상태
  const [adminLoginModal, setAdminLoginModal] = useState({ isOpen: false });

  // 프로젝트 정보 상태
  const [projectInfo, setProjectInfo] = useState({
    id: projectId,
    name: '샘플 프로젝트',
    description: '자동으로 생성된 홈페이지입니다.',
    admin: 'project_admin',
    createdAt: '2024-01-15'
  });

  // 카테고리 상태 추가
  const [categories, setCategories] = useState([]);
  const [dynamicTabs, setDynamicTabs] = useState([
    { id: 'home', name: '홈', type: 'home' }
  ]);

  useEffect(() => {
    // 프로젝트 정보 로드
    loadProjectInfo();
    
    // 카테고리 로드
    loadCategories();
    
    // 게시글 데이터 로드
    loadPosts();
    
    // localStorage 변경 감지 이벤트 리스너 추가
    const handleStorageChange = (e) => {
      if (e.key === `project_${projectId}_categories`) {
        console.log('Storage 이벤트 감지:', e.key);
        updateDynamicTabs();
      }
    };
    
    // postMessage 이벤트 리스너 추가 (같은 탭 내 통신)
    const handleMessage = (event) => {
      if (event.origin === window.location.origin && 
          event.data.type === 'CATEGORY_UPDATED' && 
          event.data.projectId === projectId) {
        console.log('PostMessage 이벤트 감지:', event.data);
        updateDynamicTabs();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
    };
  }, [projectId]);

  // 사용자 로그인 상태 확인을 위한 별도 useEffect
  useEffect(() => {
    // 슈퍼 관리자 상태 확인
    const superAdmin = localStorage.getItem('superAdmin');
    if (superAdmin) {
      try {
        const adminData = JSON.parse(superAdmin);
        setCurrentUser({
          ...adminData,
          role: 'super_admin',
          isSuperAdmin: true,
          projectId: projectId
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
        const user = JSON.parse(savedUser);
        // 프로젝트 ID가 일치하는지 확인
        if (user.projectId === projectId) {
          setCurrentUser(user);
        } else {
          // 프로젝트가 일치하지 않으면 로그인 상태 제거
          localStorage.removeItem(`project_${projectId}_user`);
        }
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        localStorage.removeItem(`project_${projectId}_user`);
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
  }, [projectId]);

  // posts가 로드된 후 URL 파라미터 처리
  useEffect(() => {
    if (Object.keys(posts).length > 0) {
      handleUrlParams();
    }
  }, [posts]);

  // 프로젝트 정보 로드 함수
  const loadProjectInfo = () => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      setProjectInfo({
        id: project.id,
        name: project.name,
        description: project.description,
        admin: project.adminUsername || 'project_admin',
        createdAt: project.createdAt
      });
    }
  };
  
  // 프로젝트 관리자 로그인 성공 핸들러
  const handleAdminLoginSuccess = (adminUser) => {
    // 현재 사용자 상태를 프로젝트 관리자로 설정
    setCurrentUser(adminUser);
    
    // 프로젝트 관리자 대시보드로 이동
    window.open(`/project/${projectId}/admin`, '_blank');
  };

  // 카테고리 로드 및 동적 탭 생성
  const loadCategories = () => {
    try {
      const savedCategories = localStorage.getItem(`project_${projectId}_categories`);
      
      if (savedCategories) {
        const categoriesData = JSON.parse(savedCategories);
        setCategories(categoriesData);
        
        // 동적 탭 생성 (홈 + 카테고리 기반)
        const tabs = [
          { id: 'home', name: '홈', type: 'home' },
          ...categoriesData.map(category => ({
            id: category.type === 'page' ? category.name : category.boardType, // 일반 페이지는 name, 게시판은 boardType 사용
            name: category.name,
            type: category.type, // 'page' 또는 'board' 타입 유지
            category: category
          }))
        ];
        setDynamicTabs(tabs);
        
        // 기본 탭이 유효하지 않으면 홈으로 설정
        if (!tabs.find(tab => tab.id === activeTab)) {
          setActiveTab('home');
        }
        
        console.log('카테고리 로드 완료:', categoriesData);
      } else {
        // 저장된 카테고리가 없는 경우에만 기본 카테고리 설정
        console.log('저장된 카테고리가 없어 기본 카테고리 설정');
        const defaultCategories = [
          { id: 1, name: '소개', boardType: 'intro', type: 'page', content: '<h1>프로젝트 소개</h1><p>이곳에 프로젝트에 대한 소개를 작성해주세요.</p>', order: 1 },
          { id: 2, name: '일반', boardType: 'general', type: 'page', content: '<h1>일반 정보</h1><p>프로젝트의 일반적인 정보를 작성해주세요.</p>', order: 2 },
          { id: 3, name: '게시판', boardType: 'board', type: 'board', order: 3 },
          { id: 4, name: '갤러리', boardType: 'gallery', type: 'board', order: 4 }
        ];
        setCategories(defaultCategories);
        
        // 기본 카테고리를 localStorage에 저장
        localStorage.setItem(`project_${projectId}_categories`, JSON.stringify(defaultCategories));
        
        const tabs = [
          { id: 'home', name: '홈', type: 'home' },
          ...defaultCategories.map(category => ({
            id: category.type === 'page' ? category.name : category.boardType,
            name: category.name,
            type: category.type,
            category: category
          }))
        ];
        setDynamicTabs(tabs);
        
        console.log('기본 카테고리 설정 완료:', defaultCategories);
      }
    } catch (error) {
      console.error('카테고리 로드 오류:', error);
    }
  };

  // 게시글 데이터 로드 함수
  const loadPosts = () => {
    try {
      const savedPosts = localStorage.getItem(`project_${projectId}_posts`);
      
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
        console.log('게시글 로드 완료:', parsedPosts);
      } else {
        // 기본 게시글 데이터 생성 (저장된 게시글이 없는 경우에만)
        console.log('저장된 게시글이 없어 기본 게시글 생성');
        const samplePosts = {
          board: [
            { id: 1, title: '게시판이 오픈되었습니다!', author: '관리자', authorId: 'admin', date: new Date().toLocaleDateString('ko-KR'), views: 0, content: '일반 게시판입니다. 자유롭게 글을 작성해보세요.', boardType: 'board', category: '게시판' }
          ],
          gallery: [
            { id: 2, title: '갤러리가 오픈되었습니다!', author: '관리자', authorId: 'admin', date: new Date().toLocaleDateString('ko-KR'), views: 0, content: '갤러리 게시판입니다. 이미지와 함께 글을 작성해보세요.', boardType: 'gallery', category: '갤러리' }
          ]
        };
        setPosts(samplePosts);
        localStorage.setItem(`project_${projectId}_posts`, JSON.stringify(samplePosts));
        console.log('기본 게시글 생성 완료:', samplePosts);
      }
    } catch (error) {
      console.error('게시글 로딩 오류:', error);
    }
  };

  // URL 파라미터에서 게시글 처리 함수
  const handleUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    const boardType = urlParams.get('board');
    
    if (postId && boardType && Object.keys(posts).length > 0) {
      // 해당 게시글 찾기
      const allPosts = Object.values(posts).flat();
      const targetPost = allPosts.find(post => post.id === parseInt(postId));
      
      if (targetPost) {
        // 게시글 상세보기로 설정
        setSelectedPost({ ...targetPost, boardType: boardType });
        // 해당 게시판 탭으로 설정
        setActiveTab(boardType);
        // 댓글 로드
        loadComments(parseInt(postId));
      }
    }
  };

  // 샘플 게시글 데이터 로드 (첫 방문 시)
  const loadSamplePosts = () => {
    const samplePosts = {
      notice: [
        { id: 1, title: '공지사항 게시판이 오픈되었습니다!', author: '관리자', authorId: 'admin', date: '2024-01-15', views: 156, content: '환영합니다!', boardType: 'notice', category: '공지' },
        { id: 2, title: '사이트 이용 안내', author: '관리자', authorId: 'admin', date: '2024-01-14', views: 89, content: '이용 방법을 확인하세요.', boardType: 'notice', category: '안내' },
        { id: 3, title: '개인정보 처리방침', author: '관리자', authorId: 'admin', date: '2024-01-13', views: 67, content: '개인정보 보호 정책입니다.', boardType: 'notice', category: '정책' }
      ],
      free: [
        { id: 4, title: '안녕하세요! 처음 방문했습니다', author: '방문자1', authorId: 'user1', date: '2024-01-15', views: 23, content: '반갑습니다!', boardType: 'free', category: '일반' },
        { id: 5, title: '오늘 날씨가 정말 좋네요', author: '방문자2', authorId: 'user2', date: '2024-01-14', views: 18, content: '맑은 하늘이네요.', boardType: 'free', category: '일반' },
        { id: 6, title: '맛집 추천 부탁드려요', author: '방문자3', authorId: 'user3', date: '2024-01-13', views: 45, content: '좋은 맛집 알려주세요.', boardType: 'free', category: '정보공유' }
      ],
      qna: [
        { id: 7, title: '회원가입은 어떻게 하나요?', author: '질문자1', authorId: 'user4', date: '2024-01-15', views: 34, content: '회원가입 방법을 알려주세요.', boardType: 'qna', category: '질문' },
        { id: 8, title: '게시글 작성 방법', author: '질문자2', authorId: 'user5', date: '2024-01-14', views: 28, content: '게시글을 어떻게 작성하나요?', boardType: 'qna', category: '질문' },
        { id: 9, title: '비밀번호 변경 문의', author: '질문자3', authorId: 'user6', date: '2024-01-13', views: 19, content: '비밀번호를 변경하고 싶습니다.', boardType: 'qna', category: '질문' }
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
    
    // 로그인 성공 후 현재 프로젝트 홈페이지에 머물도록 수정
    // 관리자 대시보드로의 자동 이동 제거
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
      updatedPosts[newPost.boardType] = newPost.boardType === 'notice' ? [] : [];
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

  // 댓글 관련 함수들
  const loadComments = (postId) => {
    try {
      const savedComments = localStorage.getItem(`project_${projectId}_comments_${postId}`);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('댓글 로딩 오류:', error);
      setComments([]);
    }
  };

  const handleAddComment = () => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    const comment = {
      id: Date.now(),
      postId: selectedPost.id,
      author: currentUser.username,
      authorId: currentUser.id,
      content: newComment.trim(),
      date: new Date().toLocaleDateString('ko-KR'),
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`project_${projectId}_comments_${selectedPost.id}`, JSON.stringify(updatedComments));
    setNewComment('');
  };

  const handleEditComment = (commentId) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingComment(commentId);
      setEditCommentText(comment.content);
    }
  };

  const handleUpdateComment = (commentId) => {
    if (!editCommentText.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    const updatedComments = comments.map(c => 
      c.id === commentId 
        ? { ...c, content: editCommentText.trim(), date: new Date().toLocaleDateString('ko-KR'), time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }
        : c
    );
    
    setComments(updatedComments);
    localStorage.setItem(`project_${projectId}_comments_${selectedPost.id}`, JSON.stringify(updatedComments));
    setEditingComment(null);
    setEditCommentText('');
  };

  const handleDeleteComment = (commentId) => {
    if (confirm('댓글을 삭제하시겠습니까?')) {
      const updatedComments = comments.filter(c => c.id !== commentId);
      setComments(updatedComments);
      localStorage.setItem(`project_${projectId}_comments_${selectedPost.id}`, JSON.stringify(updatedComments));
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditCommentText('');
  };

  // 프로필 관리 관련 함수들
  const handleOpenProfileManager = () => {
    setProfileModal({ isOpen: true });
  };

  const handleCloseProfileManager = () => {
    setProfileModal({ isOpen: false });
  };

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  // 페이지 편집 관련 함수들
  const handleClosePageEditor = () => {
    setPageEditor({ isOpen: false, category: null });
  };

  const handlePageSave = (updatedCategory) => {
    // 카테고리 업데이트
    const updatedCategories = categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    );
    setCategories(updatedCategories);
    
    // localStorage에 저장
    localStorage.setItem(`project_${projectId}_categories`, JSON.stringify(updatedCategories));
    
    // 페이지 편집 모달 닫기
    setPageEditor({ isOpen: false, category: null });
  };

  // 카테고리 변경 감지 및 동적 탭 업데이트
  const updateDynamicTabs = () => {
    console.log('updateDynamicTabs 함수 호출됨');
    // localStorage에서 최신 카테고리 데이터를 직접 가져와서 동적 탭 업데이트
    try {
      const savedCategories = localStorage.getItem(`project_${projectId}_categories`);
      console.log('저장된 카테고리 데이터:', savedCategories);
      
      if (savedCategories) {
        const categoriesData = JSON.parse(savedCategories);
        console.log('파싱된 카테고리 데이터:', categoriesData);
        setCategories(categoriesData);
        
        // 동적 탭 생성 (홈 + 카테고리 기반)
        const tabs = [
          { id: 'home', name: '홈', type: 'home' },
          ...categoriesData.map(category => ({
            id: category.type === 'page' ? category.name : category.boardType, // 일반 페이지는 name, 게시판은 boardType 사용
            name: category.name,
            type: category.type, // 'page' 또는 'board' 타입 유지
            category: category
          }))
        ];
        console.log('생성된 동적 탭:', tabs);
        setDynamicTabs(tabs);
        
        // 현재 활성 탭이 유효한지 확인하고, 유효하지 않으면 홈으로 설정
        const isValidTab = tabs.some(tab => tab.id === activeTab);
        if (!isValidTab && activeTab !== 'home') {
          setActiveTab('home');
        }
      } else {
        // 저장된 카테고리가 없으면 기본 카테고리 설정
        console.log('저장된 카테고리가 없어 기본 카테고리 설정');
        const defaultCategories = [
          { id: 1, name: '소개', boardType: 'intro', type: 'page', content: '<h1>프로젝트 소개</h1><p>이곳에 프로젝트에 대한 소개를 작성해주세요.</p>', order: 1 },
          { id: 2, name: '일반', boardType: 'general', type: 'page', content: '<h1>일반 정보</h1><p>프로젝트의 일반적인 정보를 작성해주세요.</p>', order: 2 },
          { id: 3, name: '게시판', boardType: 'board', type: 'board', order: 3 },
          { id: 4, name: '갤러리', boardType: 'gallery', type: 'board', order: 4 }
        ];
        setCategories(defaultCategories);
        
        // 기본 카테고리를 localStorage에 저장
        localStorage.setItem(`project_${projectId}_categories`, JSON.stringify(defaultCategories));
        
        const tabs = [
          { id: 'home', name: '홈', type: 'home' },
          ...defaultCategories.map(category => ({
            id: category.type === 'page' ? category.name : category.boardType,
            name: category.name,
            type: category.type,
            category: category
          }))
        ];
        setDynamicTabs(tabs);
      }
    } catch (error) {
      console.error('카테고리 업데이트 오류:', error);
    }
  };

  // 검색 관련 함수들
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    setIsSearching(true);
    
    // 동적 카테고리 기반으로 모든 게시판에서 검색
    const allPosts = Object.keys(posts).map(boardType => {
      const category = categories.find(cat => cat.boardType === boardType);
      const boardName = category ? category.name : boardType;
      return posts[boardType].map(post => ({ 
        ...post, 
        boardType: boardType, 
        boardName: boardName 
      }));
    }).flat();

    // 제목, 내용, 작성자에서 검색어 포함 여부 확인
    const results = allPosts.filter(post => {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = post.title && post.title.toLowerCase().includes(searchLower);
      const contentMatch = post.content && post.content.toLowerCase().includes(searchLower);
      const authorMatch = post.author && post.author.toLowerCase().includes(searchLower);
      
      return titleMatch || contentMatch || authorMatch;
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleSearchResultClick = (post) => {
    setSelectedPost({ ...post, boardType: post.boardType });
    loadComments(post.id);
    // 검색 결과 클리어
    clearSearch();
  };

  const handleViewPost = (post) => {
    // 글 보기는 누구나 가능
    // post.boardType이 없으면 현재 activeTab을 사용
    const boardType = post.boardType || activeTab;
    setSelectedPost({ ...post, boardType: boardType });
    
    // 댓글 로드
    loadComments(post.id);
  };

  const renderHomeTab = () => (
    <div className="space-y-12 mt-7">
      {/* 주요 기능 소개 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.slice(0, 3).map((category, index) => {
          const icons = [faNewspaper, faComments, faQuestionCircle];
          const colors = ['blue', 'green', 'purple'];
          const descriptions = [
            '중요한 소식과 업데이트를 확인하세요',
            '자유롭게 의견을 나누고 소통하세요',
            '궁금한 점을 물어보고 답변을 받아보세요'
          ];
          
          return (
            <div key={category.id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className={`w-16 h-16 bg-${colors[index] || 'gray'}-100 rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                <FontAwesomeIcon icon={icons[index] || faNewspaper} className={`h-8 w-8 text-${colors[index] || 'gray'}-600`} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{category.name}</h3>
              <p className="text-gray-600 text-center">{descriptions[index] || '게시판을 이용해보세요'}</p>
            </div>
          );
        })}
      </div>

      {/* 최근 게시글 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">최근 게시글</h2>
        <div className="space-y-4">
          {(() => {
            // 동적 카테고리 기반으로 모든 게시판의 게시글을 합치고 날짜순으로 정렬하여 최근 5개 표시
            const allPosts = Object.keys(posts).map(boardType => {
              const category = categories.find(cat => cat.boardType === boardType);
              const boardName = category ? category.name : boardType;
              return posts[boardType].map(post => ({ 
                ...post, 
                boardType: boardType, 
                boardName: boardName 
              }));
            }).flat();
            
            const recentPosts = allPosts
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5);
            
            return recentPosts.map(post => (
              <div 
                key={`${post.boardType}-${post.id}`} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleViewPost(post)}
              >
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    post.boardType === 'board' ? 'bg-purple-100 text-purple-600' :
                    post.boardType === 'gallery' ? 'bg-pink-100 text-pink-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {post.boardName || post.boardType}
                  </span>
                  <span className="font-medium text-gray-800">{post.title}</span>
                  <span className="text-sm text-gray-500">- {post.author}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {post.date} | 조회 {post.views}
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );

  const renderBoardTab = (boardType) => {
    const boardData = posts[boardType] || [];
    
    // 동적 카테고리에서 게시판 이름 찾기
    const category = categories.find(cat => cat.boardType === boardType);
    const boardName = category ? category.name : boardType;
    
    // 기본 게시판 이름 매핑 (fallback)
    const defaultBoardNames = {
      board: '게시판',
      gallery: '갤러리'
    };
    const displayName = boardName || defaultBoardNames[boardType] || boardType;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">{displayName}</h2>
          <button 
            onClick={() => {
              if (currentUser) {
                setPostEditor({ isOpen: true, boardType: boardType, post: null });
              } else {
                setAuthModal({ isOpen: true, mode: 'login' });
              }
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            글쓰기
          </button>
        </div>

        {/* 검색바 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="게시글을 검색하세요..."
                className="w-full px-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button 
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSearching ? '검색중...' : '검색'}
            </button>
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
              >
                초기화
              </button>
            )}
          </div>
        </div>

        {/* 검색 결과 */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-800">
                  검색 결과: "{searchQuery}" ({searchResults.length}건)
                </h3>
                <button 
                  onClick={clearSearch}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  검색 결과 닫기
                </button>
              </div>
            </div>
            <div className="grid grid-cols-12 bg-gray-50 p-4 font-semibold text-gray-700">
              <div className="col-span-1">번호</div>
              <div className="col-span-2">게시판</div>
              <div className="col-span-5">제목</div>
              <div className="col-span-2">작성자</div>
              <div className="col-span-2">작성일</div>
            </div>
            
            {searchResults.map((post, index) => (
              <div 
                key={`${post.boardType}-${post.id}`} 
                className="grid grid-cols-12 p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => handleSearchResultClick(post)}
              >
                <div className="col-span-1 text-gray-500">{searchResults.length - index}</div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.boardType === 'notice' ? 'bg-blue-100 text-blue-600' :
                    post.boardType === 'free' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {post.boardName}
                  </span>
                </div>
                <div className="col-span-5 font-medium text-gray-800">{post.title}</div>
                <div className="col-span-2 text-gray-600">{post.author}</div>
                <div className="col-span-2 text-gray-500">{post.date}</div>
              </div>
            ))}
          </div>
        )}

        {/* 게시글 목록 */}
        {searchResults.length === 0 && (
          <>
            {boardType === 'gallery' ? (
              // 갤러리 게시판용 이미지 그리드 레이아웃
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {boardData && boardData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {boardData.map((post, index) => (
                      <div 
                        key={post.id} 
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group"
                        onClick={() => handleViewPost(post)}
                      >
                        {/* 이미지 영역 */}
                        <div className="aspect-square bg-gray-100 overflow-hidden">
                          {post.files && post.files.length > 0 && post.files[0].type?.startsWith('image/') ? (
                            <img
                              src={post.files[0].url || (post.files[0].url ? post.files[0].url : '/placeholder-image.jpg')}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center ${post.files && post.files.length > 0 && post.files[0].type?.startsWith('image/') ? 'hidden' : ''}`}>
                            <div className="text-center">
                              <FontAwesomeIcon icon={faImage} className="h-12 w-12 text-gray-300 mb-2" />
                              <p className="text-sm text-gray-400">이미지 없음</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* 게시글 정보 */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 text-lg mb-2 group-hover:text-blue-600 transition-colors overflow-hidden" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            textOverflow: 'ellipsis'
                          }}>
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                            <span className="flex items-center">
                              <FontAwesomeIcon icon={faUser} className="h-3 w-3 mr-1" />
                              {post.author}
                            </span>
                            <span className="flex items-center">
                              <FontAwesomeIcon icon={faEye} className="h-3 w-3 mr-1" />
                              {post.views || 0}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {post.date} {post.time || ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon icon={faImage} className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg mb-2">아직 갤러리 게시글이 없습니다</p>
                    <p className="text-gray-400">첫 번째 이미지를 업로드해보세요!</p>
                  </div>
                )}
              </div>
            ) : (
              // 일반 게시판용 테이블 레이아웃
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 p-4 font-semibold text-gray-700">
                  <div className="col-span-1">번호</div>
                  <div className="col-span-6">제목</div>
                  <div className="col-span-2">작성자</div>
                  <div className="col-span-2">작성일</div>
                  <div className="col-span-1">조회</div>
                </div>
                
                {boardData && boardData.length > 0 ? (
                  boardData.map((post, index) => (
                    <div 
                      key={post.id} 
                      className="grid grid-cols-12 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleViewPost(post)}
                    >
                      <div className="col-span-1 text-gray-500">{boardData.length - index}</div>
                      <div className="col-span-5 font-medium text-gray-800">{post.title}</div>
                      <div className="col-span-2 text-gray-600">{post.author}</div>
                      <div className="col-span-2 text-gray-500">{post.date}</div>
                      <div className="col-span-1 text-gray-500">{post.views || 0}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>아직 게시글이 없습니다.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
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

  // activeTab 변경 시 selectedPost 초기화
  useEffect(() => {
    if (selectedPost) {
      setSelectedPost(null);
    }
  }, [activeTab]);

  const handleLogout = () => {
    // 슈퍼 관리자인 경우 슈퍼 관리자 로그아웃
    if (currentUser?.isSuperAdmin) {
      localStorage.removeItem('superAdmin');
      // 모든 프로젝트에서 슈퍼 관리자 로그인 상태 제거
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      projects.forEach(project => {
        localStorage.removeItem(`project_${project.id}_user`);
      });
      setCurrentUser(null);
      // 슈퍼 관리자는 로그아웃 후 현재 프로젝트 홈페이지에 머물
      // navigate() 호출하지 않음 - 현재 페이지에 머물
      return;
    }
    
    // 프로젝트별 사용자인 경우 프로젝트별 로그아웃 (현재 프로젝트에 머물)
    setCurrentUser(null);
    localStorage.removeItem(`project_${projectId}_user`);
    // 프로젝트 관리자는 로그아웃 후 현재 프로젝트 홈페이지에 머물
    // navigate() 호출하지 않음 - 현재 페이지에 머물
  };

  // 파일 크기 포맷 함수
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 파일 다운로드 함수
  const handleFileDownload = (file) => {
    try {
      if (file.url) {
        // URL이 있는 경우 (이미지 파일)
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // URL이 없는 경우 (일반 파일)
        alert('파일을 다운로드할 수 없습니다. 파일 정보가 불완전합니다.');
      }
    } catch (error) {
      console.error('파일 다운로드 오류:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  // 게시글 삭제 함수
  const handleDeletePost = (postToDelete) => {
    if (!postToDelete) return;
    
    const confirmMessage = `"${postToDelete.title}" 게시글을 삭제하시겠습니까?\n\n삭제된 게시글은 복구할 수 없습니다.`;
    
    if (confirm(confirmMessage)) {
      try {
        // localStorage에서 게시글 삭제
        const existingPosts = JSON.parse(localStorage.getItem(`project_${projectId}_posts`) || '{}');
        
        if (existingPosts[postToDelete.boardType]) {
          // 해당 게시판에서 해당 게시글 제거
          existingPosts[postToDelete.boardType] = existingPosts[postToDelete.boardType].filter(
            post => post.id !== postToDelete.id
          );
          
          // localStorage에 저장
          localStorage.setItem(`project_${projectId}_posts`, JSON.stringify(existingPosts));
          
          // 상태 업데이트
          setPosts(existingPosts);
          
          // 상세보기 모드에서 목록으로 돌아가기
          setSelectedPost(null);
          
          // 해당 게시글의 댓글도 삭제
          localStorage.removeItem(`project_${projectId}_comments_${postToDelete.id}`);
          
          alert('게시글이 삭제되었습니다.');
        }
      } catch (error) {
        console.error('게시글 삭제 오류:', error);
        alert('게시글 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 일반 페이지 렌더링
  const renderPageContent = (category) => {
    const canEdit = currentUser && 
                   (currentUser.role === 'project_admin' || currentUser.isSuperAdmin);

    return (
      <div className="space-y-6">
        {/* 페이지 제목 */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>
          
          {/* 수정하기 버튼 */}
          {canEdit && (
            <button
              onClick={() => {
                // 페이지 편집 모달 열기
                setPageEditor({ isOpen: true, category: category });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              페이지 수정하기
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="prose max-w-none" 
               dangerouslySetInnerHTML={{ __html: category.content || '<h1>페이지 내용이 없습니다.</h1>' }}>
          </div>
        </div>
      </div>
    );
  };

  const renderPostDetail = () => {
    if (!selectedPost) return null;

    const boardNames = {
      notice: '공지사항',
      free: '자유게시판',
      qna: '질문게시판',
      gallery: '갤러리게시판'
    };

    const canEdit = currentUser && (
      // 작성자 본인인 경우 (authorId 또는 username으로 확인)
      (selectedPost.authorId && String(currentUser.id) === String(selectedPost.authorId)) ||
      (currentUser.username === selectedPost.author) ||
      // 관리자인 경우
      currentUser.role === 'project_admin' ||
      currentUser.isSuperAdmin ||
      // 슈퍼 관리자인 경우
      currentUser.isSuperAdmin === true
    );

    // 디버깅을 위한 로그
    console.log('권한 확인:', {
      currentUser,
      selectedPost,
      canEdit,
      authorIdMatch: selectedPost.authorId && String(currentUser?.id) === String(selectedPost.authorId),
      usernameMatch: currentUser?.username === selectedPost.author,
      isAdmin: currentUser?.role === 'project_admin',
      isSuperAdmin: currentUser?.isSuperAdmin
    });

    return (
      <div className="space-y-6">
        {/* 뒤로가기 버튼 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedPost(null)}
            className="bg-white border border-gray-300 text-gray-700 px-3 pr-5 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center space-x-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>목록</span>
          </button>
          
          {/* 수정/삭제 버튼 */}
          {canEdit && (
            <div className="flex space-x-3">
              <button
                onClick={() => setPostEditor({ isOpen: true, boardType: selectedPost.boardType, post: selectedPost })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>수정하기</span>
              </button>
              <button
                onClick={() => handleDeletePost(selectedPost)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                <span>삭제하기</span>
              </button>
            </div>
          )}
        </div>

        {/* 게시글 상세 내용 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* 제목 및 메타 정보 */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{selectedPost.title}</h1>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>작성자: {selectedPost.author}</span>
                <span>작성일: {selectedPost.date}</span>
                <span>조회수: {selectedPost.views}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                  {boardNames[selectedPost.boardType]}
                </span>
                {selectedPost.category && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {selectedPost.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 내용 */}
          <div className="prose max-w-none">
            {selectedPost.boardType === 'gallery' && selectedPost.files && selectedPost.files.length > 0 && selectedPost.files[0].type?.startsWith('image/') ? (
              // 갤러리 게시판: 이미지를 가운데에 크게 표시
              <div className="mb-6">
                <div className="flex justify-center">
                  <div className="max-w-4xl w-full">
                    <img
                      src={selectedPost.files[0].url || '/placeholder-image.jpg'}
                      alt={selectedPost.title}
                      className="w-full h-auto rounded-lg shadow-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="hidden text-center py-8 bg-gray-100 rounded-lg">
                      <FontAwesomeIcon icon={faImage} className="h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-gray-500">이미지를 불러올 수 없습니다</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            
            <div className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
              {selectedPost.content}
            </div>
          </div>

          {/* 첨부파일 (있다면) */}
          {selectedPost.files && selectedPost.files.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">첨부파일</h3>
              <div className="space-y-2">
                {selectedPost.files.map((file, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {file.type?.startsWith('image/') ? (
                      <FontAwesomeIcon icon={faImage} className="h-5 w-5 text-pink-400" />
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    <span className="text-gray-700">{file.name}</span>
                    <span className="text-sm text-gray-500">({formatFileSize(file.size)})</span>
                    <button 
                      onClick={() => handleFileDownload(file)}
                      className="ml-auto bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      다운로드
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">댓글 ({comments.length})</h3>
          
          {/* 댓글 작성 폼 */}
          {currentUser ? (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 작성해주세요..."
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows="3"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleAddComment}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      댓글 작성
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl text-center">
              <p className="text-gray-600 mb-3">댓글을 작성하려면 로그인이 필요합니다.</p>
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                로그인하기
              </button>
            </div>
          )}

          {/* 댓글 목록 */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                  {editingComment === comment.id ? (
                    // 댓글 수정 모드
                    <div className="space-y-3">
                      <textarea
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows="3"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 댓글 표시 모드
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-gray-800">{comment.author}</span>
                            <span className="text-sm text-gray-500">
                              {comment.date} {comment.time}
                            </span>
                          </div>
                          {/* 댓글 수정/삭제 버튼 */}
                          {currentUser && (
                            currentUser.id === comment.authorId || 
                            currentUser.role === 'project_admin' || 
                            currentUser.isSuperAdmin
                          ) && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditComment(comment.id)}
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-sm text-red-600 hover:text-red-800 transition-colors"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>아직 댓글이 없습니다.</p>
                <p className="text-sm mt-1">첫 번째 댓글을 작성해보세요!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-lg py-2">
        <div className="max-w-[1400px] mx-auto sm:px-6 lg:px-8">
          {/* 상단 로고 및 프로젝트명 */}
          <div className="flex items-center justify-between h-16">
            {/* 왼쪽: 로고 및 프로젝트명 */}
            <div className="flex items-center space-x-3 w-[200px]">
              
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{projectInfo.name}</h1>
                <p className="text-sm text-gray-500">프로젝트 홈페이지</p>
              </div>
            </div>

            {/* 가운데: 네비게이션 메뉴 */}
            <nav className="flex flex-1 justify-center space-x-8">
              {dynamicTabs.map((tab, index) => (
                <React.Fragment key={tab.id}>
                  <button
                    onClick={() => {
                      // 탭 변경 시 게시글 상세보기 상태 초기화
                      if (selectedPost) {
                        setSelectedPost(null);
                      }
                      setActiveTab(tab.id);
                    }}
                    className={`py-4 px-6 border-b-2 font-bold text-lg transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-700 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.name}
                  </button>
                  {index < dynamicTabs.length - 1 && (
                    <div className="w-px bg-gray-200 h-8 self-center"></div>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* 오른쪽: 사용자 메뉴 및 로그인 */}
            <div className="flex items-center space-x-2">
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{currentUser.username}님!</span>
                  
                  {/* 프로필 관리 아이콘 */}
                  <button
                    onClick={handleOpenProfileManager}
                    className="text-gray-400 p-2 rounded-xl hover:text-blue-500 transition-colors"
                    title="프로필 관리"
                  >
                    <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                  </button>
                  
                  {/* 프로젝트 관리자인 경우에만 관리자 아이콘 표시 */}
                  {currentUser?.role === 'project_admin' && (
                    <>
                      <button
                        onClick={() => {
                          // 프로젝트 관리자로 로그인한 경우 해당 프로젝트의 관리 페이지로 이동
                          window.open(`/project/${projectId}/admin`, '_blank');
                        }}
                        className="text-gray-400 p-2 rounded-xl hover:text-purple-500 transition-colors"
                        title="프로젝트 관리"
                      >
                        <FontAwesomeIcon icon={faCog} className="h-4 w-4" />
                      </button>
                      
                    </>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="bg-gray-600  text-white px-2 py-1 rounded-xl hover:bg-gray-700 transition-colors text-xs"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                    className="text-gray-400 p-3 rounded-xl hover:text-blue-500 transition-colors"
                    title="로그인"
                  >
                    <img src="/i-login.svg" alt="로그인" className="h-5 w-5" />
                  </button>
                </div>
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
                  <div className="max-w-[1400px] mx-auto">
                    {selectedPost ? (
                      renderPostDetail()
                    ) : (
                      <>
                        {activeTab === 'home' && renderHomeTab()}
                        {activeTab !== 'home' && (() => {
                          // 먼저 boardType으로 카테고리 찾기
                          let category = categories.find(cat => cat.boardType === activeTab);
                          
                          // boardType으로 찾지 못한 경우, 카테고리명으로 찾기 (일반 페이지용)
                          if (!category) {
                            category = categories.find(cat => cat.name === activeTab);
                          }
                          
                          if (category && category.type === 'page') {
                            return renderPageContent(category);
                          } else if (category && category.type === 'board') {
                            return renderBoardTab(activeTab);
                          } else {
                            // 카테고리를 찾을 수 없는 경우 기본 게시판으로 처리
                            return renderBoardTab(activeTab);
                          }
                        })()}
                      </>
                    )}
                  </div>
                </main>

      {/* 사용자 인증 모달 */}
      {authModal.isOpen && (
        <UserAuth
          isOpen={authModal.isOpen}
          mode={authModal.mode}
          onClose={handleAuthClose}
          onSuccess={handleAuthSuccess}
          projectId={projectId}
          onModeSwitch={switchAuthMode}
        />
      )}

      {/* 글쓰기 모달 */}
      {postEditor.isOpen && (
        <PostEditor
          isOpen={postEditor.isOpen}
          boardType={postEditor.boardType}
          post={postEditor.post}
          onClose={handleClosePostEditor}
          onSave={handlePostSave}
          currentUser={currentUser}
          projectId={projectId}
        />
      )}

      {/* 프로필 관리 모달 */}
      {profileModal.isOpen && (
        <ProfileManager
          isOpen={profileModal.isOpen}
          onClose={handleCloseProfileManager}
          currentUser={currentUser}
          projectId={projectId}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* 페이지 편집 모달 */}
      {pageEditor.isOpen && (
        <PageEditor
          isOpen={pageEditor.isOpen}
          category={pageEditor.category}
          onClose={handleClosePageEditor}
          onSave={handlePageSave}
        />
      )}

      {/* 프로젝트 관리자 로그인 모달 */}
      {adminLoginModal.isOpen && (
        <ProjectAdminLogin
          projectId={projectId}
          projectName={projectInfo.name}
          onClose={() => setAdminLoginModal({ isOpen: false })}
          onLoginSuccess={handleAdminLoginSuccess}
        />
      )}

      {/* 푸터 */}
      <footer className="bg-gray-200 border-t border-gray-300 mt-10">
        <div className="max-w-[1400px] mx-auto  py-8">
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
