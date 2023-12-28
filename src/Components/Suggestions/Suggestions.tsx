import React, { useContext, useState } from 'react';
import { SuggestionsContext } from '../../store/SuggestionsContext';
import SuggestionItem from './SuggestionItem';
import styles from './Suggestion.module.scss';
import SuggestionHeader from './SuggestionHeader';
import Card from '../UI/Card/Card';
import HamburguerIcon from '../UI/HamburguerIcon/HamburguerIcon';
import { ReactComponent as IllustrationEmpty} from '../../assets/suggestions/illustration-empty.svg';
import { ReactComponent as PlusIcon } from '../../assets/shared/icon-plus.svg';
import Button from '../UI/Button/Button';

const labelsMock = [
  {value:'All',id:1, selected:true},
  {value:'UI',id:2, selected:false},
  {value:'UX',id:3, selected:false},
  {value:'Enhancement',id:4, selected:false},
  {value:'Bug',id:5, selected:false},
  {value:'Feature',id:6, selected:false}
];

export const EmptySuggestions = () =>{
  return(
    <Card className={styles.emptySuggestions}>
      <IllustrationEmpty/>
      <h1>There is no feedback yet.</h1>
      <p>Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to improve our app.</p>
      <Button type={1}>
        <PlusIcon/>
        {' Add Feedback'}
      </Button>
    </Card>
  );
};

const Suggestions:React.FC = () => {
  const [labels, setLabels] = useState(labelsMock);
  const {productRequests} = useContext(SuggestionsContext);
  const [isBarMobileActive, setIsBarMobileActive] = useState(false);

  const handleTag = (id:number) =>{
    const updatedLabels = labels.map(l=>
      l.id === id ? { ...l, selected: true } : { ...l, selected: false }
    );
    setLabels(updatedLabels);
  };

  const handleMobileBar = (isActive:boolean) =>{
    setIsBarMobileActive(isActive);
  };

  return (
    <div className={`container ${styles.suggestionsContainer}`}>
      <div className={styles.suggestionNavigation}>
        <div className={styles.titleDiv}>
          <h2>Frontend Mentor</h2>
          <p className='p2'>Feedback Board</p>
        </div>
        <Card className={styles.tagsContainer}>
          {labels.map((l)=>(
            <label className={`tag h ${l.selected ? 'tagSelected' : ''}`} key={l.id} onClick={()=>handleTag(l.id)}>{l.value}</label>
          ))}
        </Card>
        <Card className={styles.roadmapContainer}>
          <h3>Roadmap</h3>
          <span>View</span>
          <ul>
            <li>Planned <span>2</span></li>
            <li>In-Progress <span>3</span></li>
            <li>Live <span>1</span></li>
          </ul>
        </Card>        
      </div>
      <HamburguerIcon handleOnClick={handleMobileBar}/>
      {isBarMobileActive &&
        <div className={styles.barMobile}>
          <div>
            <Card className={styles.tagsContainer}>
              {labels.map((l)=>(
                <label className={`tag h ${l.selected ? 'tagSelected' : ''}`} key={l.id} onClick={()=>handleTag(l.id)}>{l.value}</label>
              ))}
            </Card>
            <Card className={styles.roadmapContainer}>
              <h3>Roadmap</h3>
              <span>View</span>
              <ul>
                <li>Planned <span>2</span></li>
                <li>In-Progress <span>3</span></li>
                <li>Live <span>1</span></li>
              </ul>
            </Card> 
          </div>
        </div>
      }      
      <section className={styles.suggestions}>
        <SuggestionHeader length={productRequests.length}/>
        {
          productRequests.length === 0 ? <EmptySuggestions/> 
            :
            <div className={styles.requestsContainer}>      
              {
                productRequests.map((pr)=>(
                  <SuggestionItem request={pr} key={pr.id}/>
                ))
              }
            </div>
        }
      </section>
    </div>
    
  );
};

export default Suggestions;