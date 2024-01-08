import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Card from '../Card/Card';
import Button from '../Button/Button';

interface LogProps {
    message:string;
    logType:string;
  onClose: () => void;
}

const Log: React.FC<LogProps> = ({ message,logType,onClose }) => {
  useEffect(()=>{
    const timeoutId = setTimeout(()=>{
      onClose();
    },3000);

    return () => {
      clearTimeout(timeoutId);
    };
  },[onClose]);

  return ReactDOM.createPortal(
    <Card className={`log ${logType}`}>
      <p>{message}</p>
      <Button buttonType={(logType==='error') ? 4 : 2} onClick={onClose}>Close</Button>
    </Card>,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.getElementById('log')!
  );
};

export default Log;
