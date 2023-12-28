import React  from 'react';
import styles from './Dropdown.module.scss';
import { DropdownItem } from '../../../models/types';
import { ReactComponent as IconCheck } from '../../../assets/shared/icon-check.svg';

type Props = {
    items:DropdownItem[],
    clickOnItem: (updatedList: DropdownItem[], id:number) => void;
}

const Dropdown: React.FC<Props> = ({items, clickOnItem}) =>{

  const handleClick = (id:number) =>{
    const updatedList = items.map((item) =>
      item.id === id ? { ...item, selected: true } : { ...item, selected: false }
    );

    clickOnItem(updatedList, id);
  };
  
  return(
    <ul className={styles.dropdown}>
      {items.map((i)=>(
        <li key={i.id} onClick={()=>handleClick(i.id)}> 
          {i.label}
          {i.selected && <IconCheck/>}
        </li>
      ))}
    </ul>
  );
};

export default Dropdown;