import React, { useContext, useEffect, useState } from 'react';
import { RoadmapStatusLowcap, Suggestions } from '../../models/types';
import Card from '../UI/Card/Card';
import Counter from '../UI/Counter/Counter';
import styles from './Roadmap.module.scss';
import { ReactComponent as IconComments } from '../../assets/shared/icon-comments.svg';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../store/ApiContext';
import { SuggestionsContext } from '../../store/SuggestionsContext';

type Props = {
    item:Suggestions
}

const RoadmapItem:React.FC<Props> = ({item}) =>{
  const navigate = useNavigate();
  const [isUpvoted, setIsUpvoted] = useState(false);

  const { upvoteSuggestion} = useApi();

  const { currentUser } = useContext(SuggestionsContext);

  const handleNavigation = () =>{
    navigate(`../feedbackdetail/${item.id}`);
  };

  const handleCounterClick = (event: React.MouseEvent) => {
    event.stopPropagation(); 
    if(!isUpvoted){
      upvoteSuggestion(item.id.toString());
      setIsUpvoted(true);
    }    
  };

  useEffect(() => 
  {    
    const upvotes = currentUser.upvotes;
    const isAlreadyUpvoted = upvotes ? upvotes.includes(item.id) : false;
    setIsUpvoted(isAlreadyUpvoted);
  }, [currentUser.upvotes, item.id]);

  const {status} = item;
  let classStatus;
  switch(status){
  case RoadmapStatusLowcap.InProgress:
    classStatus = styles.inProgress;
    break;
  case RoadmapStatusLowcap.Live:
    classStatus = styles.live;
    break;
  case RoadmapStatusLowcap.Planned:
    classStatus = styles.planned;
    break;
  }
  return(
    <Card className={`${styles.roadmapItem} ${classStatus}`}  onClick={handleNavigation}>
      <span className={styles.borderTop}></span>
      <ul>
        <li>{item.status}</li>
      </ul>
      <h3>{item.title}</h3>
      <p className='p4'>{item.description}</p>
      <span className='tag'>{item.category}</span>
      <Counter upvotes={item.upvotes} disabled={isUpvoted} onCounterClick={handleCounterClick} horizontal={true}></Counter>
      
      <div className='commentsDiv abs'>
        <IconComments/>
        <span>{item.comments?.length || <span style={{opacity:0.5}}>0</span>}</span>
      </div>   
    </Card>
  );
};

export default RoadmapItem;