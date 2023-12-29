import React from 'react';
import styles from './Button.module.scss';

type Props = {
    children:React.ReactNode,
    buttonType:number,
    onClick?:()=>void,
    type?: 'button' | 'submit' | 'reset';
}

const Button:React.FC<Props> = ({children,buttonType, type = 'button',onClick}) =>{
  let classType ;
  switch(buttonType){
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
    <button className={`${styles.button} ${classType}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;