import React from 'react';
import styles from './Card.module.scss';

type Props = {
  children?: React.ReactNode,
  className?: string
  onClick?:()=>void
};

const Card: React.FC<Props> = (props) =>{
  return(
    <div className={`${styles.card} ${props.className}`} onClick={props.onClick}>
      {props.children}
    </div>
  );
};

export default Card;