import React, { useState } from 'react';
import styles from './HamburguerIcon.module.scss'; // Asegúrate de importar tus estilos correctamente

type Props = {
  handleOnClick: (isActive:boolean)=>void
}

const HamburguerIcon:React.FC<Props> = ({handleOnClick}) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    handleOnClick(!isActive);
  };

  return (
    <div className={styles.hamburguer}>
      <div className={`menu-icon ${isActive ? 'active' : ''}`} id="menuIcon" onClick={handleClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17" fill="none">
          <rect className="top-rect" width="20" height="3" fill="white"/>
          <rect className="middle-rect" y="7" width="20" height="3" fill="white"/>
          <rect className="bottom-rect" y="14" width="20" height="3" fill="white"/>
        </svg>
      </div>
    </div>
  );
};

export default HamburguerIcon;
