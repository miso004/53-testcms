import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faSave, 
  faEye, 
  faEyeSlash,
  faImage,
  faFile
} from '@fortawesome/free-solid-svg-icons';

const PostEditor = ({ 
  isOpen, 
  onClose, 
  onSave, 
  post = null, // 편집 시 기존 게시글 데이터
  boardType, // 게시판 타입 (notice, free, qna)
  currentUser,
  projectId
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    isPublic: true
  });
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [files, setFiles] = useState([]);

  // 게시판 타입별 제목
  const boardNames = {
    notice: '공지사항',
    free: '자유게시판',
    qna: '질문게시판',
    gallery: '갤러리게시판'
  };

  // 카테고리 옵션
  const categoryOptions = {
    notice: [
      { value: 'general', label: '일반' },
      { value: 'important', label: '중요' },
      { value: 'update', label: '업데이트' }
    ],
    free: [
      { value: 'general', label: '일반' },
      { value: 'info', label: '정보공유' },
      { value: 'hobby', label: '취미' }
    ],
    qna: [
      { value: 'general', label: '일반' },
      { value: 'technical', label: '기술' },
      { value: 'usage', label: '사용법' }
    ],
    gallery: [
      { value: 'general', label: '일반' },
      { value: 'photo', label: '사진' },
      { value: 'art', label: '예술' },
      { value: 'design', label: '디자인' }
    ]
  };

  useEffect(() => {
    if (post) {
      // 편집 모드 또는 보기 모드: 기존 데이터로 폼 초기화
      setFormData({
        title: post.title || '',
        content: post.content || '',
        category: post.category || 'general',
        isPublic: post.isPublic !== false
      });
      
      // 기존 파일 정보 로드
      if (post.files && Array.isArray(post.files)) {
        // 파일 정보가 있으면 그대로 사용 (수정 모드)
        setFiles(post.files);
      } else {
        setFiles([]);
      }
      
      // 편집 권한 확인: 작성자 본인, 프로젝트 관리자, 슈퍼 관리자
      let canEdit = false;
      
      if (currentUser) {
        // 작성자 본인 확인
        if (post.authorId) {
          canEdit = String(currentUser.id) === String(post.authorId);
        }
        // username으로도 확인 (fallback)
        if (!canEdit && currentUser.username === post.author) {
          canEdit = true;
        }
        // 프로젝트 관리자 또는 슈퍼 관리자 확인
        if (!canEdit && (currentUser.role === 'project_admin' || currentUser.isSuperAdmin)) {
          canEdit = true;
        }
      }
      
      // 편집 모드일 때만 보기 모드로 설정하지 않음
      setIsViewMode(false);
    } else {
      // 새 글 작성 모드: 폼 초기화
      setFormData({
        title: '',
        content: '',
        category: 'general',
        isPublic: true
      });
      setFiles([]);
      setIsViewMode(false);
    }
  }, [post, currentUser]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // 갤러리 게시판인 경우 이미지 파일만 허용
    if (boardType === 'gallery') {
      const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
      const nonImageFiles = selectedFiles.filter(file => !file.type.startsWith('image/'));
      
      if (nonImageFiles.length > 0) {
        alert('갤러리 게시판에는 이미지 파일만 업로드할 수 있습니다.');
      }
      
      if (imageFiles.length > 0) {
        setFiles(prev => [...prev, ...imageFiles]);
      }
    } else {
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 보기 모드일 때는 저장하지 않음
    if (isViewMode) {
      onClose();
      return;
    }
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const newPost = {
        id: post ? post.id : Date.now(),
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        author: currentUser.username,
        authorId: currentUser.id,
        date: new Date().toISOString().split('T')[0],
        views: post ? post.views : 0,
        isPublic: formData.isPublic,
        boardType: boardType,
        projectId: projectId,
        createdAt: post ? post.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        files: files.map(file => {
          // 이미 저장된 파일인 경우 (url이 있는 경우)
          if (file.url) {
            return file;
          }
          // 새로 업로드된 파일인 경우
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            url: file.type?.startsWith('image/') && file instanceof File ? URL.createObjectURL(file) : null
          };
        })
      };

      // localStorage에 저장
      const existingPosts = JSON.parse(localStorage.getItem(`project_${projectId}_posts`) || '{}');
      if (!existingPosts[boardType]) {
        existingPosts[boardType] = [];
      }

      if (post) {
        // 편집 모드: 기존 게시글 업데이트
        const postIndex = existingPosts[boardType].findIndex(p => p.id === post.id);
        if (postIndex !== -1) {
          existingPosts[boardType][postIndex] = { ...existingPosts[boardType][postIndex], ...newPost };
        }
      } else {
        // 새 글 작성 모드: 새 게시글 추가
        existingPosts[boardType].unshift(newPost);
      }

      localStorage.setItem(`project_${projectId}_posts`, JSON.stringify(existingPosts));

      // 콜백 호출
      if (onSave) {
        onSave(newPost);
      }

      onClose();
      alert(post ? '게시글이 수정되었습니다!' : '게시글이 작성되었습니다!');
    } catch (error) {
      console.error('게시글 저장 오류:', error);
      alert('게시글 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
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
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r p-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 ">
            <div className="flex items-center space-x-3 ">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faFile} className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isViewMode ? '게시글 보기' : post ? '게시글 수정' : '새 게시글 작성'} - {boardNames[boardType]}
                {boardType === 'gallery' && <span className="text-pink-600 ml-2">📸</span>}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4 text-gray-800" />
            </button>
          </div>
        </div>

        {/* 폼 */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="게시글 제목을 입력하세요"
                required
                disabled={isViewMode}
              />
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                disabled={isViewMode}
              >
                {categoryOptions[boardType]?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={12}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                  isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="게시글 내용을 입력하세요"
                required
                disabled={isViewMode}
              />
            </div>

            {/* 설정 */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isViewMode}
                />
                <span className="text-sm text-gray-700">공개 게시글</span>
              </label>
            </div>

            {/* 파일 업로드 및 표시 */}
            {(files.length > 0 || !isViewMode) && (
              <div>
                {!isViewMode && (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {boardType === 'gallery' ? '이미지 업로드' : '첨부파일'}
                      {boardType === 'gallery' && <span className="text-blue-600 ml-2">(갤러리 게시판은 이미지 중심으로 작성해주세요)</span>}
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  boardType === 'gallery' 
                    ? 'border-pink-300 hover:border-pink-400 bg-pink-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept={boardType === 'gallery' ? ".jpg,.jpeg,.png,.gif,.webp" : ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-2">
                      <FontAwesomeIcon 
                        icon={boardType === 'gallery' ? faImage : faFile} 
                        className={`h-8 w-8 ${boardType === 'gallery' ? 'text-pink-400' : 'text-gray-400'}`} 
                      />
                      <span className={`${boardType === 'gallery' ? 'text-pink-700' : 'text-gray-600'}`}>
                        {boardType === 'gallery' ? '이미지를 선택하거나 여기로 드래그하세요' : '파일을 선택하거나 여기로 드래그하세요'}
                      </span>
                      <span className={`text-sm ${boardType === 'gallery' ? 'text-pink-600' : 'text-gray-500'}`}>
                        {boardType === 'gallery' 
                          ? 'JPG, PNG, GIF, WebP 이미지 파일 (갤러리 전용)' 
                          : 'PDF, DOC, 이미지 파일 등 (최대 10MB)'
                        }
                      </span>
                    </div>
                  </label>
                </div>
                  </>
                )}
                
                {/* 업로드된 파일 목록 */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      {boardType === 'gallery' ? '업로드된 이미지:' : '첨부된 파일:'}
                    </h4>
                    {boardType === 'gallery' ? (
                      // 갤러리 게시판용 이미지 그리드 레이아웃
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {files.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                              {file.type?.startsWith('image/') ? (
                                <img
                                  src={file.url || (file instanceof File ? URL.createObjectURL(file) : '')}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.querySelector('.image-error')?.classList.remove('hidden');
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FontAwesomeIcon icon={faFile} className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                              <div className="hidden image-error w-full h-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faImage} className="h-8 w-8 text-gray-400" />
                              </div>
                            </div>
                            {!isViewMode && (
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                  title="삭제"
                                >
                                  <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                            <div className="mt-2 text-center">
                              <p className="text-xs text-gray-600 truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">({formatFileSize(file.size || 0)})</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // 일반 게시판용 리스트 레이아웃
                      files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {file.type?.startsWith('image/') ? (
                              <FontAwesomeIcon icon={faImage} className="h-4 w-4 text-pink-400" />
                            ) : (
                              <FontAwesomeIcon icon={faFile} className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(file.size || 0)})</span>
                          </div>
                          {!isViewMode && (
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              삭제
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 미리보기/편집 전환 */}
            {!isViewMode && (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={showPreview ? faEyeSlash : faEye} className="h-4 w-4" />
                  <span>{showPreview ? '편집 모드' : '미리보기'}</span>
                </button>
              </div>
            )}


            {/* 미리보기 */}
            {showPreview && !isViewMode && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">미리보기</h3>
                <div className="bg-white rounded-lg p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">{formData.title}</h2>
                  <div className="text-sm text-gray-500 mb-4">
                    작성자: {currentUser?.username} | 카테고리: {categoryOptions[boardType]?.find(c => c.value === formData.category)?.label}
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {formData.content}
                  </div>
                </div>
              </div>
            )}

            {/* 버튼들 */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {isViewMode ? '닫기' : '취소'}
              </button>
              {!isViewMode && (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      저장 중...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faSave} className="mr-2" />
                      {post ? '수정하기' : '작성하기'}
                    </div>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
