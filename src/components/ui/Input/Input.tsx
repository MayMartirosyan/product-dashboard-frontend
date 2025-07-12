import React from 'react';
import './Input.scss';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  error?: string;
  accept?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  error,
  accept,
}) => {
  return (
    <div className="input-container">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        accept={accept}
        onChange={onChange}
        name={name}
        className={`input ${error ? 'input--error' : ''}`}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};
