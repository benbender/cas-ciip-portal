import {useState} from 'react';
// Custom hook to handle form input changes
export const useInput = (initialValue, onChange) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(''),
    bind: {
      value,
      onChange: event => {
        setValue(event.target.value);
        if (onChange) onChange(event);
      }
    }
  };
};
