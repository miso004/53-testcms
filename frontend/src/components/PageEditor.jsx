import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faSave, 
  faEye, 
  faEdit,
  faCode
} from '@fortawesome/free-solid-svg-icons';

const PageEditor = ({ 
  isOpen, 
  category, 
  onClose, 
  onSave 
}) => {
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setContent(category.content || '');
    }
  }, [category]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedCategory = {
        ...category,
        content: content
      };
      await onSave(updatedCategory);
    } catch (error) {
      console.error('페이지 저장 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 모달 */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl mx-auto overflow-hidden transform transition-all duration-300 scale-100">
        {/* 헤더 */}
        <div className=" p-6 text-gray-800 border-b border-gray-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <FontAwesomeIcon icon={faCode} className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {category.name} 페이지 편집
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  HTML을 사용하여 페이지 내용을 편집하세요
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-200 backdrop-blur-sm border border-white/30 hover:scale-110"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 편집 도구 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setIsPreview(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !isPreview 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                편집 모드
              </button>
              <button
                onClick={() => setIsPreview(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isPreview 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                미리보기
              </button>
            </div>
            
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  저장 중...
                </div>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  저장하기
                </>
              )}
            </button>
          </div>
        </div>

        {/* 편집 영역 */}
        <div className="p-6">
          {!isPreview ? (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                HTML 내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-96 p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 font-mono text-sm resize-none"
                placeholder="HTML 코드를 입력하세요. 예: <h1>제목</h1><p>내용</p>"
              />
              <div className="text-sm text-gray-500">
                <p>💡 HTML 태그를 사용하여 페이지를 꾸밀 수 있습니다.</p>
                <p>💡 &lt;h1&gt;, &lt;p&gt;, &lt;img&gt;, &lt;div&gt; 등의 태그를 사용하세요.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                미리보기
              </label>
              <div className="w-full h-96 p-6 border-2 border-gray-200 rounded-2xl bg-gray-50 overflow-auto">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400">내용이 없습니다.</p>' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
