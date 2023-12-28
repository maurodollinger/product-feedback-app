import React from 'react';
import { Comment } from '../../models/types';
import styles from './Feedback.module.scss';

type Props = {
    comment:Comment,
    className?:string,
    children?:React.ReactNode,
    openReply:(id:number)=>void
}

const FeedbackComment:React.FC<Props> = ({comment,className,children,openReply}) =>{
  return (
    
    <div className={`${styles.feedbackComment} ${className}`}>
      <div className={styles.container}>
        <div>
          <img src={`../${comment.user.image}`} alt={comment.user.name}></img>
        </div>
        <div className={styles.commentContain}>
          <div>
            <h4>{comment.user.name}</h4>
            <p>{`@${comment.user.username}`}</p>
            <button onClick={()=>openReply(comment.id)}>Reply</button>
          </div>
          <p className='p2'>
            {(comment.replyingTo) && <span className={styles.replyingTo}>@{comment.replyingTo} </span>}
            {comment.content}
          </p>
        </div> 
      </div>      
      {children}    
    </div>
  );
};

export default FeedbackComment;