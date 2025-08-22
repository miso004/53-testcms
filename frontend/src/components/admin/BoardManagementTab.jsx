import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye, 
  faSearch 
} from '@fortawesome/free-solid-svg-icons';






const BoardManagementTab = ({ 
  posts, 
  selectedPosts, 
  searchTerm, 
  setSearchTerm, 
  setSelectedPosts,
  handleEditPost,
  handleDeletePost,
  handleViewPost,
  handleBulkDelete,
  setPostEditorModal
}) => {
  const boardTypes = {
    notice: '공지사항',
    free: '자유게시판',
    qna: '질문게시판'
  };

  const filteredPosts = Object.entries(posts).flatMap(([boardType, boardPosts]) =>
    boardPosts
      .filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(post => ({ ...post, boardType }))
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPosts(filteredPosts.map(post => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (postId, checked) => {
    if (checked) {
      setSelectedPosts(prev => [...prev, postId]);
    } else {
      setSelectedPosts(prev => prev.filter(id => id !== postId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">📝 게시판 관리</h2>
        <button
          onClick={() => setPostEditorModal({ isOpen: true, post: null, boardType: null })}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          새 게시글 작성
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="게시글 제목, 작성자, 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {selectedPosts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-colors"
            >
              선택 삭제 ({selectedPosts.length})
            </button>
          )}
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 p-4 font-semibold text-gray-700">
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-3">제목</div>
          <div className="col-span-2">작성자</div>
          <div className="col-span-2">게시판</div>
          <div className="col-span-2">작성일</div>
          <div className="col-span-2">관리</div>
        </div>

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={`${post.boardType}-${post.id}`} className="grid grid-cols-12 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(post.id)}
                  onChange={(e) => handleSelectPost(post.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-3">
                <div className="font-medium text-gray-800">{post.title}</div>
                <div className="text-sm text-gray-500 mt-1">{post.content.substring(0, 50)}...</div>
              </div>
              <div className="col-span-2 text-gray-600">{post.author}</div>
              <div className="col-span-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  post.boardType === 'notice' ? 'bg-blue-100 text-blue-600' :
                  post.boardType === 'free' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {boardTypes[post.boardType]}
                </span>
              </div>
              <div className="col-span-2 text-gray-500">{post.date}</div>
              <div className="col-span-2 flex space-x-2">
                <button
                  onClick={() => handleViewPost(post)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faEye} className="mr-1" />
                  보기
                </button>
                <button
                  onClick={() => handleEditPost(post)}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-1" />
                  편집
                </button>
                <button
                  onClick={() => handleDeletePost(post.id, post.boardType)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1" />
                  삭제
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardManagementTab;
