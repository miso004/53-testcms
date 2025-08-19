import React from 'react';
import { TextInput, Label } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Input = ({ 
  label,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  error = '',
  required = false,
  disabled = false,
  className = '',
  icon = null,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <div className="mb-2">
          <Label htmlFor={props.id || `input-${label}`} className="font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        </div>
      )}
      
      <div className="relative">
        <TextInput
          id={props.id || `input-${label}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          color={error ? 'failure' : 'gray'}
          helperText={error}
          className={className}
          {...props}
        />
        
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={icon} className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
