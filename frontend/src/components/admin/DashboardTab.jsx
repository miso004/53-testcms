import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faNewspaper, 
  faUsers, 
  faChartLine, 
  faFileAlt 
} from '@fortawesome/free-solid-svg-icons';

const DashboardTab = ({ projectInfo, stats }) => {
  return (
    <div className="space-y-8">
      {/* 환영 메시지 */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {projectInfo?.name} 관리자 대시보드 🎯
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          프로젝트를 체계적으로 관리하고 모니터링하세요
        </p>
      </div>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faNewspaper} className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">{stats.totalBoards}</div>
              <div className="text-blue-600 text-sm">전체 게시판</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">{stats.totalUsers}</div>
              <div className="text-green-600 text-sm">전체 사용자</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faFileAlt} className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">{stats.totalPosts}</div>
              <div className="text-purple-600 text-sm">전체 게시글</div>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FontAwesomeIcon icon={faChartLine} className="mr-2 text-blue-600" />
          최근 활동
        </h3>
        <div className="space-y-4">
          {stats.recentPosts.length > 0 ? (
            stats.recentPosts.map((post, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faNewspaper} className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{post.title}</p>
                    <p className="text-sm text-gray-500">{post.author} • {post.date}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">{post.boardType}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">아직 활동이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
