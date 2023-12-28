import React, { useState } from 'react';
import Card from '../UI/Card/Card';
import Counter from '../UI/Counter/Counter';
import { ProductRequest } from '../../models/types';
import styles from './Suggestion.module.scss';
import { ReactComponent as IconComments } from '../../assets/shared/icon-comments.svg';
import { useNavigate } from 'react-router-dom';

type Props = {
  request:ProductRequest
};

const SuggestionItem:React.FC<Props> = ({request}) =>{
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

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
  };

  return (
    <Card className={styles.suggestionItem} onClick={handleNavigation}>
      <Counter upvotes={request.upvotes} onMouseOver={handleHover} onMouseLeave={handleLeave} onCounterClick={handleCounterClick}/>
      <div>
        <h3 className={isHovered ? styles.isHovered : ''}>{request.title}</h3>
        <p className='p4'>{request.description}</p>
        <div className={`${styles.tagDiv} tag`}>
          {request.category}
        </div>
      </div>
      <div className={styles.commentsDiv}>
        <IconComments/>
        <span>{request.comments?.length}</span>
      </div>      
    </Card>
  );
};

export default SuggestionItem;