import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import styles from './AutoResizableTextarea.module.scss';  

const MAX_CHARACTERS = 250;

type Props = {
  onCharactersRemainingChange?: (charactersRemaining: number) => void;
  id?:string;
  name?:string;
  onChange?:(e: string | ChangeEvent<any>)=>void;
  onBlur?:(e: string | ChangeEvent<any>)=>void;
  value?:string;
  className?:string;
};

const AutoResizableTextarea: React.FC<Props> = ({ onCharactersRemainingChange, id, name, value = '', onChange, onBlur, className }) => {
  const [_value, setValue] = useState<string>(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    if (newValue.length <= MAX_CHARACTERS) {
      setValue(newValue);
      autoResizeTextarea();
    }
    if(onChange) onChange(event);
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };


  const charactersRemaining = MAX_CHARACTERS - _value.length;

  useEffect(() => {
    if (onCharactersRemainingChange) {
      onCharactersRemainingChange(charactersRemaining);
    }
  }, [charactersRemaining, onCharactersRemainingChange]);

  return (
    <textarea
      id={id}
      name={name}
      ref={textareaRef}
      value={_value}
      onChange={handleInputChange}
      onBlur={onBlur}
      placeholder='Type your comment here'
      className={`${styles.textarea} ${className}`}  
    />
  );
};

export default AutoResizableTextarea;
