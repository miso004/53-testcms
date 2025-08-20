// 권한 체크 유틸리티 함수들

// 슈퍼 관리자 권한 확인
export const isSuperAdmin = () => {
  try {
    const superAdmin = localStorage.getItem('superAdmin');
    if (superAdmin) {
      const adminData = JSON.parse(superAdmin);
      return adminData.username && adminData.loginTime;
    }
    return false;
  } catch (error) {
    console.error('슈퍼 관리자 권한 확인 오류:', error);
    return false;
  }
};

// 프로젝트 관리자 권한 확인
export const isProjectAdmin = (projectId) => {
  try {
    const savedUser = localStorage.getItem(`project_${projectId}_user`);
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user.role === 'project_admin';
    }
    return false;
  } catch (error) {
    console.error('프로젝트 관리자 권한 확인 오류:', error);
    return false;
  }
};

// 특정 프로젝트에 대한 관리 권한 확인
export const hasProjectManagementPermission = (projectId) => {
  // 슈퍼 관리자이거나 해당 프로젝트의 관리자인 경우
  return isSuperAdmin() || isProjectAdmin(projectId);
};

// 프로젝트 생성/삭제 권한 확인 (슈퍼 관리자만)
export const hasProjectCreationPermission = () => {
  return isSuperAdmin();
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = (projectId = null) => {
  try {
    // 슈퍼 관리자 확인
    const superAdmin = localStorage.getItem('superAdmin');
    if (superAdmin) {
      const adminData = JSON.parse(superAdmin);
      return {
        ...adminData,
        role: 'super_admin',
        isSuperAdmin: true
      };
    }

    // 프로젝트 관리자 확인
    if (projectId) {
      const savedUser = localStorage.getItem(`project_${projectId}_user`);
      if (savedUser) {
        const user = JSON.parse(savedUser);
        return {
          ...user,
          isSuperAdmin: false
        };
      }
    }

    return null;
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    return null;
  }
};

