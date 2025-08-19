import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faSearch, 
  faUserCog 
} from '@fortawesome/free-solid-svg-icons';

const UserManagementTab = ({ 
  users, 
  searchTerm, 
  setSearchTerm, 
  selectedUsers, 
  setSelectedUsers,
  handleAddUser,
  handleEditUser,
  handleDeleteUser,
  handleBulkDelete,
  setUserModal
}) => {
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">👥 사용자 관리</h2>
        <button
          onClick={() => setUserModal({ isOpen: true, user: null, mode: 'add' })}
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          새 사용자 추가
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
                placeholder="사용자명 또는 이메일로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {selectedUsers.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-colors"
            >
              선택 삭제 ({selectedUsers.length})
            </button>
          )}
        </div>
      </div>

      {/* 사용자 목록 */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 p-4 font-semibold text-gray-700">
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-2">사용자명</div>
          <div className="col-span-3">이메일</div>
          <div className="col-span-2">역할</div>
          <div className="col-span-2">가입일</div>
          <div className="col-span-2">관리</div>
        </div>

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className="grid grid-cols-12 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUserCog} className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-800">{user.username}</span>
                </div>
              </div>
              <div className="col-span-3 text-gray-600">{user.email}</div>
              <div className="col-span-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'project_admin' ? 'bg-purple-100 text-purple-600' :
                  user.role === 'super_admin' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {user.role === 'project_admin' ? '프로젝트 관리자' :
                   user.role === 'super_admin' ? '슈퍼 관리자' :
                   '일반 사용자'}
                </span>
              </div>
              <div className="col-span-2 text-gray-500">
                {new Date(user.createdAt).toLocaleDateString('ko-KR')}
              </div>
              <div className="col-span-2 flex space-x-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-1" />
                  편집
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
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
            {searchTerm ? '검색 결과가 없습니다.' : '사용자가 없습니다.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementTab;
