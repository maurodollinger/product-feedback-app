import React, { useContext, useState } from 'react';
import styles from './Suggestion.module.scss';
import Button from '../UI/Button/Button';
import { ReactComponent as IconHeader  } from '../../assets/suggestions/icon-suggestions.svg';
import { ReactComponent as PlusIcon } from '../../assets/shared/icon-plus.svg';
import { ReactComponent as ArrowUp } from '../../assets/shared/icon-arrow-up.svg';
import { ReactComponent as ArrowDown } from '../../assets/shared/icon-arrow-down.svg';
import Dropdown from '../UI/Dropdown/Dropdown';
import { DropdownItem } from '../../models/types';
import { SuggestionsContext } from '../../store/SuggestionsContext';

type Props ={
    length:number
}
const sortListMock = [
  {label:'Most Upvotes',id:1, selected:true},
  {label:'Least Upvotes',id:2, selected:false},
  {label:'Most Comments',id:3, selected:false},
  {label:'Least Comments',id:4, selected:false}
];
const SuggestionHeader:React.FC<Props> = (props)=>{
  const [sortOpen,setSortOpen] = useState(false);
  const [sortList, setSortList] = useState(sortListMock);
  const suggestionsCtx = useContext(SuggestionsContext);

  const selected: DropdownItem | undefined = sortList.find((item) => item.selected);
  
  const handleSortVisible = () => {
    setSortOpen(prevState=>!prevState);
  };

  const handleClickOnItem = (updatedList: typeof sortList, id:number) => {
    switch(id){
    case 1:
      suggestionsCtx.updateByMostUpvotes();
      break;
    case 2:
      suggestionsCtx.updateByLeastUpvotes();
      break;
    case 3:
      suggestionsCtx.updateByMostComments();
      break;
    case 4:
      suggestionsCtx.updateByLeastComments();
      break;
    }
    setSortList(updatedList);
  };


  return(
    <section className={styles.suggestionsHeader}>
      <IconHeader/>
      <h3>{props.length} Suggestions</h3>
      <div className={`${styles.sortBy} ${sortOpen ? styles.sortOpen : ''}`} onClick={handleSortVisible}>
        <span>Sort by :</span>
        <b>{` ${selected?.label}`}</b>
        {!sortOpen ? 
          <ArrowDown/> : 
          <ArrowUp/> 
        }
        {sortOpen && <Dropdown items={sortList} clickOnItem={handleClickOnItem}/>}      
      </div>
      <Button type={1}>
        <PlusIcon/>
        {' Add Feedback'}
      </Button>
    </section>);
};

export default SuggestionHeader;