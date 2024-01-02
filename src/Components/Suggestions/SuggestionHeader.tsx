import React, { useContext, useEffect, useState } from 'react';
import styles from './Suggestion.module.scss';
import Button from '../UI/Button/Button';
import { ReactComponent as IconHeader  } from '../../assets/suggestions/icon-suggestions.svg';
import { ReactComponent as PlusIcon } from '../../assets/shared/icon-plus.svg';
import { ReactComponent as ArrowUp } from '../../assets/shared/icon-arrow-up.svg';
import { ReactComponent as ArrowDown } from '../../assets/shared/icon-arrow-down.svg';
import Dropdown from '../UI/Dropdown/Dropdown';
import { DropdownItem, SortConstants, SortOptions } from '../../models/types';
import { SuggestionsContext } from '../../store/SuggestionsContext';
import { useNavigate } from 'react-router-dom';

type Props ={
    length:number
}
const sortListMock = [
  { label: SortOptions.MostUpvotes as string, value: SortConstants.MostUpvotes as string, id: 1, selected: true },
  { label: SortOptions.LeastUpvotes as string, value: SortConstants.LeastUpvotes as string, id: 2, selected: false },
  { label: SortOptions.MostComments as string, value: SortConstants.MostComments as string,id: 3, selected: false },
  { label: SortOptions.LeastComments as string,value: SortConstants.LeastComments as string, id: 4, selected: false },
];

const SuggestionHeader:React.FC<Props> = (props)=>{
  const [sortOpen,setSortOpen] = useState(false);
  const [sortList, setSortList] = useState(sortListMock);
  const {currentSort, updateByMostUpvotes, updateByLeastUpvotes, updateByMostComments ,updateByLeastComments} = useContext(SuggestionsContext);
  const navigate = useNavigate();
  const selected: DropdownItem | undefined = sortList.find((item) => item.selected);
  
  const handleSortVisible = () => {
    setSortOpen(prevState=>!prevState);
  };

  const handleClickOnItem = (updatedList: typeof sortList, id:number) => {
    switch(id){
    case 1:
      updateByMostUpvotes();
      break;
    case 2:
      updateByLeastUpvotes();
      break;
    case 3:
      updateByMostComments();
      break;
    case 4:
      updateByLeastComments();
      break;
    }
    setSortList(updatedList);
  };

  useEffect(()=>{
    if(currentSort){
      const updatedList = sortList.map(s=>(
        s.value === currentSort ? {...s,selected : true} : {...s,selected : false})
      );
      setSortList(updatedList);
    }   
  },[currentSort]);

  return(
    <header className={`${styles.suggestionsHeader} header`}>
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
      <Button buttonType={1} onClick={()=>navigate('./addfeedback')}>
        <PlusIcon/>
        {' Add Feedback'}
      </Button>
    </header>);
};

export default SuggestionHeader;