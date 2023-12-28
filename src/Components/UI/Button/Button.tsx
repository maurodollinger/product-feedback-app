import React from 'react';
import styles from './Button.module.scss';

type Props = {
    children:React.ReactNode,
    type:number
}

const Button:React.FC<Props> = ({children,type}) =>{
  let classType ;
  switch(type){
  case 1:
    classType = styles.typeOne;
    break;
  case 2:
    classType = styles.typeTwo;
    break;
  case 3:
    classType = styles.typeThree;
    break;
  case 4:
    classType = styles.typeFour;
    break;
  }
  return(
    <button className={`${styles.button} ${classType}`}>
      {children}
    </button>
  );
};

export default Button;