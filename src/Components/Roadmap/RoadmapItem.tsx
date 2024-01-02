import React from 'react';
import { RoadmapStatusLowcap, Suggestions } from '../../models/types';
import Card from '../UI/Card/Card';
import Counter from '../UI/Counter/Counter';
import styles from './Roadmap.module.scss';
import { ReactComponent as IconComments } from '../../assets/shared/icon-comments.svg';

type Props = {
    item:Suggestions
}

const RoadmapItem:React.FC<Props> = ({item}) =>{
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
    <Card className={`${styles.roadmapItem} ${classStatus}`}>
      <span className={styles.borderTop}></span>
      <ul>
        <li>{item.status}</li>
      </ul>
      <h3>{item.title}</h3>
      <p className='p4'>{item.description}</p>
      <span className='tag'>{item.category}</span>
      <Counter upvotes={item.upvotes} onCounterClick={()=>{/* */}} horizontal={true}></Counter>
      
      <div className='commentsDiv abs'>
        <IconComments/>
        <span>{item.comments?.length || <span style={{opacity:0.5}}>0</span>}</span>
      </div>   
    </Card>
  );
};

export default RoadmapItem;