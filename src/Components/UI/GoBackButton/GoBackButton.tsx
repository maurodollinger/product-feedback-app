import React from 'react';
import styles from './GoBackButton.module.scss';
import {ReactComponent as IconLeft } from '../../../assets/shared/icon-arrow-left.svg';
import { useNavigate } from 'react-router-dom';


const GoBackButton:React.FC = () =>{
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <button className={styles.goBackButton} onClick={handleGoBack}>
      <IconLeft/>
        Go Back
    </button>
  );
};

export default GoBackButton;