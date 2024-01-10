import React, { useContext, useEffect, useState } from 'react';
import { SuggestionsContext } from '../../store/SuggestionsContext';
import SuggestionItem from './SuggestionItem';
import styles from './Suggestion.module.scss';
import SuggestionHeader from './SuggestionHeader';
import Card from '../UI/Card/Card';
import HamburguerIcon from '../UI/HamburguerIcon/HamburguerIcon';
import { ReactComponent as IllustrationEmpty} from '../../assets/suggestions/illustration-empty.svg';
import { ReactComponent as PlusIcon } from '../../assets/shared/icon-plus.svg';
import Button from '../UI/Button/Button';
import { FilterOptions } from '../../models/types';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Loader} from '../../assets/shared/loader.svg';

const labelsMock = [
  {value: FilterOptions.All,id:1, selected:true},
  {value: FilterOptions.UI,id:2, selected:false},
  {value: FilterOptions.UX,id:3, selected:false},
  {value: FilterOptions.Enhancement,id:4, selected:false},
  {value: FilterOptions.Bug,id:5, selected:false},
  {value: FilterOptions.Feature,id:6, selected:false}
];
const PAGE_SIZE = 6; 
const SCROLL_THRESHOLD = 300;

export const EmptySuggestions = () =>{
  const navigate = useNavigate();
  return(
    <Card className={styles.emptySuggestions}>
      <IllustrationEmpty/>
      <h1>There is no feedback yet.</h1>
      <p>Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to improve our app.</p>
      <Button buttonType={1} onClick={()=>navigate('./addfeedback')}>
        <PlusIcon/>
        {' Add Feedback'}
      </Button>
    </Card>
  );
};

const Suggestions:React.FC = () => {
  const {suggestions, updateByCategory, roadmapList, currentCategory} = useContext(SuggestionsContext);
  const [categories, setCategories] = useState(labelsMock);
  const [isBarMobileActive, setIsBarMobileActive] = useState(false);
  const navigate = useNavigate();
  const [loadedSuggestions, setLoadedSuggestions] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleTag = (id:number,label:string) =>{
    updateByCategory(label.toLowerCase());
    const updatedCategories = categories.map(l=>
      l.id === id ? { ...l, selected: true } : { ...l, selected: false }
    );
    setCategories(updatedCategories);
    setLoadedSuggestions([]);
    setCurrentPage(1);
  };

  const handleMobileBar = (isActive:boolean) =>{
    setIsBarMobileActive(isActive);
  };

  const renderRoadmapContainer = () =>{
    return(
      <Card className={styles.roadmapContainer}>
        <h3>Roadmap</h3>
        <span onClick={()=>navigate('./roadmap')}>View</span>
        {roadmapList && (
          <ul>
            <li>Planned <span>{roadmapList?.planned?.length || 0}</span></li>
            <li>In-Progress <span>{roadmapList?.inProgress?.length || 0}</span></li>
            <li>Live <span>{roadmapList?.live?.length || 0}</span></li>
          </ul>
        )}
      </Card>  
    );
  };

  const renderTagContainer = () =>{
    return(
      <Card className={styles.tagsContainer}>
        {categories.map((l)=>(
          <label className={`tag h ${l.selected ? 'tagSelected' : ''}`} key={l.id} onClick={()=>handleTag(l.id,l.value)}>{l.value}</label>
        ))}
      </Card>
    );
  };

  useEffect(()=>{
    if(currentCategory!==''){
      const updatedCategories = categories.map(l=>
        l.value.toLowerCase() === currentCategory.toLowerCase() ? { ...l, selected: true } : { ...l, selected: false }
      );
      setCategories(updatedCategories);
      setLoadedSuggestions([]);
      setCurrentPage(1); 
    }   
  },
  [currentCategory]);

  useEffect(() => {
    loadMoreSuggestions();
  }, [suggestions]);

  const loadMoreSuggestions = async (wait = false) => {
   
    if(wait) await new Promise((resolve) => setTimeout(resolve, 250));

    const start = (currentPage -1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const newLoadedSuggestions = suggestions.slice(0, end);
    setLoadedSuggestions(newLoadedSuggestions);
    setIsLoading(false);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY + SCROLL_THRESHOLD >= document.body.offsetHeight &&
      suggestions.length > loadedSuggestions.length &&
      !isLoading
    ) {
      setIsLoading(true);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {    

    window.addEventListener('scroll', handleScroll);

    if (isLoading) {
      loadMoreSuggestions(true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage, suggestions, isLoading]);


  return (
    <div className={`container ${styles.suggestionsContainer}`}>
      <div className={styles.suggestionNavigation}>
        <div className={styles.titleDiv}>
          <h2>Frontend Mentor</h2>
          <p className='p2'>Feedback Board</p>
        </div>
        {renderTagContainer()}
        {renderRoadmapContainer()}
      </div>
      <HamburguerIcon handleOnClick={handleMobileBar}/>
      {isBarMobileActive &&
        <div className={styles.barMobile}>
          <div>
            {renderTagContainer()}
            {renderRoadmapContainer()} 
          </div>
        </div>
      }      
      <section className={styles.suggestions}>
        <SuggestionHeader length={suggestions.length}/>
        {
          loadedSuggestions.length === 0 ? <EmptySuggestions/> 
            :
            <div className={styles.requestsContainer}>      
              {loadedSuggestions.map((pr: any) => pr && <SuggestionItem request={pr} key={pr.id} />)}
              {isLoading && <div className='loader'><Loader/></div>}
            </div>
        }
      </section>
    </div>
    
  );
};

export default Suggestions;