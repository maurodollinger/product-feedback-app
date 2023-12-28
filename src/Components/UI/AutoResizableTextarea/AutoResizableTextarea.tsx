import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import styles from './AutoResizableTextarea.module.scss';  

const MAX_CHARACTERS = 250;

type Props = {
  onCharactersRemainingChange?: (charactersRemaining: number) => void;
};

const AutoResizableTextarea: React.FC<Props> = ({ onCharactersRemainingChange }) => {
  const [value, setValue] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    if (newValue.length <= MAX_CHARACTERS) {
      setValue(newValue);
      autoResizeTextarea();
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };


  const charactersRemaining = MAX_CHARACTERS - value.length;

  useEffect(() => {
    if (onCharactersRemainingChange) {
      onCharactersRemainingChange(charactersRemaining);
    }
  }, [charactersRemaining, onCharactersRemainingChange]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleInputChange}
      placeholder='Type your comment here'
      className={styles.textarea}  
    />
  );
};

export default AutoResizableTextarea;
