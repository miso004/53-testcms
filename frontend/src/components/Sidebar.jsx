import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ 
  items = [],
  isOpen = true,
  onToggle,
  className = '' 
}) => {
  const [activeItem, setActiveItem] = useState('');

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-base-300 bg-opacity-75 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* 사이드바 */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-base-100 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${className}
      `}>
        <div className="flex flex-col h-full">
          {/* 사이드바 헤더 */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-base-300">
            <h2 className="text-lg font-semibold text-base-content">메뉴</h2>
            <button
              onClick={onToggle}
              className="btn btn-ghost btn-sm btn-circle lg:hidden"
            >
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            </button>
          </div>

          {/* 메뉴 아이템들 */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`
                  btn btn-ghost w-full justify-start
                  ${activeItem === item.id ? 'btn-active' : ''}
                `}
              >
                {item.icon && (
                  <span className="mr-3">{item.icon}</span>
                )}
                {item.label}
                <FontAwesomeIcon icon={faChevronRight} className="ml-auto h-3 w-3" />
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
