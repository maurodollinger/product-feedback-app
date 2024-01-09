import React, { useContext, useEffect, useState } from 'react';
import Card from '../UI/Card/Card';
import Counter from '../UI/Counter/Counter';
import { FilterOptions, Suggestions } from '../../models/types';
import styles from './Suggestion.module.scss';
import { ReactComponent as IconComments } from '../../assets/shared/icon-comments.svg';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../store/ApiContext';
import { SuggestionsContext } from '../../store/SuggestionsContext';

type Props = {
  request:Suggestions,
  isClickable?:boolean
};

const SuggestionItem:React.FC<Props> = ({request, isClickable=true}) =>{
  const [isHovered, setIsHovered] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(request.upvotes);

  const { currentUser } = useContext(SuggestionsContext);

  const navigate = useNavigate();
  const { upvoteSuggestion} = useApi();

  useEffect(() => 
  {    
    const upvotes = currentUser.upvotes;
    const isAlreadyUpvoted = upvotes ? upvotes.includes(request.id) : false;
    setIsUpvoted(isAlreadyUpvoted);
  }, [currentUser.upvotes, request.id]);

  useEffect(() => {
    setCurrentUpvotes(request.upvotes);
  }, [request.upvotes]);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleLeave = () =>{
    setIsHovered(false);
  };

  const handleNavigation = () =>{
    navigate(`./feedbackdetail/${request.id}`);
  };

  const handleCounterClick = (event: React.MouseEvent) => {
    event.stopPropagation(); 
    if(!isUpvoted){
      upvoteSuggestion(request.id.toString());
      setIsUpvoted(true);
    }   
  };

  const getCategoryLabel = (category: string): string => {
    const lowercaseCategory = category.toLowerCase();
  
    switch (lowercaseCategory) {
    case FilterOptions.All.toLowerCase():
      return FilterOptions.All;
    case FilterOptions.UI.toLowerCase():
      return FilterOptions.UI;
    case FilterOptions.UX.toLowerCase():
      return FilterOptions.UX;
    case FilterOptions.Enhancement.toLowerCase():
      return FilterOptions.Enhancement;
    case FilterOptions.Bug.toLowerCase():
      return FilterOptions.Bug;
    case FilterOptions.Feature.toLowerCase():
      return FilterOptions.Feature;
    default:
      return category;
    }
  };

  return (
    <Card className={`${styles.suggestionItem} ${isClickable ? styles.isClickable : ''}`} onClick={isClickable ? handleNavigation : undefined}>
      <Counter upvotes={currentUpvotes} disabled={isUpvoted} onMouseOver={handleHover} onMouseLeave={handleLeave} onCounterClick={handleCounterClick}/>
      <div>
        <h3 className={isHovered ? styles.isHovered : ''}>{request.title}</h3>
        <p className='p4'>{request.description}</p>
        <div className={`${styles.tagDiv} tag`}>
          {getCategoryLabel(request.category)}
        </div>
      </div>
      <div className='commentsDiv'>
        <IconComments/>
        <span>{request.comments?.length}</span>
      </div>      
    </Card>
  );
};

export default SuggestionItem;