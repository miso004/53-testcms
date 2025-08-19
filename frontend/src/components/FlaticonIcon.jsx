import React from 'react';

const FlaticonIcon = ({ 
  icon, 
  size = '1em', 
  className = '', 
  style = {},
  onClick,
  title
}) => {
  const iconClass = `fi fi-${icon}`;
  
  return (
    <i 
      className={iconClass}
      style={{ 
        fontSize: size,
        ...style 
      }}
      className={`${iconClass} ${className}`}
      onClick={onClick}
      title={title}
    />
  );
};

export default FlaticonIcon;

