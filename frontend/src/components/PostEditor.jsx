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
    qna: '질문게시판'
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
      if (post.files) {
        setFiles(post.files);
      } else {
        setFiles([]);
      }
      
      // 글 보기 시에는 항상 보기 모드로 설정 (편집 불가)
      // 로그인한 사용자이고 본인이 작성한 글인 경우에만 편집 모드로 변경 가능
      let canEdit = false;
      
      if (currentUser && post.authorId) {
        // ID 비교 (문자열로 변환하여 비교)
        canEdit = String(currentUser.id) === String(post.authorId) || currentUser.username === post.author;
      }
      
      setIsViewMode(!canEdit);
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
    setFiles(prev => [...prev, ...selectedFiles]);
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
        files: files.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        }))
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

            {/* 파일 업로드 */}
            {!isViewMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  첨부파일
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-2">
                      <FontAwesomeIcon icon={faFile} className="h-8 w-8 text-gray-400" />
                      <span className="text-gray-600">파일을 선택하거나 여기로 드래그하세요</span>
                      <span className="text-sm text-gray-500">PDF, DOC, 이미지 파일 등 (최대 10MB)</span>
                    </div>
                  </label>
                </div>
                
                {/* 업로드된 파일 목록 */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">첨부된 파일:</h4>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FontAwesomeIcon icon={faFile} className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
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

            {/* 보기 모드에서 편집 모드로 전환 */}
            {isViewMode && currentUser && post && (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    // 편집 모드로 전환
                    if (String(currentUser.id) === String(post.authorId) || currentUser.username === post.author) {
                      setIsViewMode(false);
                    } else {
                      alert('본인이 작성한 글만 수정할 수 있습니다.');
                    }
                  }}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faSave} className="h-4 w-4" />
                  <span>편집하기</span>
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
