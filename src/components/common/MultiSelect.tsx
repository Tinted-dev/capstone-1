import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface Option {
  value: number;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  options: Option[];
  selectedValues: number[];
  onChange: (selectedValues: number[]) => void;
  error?: string;
}

function MultiSelect({
  label,
  options,
  selectedValues,
  onChange,
  error
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter(option =>
    selectedValues.includes(option.value)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (value: number) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const removeOption = (value: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter(v => v !== value));
  };

  return (
    <div className="mb-4 relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div 
        className={`bg-white dark:bg-gray-700 border ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } rounded-md px-3 py-2 min-h-10 cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map(option => (
              <div 
                key={option.value}
                className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white text-sm rounded-full px-3 py-1 flex items-center"
              >
                {option.label}
                <button 
                  onClick={(e) => removeOption(option.value, e)} 
                  className="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">Select options</div>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-700 shadow-lg max-h-60 overflow-auto border border-gray-200 dark:border-gray-600">
          {options.map(option => (
            <div
              key={option.value}
              className={`px-4 py-2 text-sm cursor-pointer ${
                selectedValues.includes(option.value) 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              onClick={() => toggleOption(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiSelect;