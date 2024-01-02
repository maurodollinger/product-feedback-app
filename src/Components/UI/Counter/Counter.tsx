import React from 'react';
import styles from './Counter.module.scss';
import {ReactComponent as IconArrow } from '../../../assets/shared/icon-arrow-up.svg';

type Props = {
    upvotes:number
    disabled?:boolean,
    horizontal?:boolean,
    onMouseOver?: () => void;
    onMouseLeave?: () => void;
    onCounterClick: (e:React.MouseEvent) => void;
}

const Counter:React.FC<Props> = ({upvotes, disabled=false, horizontal=false, onMouseOver, onMouseLeave, onCounterClick}) =>{

  const handleMouseOver = () => {
    if (onMouseOver) {
      onMouseOver(); 
    }
  };

  const handleMouseLeave = () => {
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  return(
    <div className={`${styles.counter} ${disabled ? styles.disabled : ''} ${horizontal ? styles.horizontal : ''}`}  
      onMouseOver={handleMouseOver} 
      onMouseLeave={handleMouseLeave} 
      onClick={onCounterClick}>
      <div>
        <IconArrow/>
      </div>
      <span>{upvotes}</span>
    </div>);
};

export default Counter;