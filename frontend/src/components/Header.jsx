import React, { useState } from 'react';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';

const Header = ({ 
  title = 'CMS 시스템',
  onLogout,
  user = null,
  className = '' 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`navbar bg-base-100 shadow-sm border-b border-base-300 ${className}`}>
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="h-5 w-5" />
          </div>
          {isMobileMenuOpen && (
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              {user && (
                <li>
                  <div className="flex items-center gap-2 p-2">
                    <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                    <span className="text-sm">{user.name}님 환영합니다</span>
                  </div>
                </li>
              )}
              {user && (
                <li>
                  <button onClick={onLogout} className="btn btn-outline btn-sm w-full">
                    로그아웃
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-base-content">{title}</h1>
        </div>
      </div>

      <div className="navbar-end">
        <div className="hidden lg:flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-base-content/70" />
                <span className="text-sm text-base-content/70">
                  {user.name}님 환영합니다
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout}
              >
                로그아웃
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
