import React from 'react';
import { Card as FlowbiteCard } from 'flowbite-react';

const Card = ({ 
  children, 
  title,
  subtitle,
  className = '',
  padding = 'p-6',
  shadow = 'shadow-lg',
  bordered = true,
  ...props 
}) => {
  return (
    <FlowbiteCard className={`${shadow} ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          )}
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
      )}
      <div className={padding}>
        {children}
      </div>
    </FlowbiteCard>
  );
};

export default Card;
