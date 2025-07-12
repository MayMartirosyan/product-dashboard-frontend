import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.scss';
import { enGB } from 'date-fns/locale'; 

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder: string;
  error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  placeholder,
  error,
}) => {
  return (
    <div className="date-picker-container">
      <ReactDatePicker
        selected={selected && !isNaN(selected.getTime()) ? selected : null}
        onChange={onChange}
        dateFormat="yyyy-MM-dd"
        placeholderText={placeholder}
        className={`date-picker ${error ? 'date-picker-error' : ''}`}
        showYearDropdown
        yearDropdownItemNumber={100}
        scrollableYearDropdown
        maxDate={new Date()} 
        locale={enGB}
      />
      {error && <span className="date-picker-error-message">{error}</span>}
    </div>
  );
};