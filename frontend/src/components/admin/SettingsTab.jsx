import React from 'react';

const SettingsTab = ({ 
  projectSettings, 
  handleProjectSettingsChange, 
  handleSaveProjectSettings 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">⚙️ 프로젝트 설정</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 기본 정보 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 기본 정보</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">프로젝트명</label>
              <input
                type="text"
                value={projectSettings.name || ''}
                onChange={(e) => handleProjectSettingsChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="프로젝트명을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
              <textarea
                value={projectSettings.description || ''}
                onChange={(e) => handleProjectSettingsChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="프로젝트에 대한 설명을 입력하세요"
              />
            </div>
            <button
              onClick={handleSaveProjectSettings}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              설정 저장
            </button>
          </div>
        </div>

        {/* 시스템 정보 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🔧 시스템 정보</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">프로젝트 ID</span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">PROJ_001</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">생성일</span>
              <span className="text-gray-800">2024-01-15</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">마지막 수정일</span>
              <span className="text-gray-800">2024-01-15</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">상태</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">활성</span>
            </div>
          </div>
        </div>
      </div>

      {/* 고급 설정 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">⚡ 고급 설정</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoBackup"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="autoBackup" className="text-gray-700">자동 백업</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="emailNotifications"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="emailNotifications" className="text-gray-700">이메일 알림</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="maintenanceMode"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="maintenanceMode" className="text-gray-700">유지보수 모드</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
