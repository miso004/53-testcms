import React from 'react';
import { Button as FlowbiteButton } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  type = 'button',
  icon = null,
  loading = false,
  ...props 
}) => {
  // Flowbite 색상 매핑
  const flowbiteColors = {
    primary: 'blue',
    secondary: 'gray',
    success: 'green',
    danger: 'red',
    warning: 'yellow',
    info: 'cyan',
    outline: 'gray',
    ghost: 'gray',
    link: 'blue'
  };
  
  const flowbiteSizes = {
    xs: 'xs',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl'
  };
  
  const color = flowbiteColors[variant] || 'blue';
  const sizeValue = flowbiteSizes[size] || 'md';
  
  return (
    <FlowbiteButton
      color={color}
      size={sizeValue}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading && (
        <div className="mr-2">
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      {icon && !loading && <FontAwesomeIcon icon={icon} className="mr-2" />}
      {children}
    </FlowbiteButton>
  );
};

export default Button;
