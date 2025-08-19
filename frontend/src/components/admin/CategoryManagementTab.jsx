import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';

const CategoryManagementTab = ({ 
  categories, 
  handleAddCategory, 
  handleEditCategory, 
  handleDeleteCategory,
  handleMoveCategory,
  setCategoryModal 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">📂 카테고리 관리</h2>
        <button
          onClick={handleAddCategory}
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          새 카테고리 추가
        </button>
      </div>

      {/* 카테고리 목록 */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 p-4 font-semibold text-center text-gray-700">
          <div className="col-span-1">ID</div>
          <div className="col-span-2">카테고리명</div>
          <div className="col-span-2">타입</div>
          <div className="col-span-1">세부 정보</div>
          <div className="col-span-2">순서</div>
          <div className="col-span-4">관리</div>
        </div>
        
        {categories.map((category, index) => (
          <div key={category.id} className="grid grid-cols-12 p-4 border-b text-center border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="col-span-1 text-gray-500">{category.id}</div>
            <div className="col-span-2 font-medium text-gray-800">{category.name}</div>
            <div className="col-span-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                category.type === 'page' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {category.type === 'page' ? '일반 페이지' : '게시판'}
              </span>
            </div>
            <div className="col-span-1">
              {category.type === 'page' ? (
                <span className="text-sm text-gray-600">페이지</span>
              ) : (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  category.boardType === 'notice' ? 'bg-blue-100 text-blue-600' :
                  category.boardType === 'free' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {category.boardType === 'notice' ? '공지사항' :
                   category.boardType === 'free' ? '자유게시판' :
                   '질문게시판'}
                </span>
              )}
            </div>
            <div className="col-span-2 flex space-x-1 justify-center">
              <button 
                onClick={() => handleMoveCategory(category.id, 'up')}
                disabled={index === 0}
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                  index === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="위로 이동"
              >
                <FontAwesomeIcon icon={faArrowUp} className="h-3 w-3" />
              </button>
              <button 
                onClick={() => handleMoveCategory(category.id, 'down')}
                disabled={index === categories.length - 1}
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                  index === categories.length - 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="아래로 이동"
              >
                <FontAwesomeIcon icon={faArrowDown} className="h-3 w-3" />
              </button>
            </div>
            <div className="col-span-4 flex space-x-2 justify-center">
              <button 
                onClick={() => handleEditCategory(category)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-1" />
                편집
              </button>
              <button 
                onClick={() => handleDeleteCategory(category.id)}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-1" />
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagementTab;
