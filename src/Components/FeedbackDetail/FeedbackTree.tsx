import React, { Fragment, useEffect, useRef, useState } from 'react';
import FeedbackComment from './FeedbackComment';
import { Comment } from '../../models/types';
import styles from './Feedback.module.scss';
import AutoResizableTextarea from '../UI/AutoResizableTextarea/AutoResizableTextarea';
import Button from '../UI/Button/Button';

type Props = {
    comments:Comment[],
    firstBranch:boolean
}


export const RepliesContainer:React.FC<{children:React.ReactNode,ghostHeight?:number}> = ({children,ghostHeight}) =>{
  const adjustedGhostHeight = ghostHeight ? `calc(${ghostHeight}px - 1.5rem)` : undefined;

  return(
    <div className={styles.repliesContainer}>
      <div className={styles.leftSide}>
        <span></span>
        <div style={{ height: adjustedGhostHeight }}></div>
      </div>
      <div className={styles.rightSide}>{children}</div>
    </div>
  );
};


const FeedbackTree:React.FC<Props> = ({comments, firstBranch}) =>{
  const [activeReplies, setActiveReplies] = useState<number[]>([]);
  const lastCommentRef = useRef<HTMLDivElement | null>(null);
  const [ghostHeight, setGhostHeight] = useState<number>(0);
  

  const renderAddComment = (id:number): React.ReactNode => (
    activeReplies.includes(id) && (
      <div className={styles.replyComment}>
        <AutoResizableTextarea/>
        <Button buttonType={1}>Post Reply</Button>
      </div>
    )
  );

  const handleReply = (id:number): void =>{
    setActiveReplies((prevState) => [...prevState, id]);
  };

  useEffect(() => {
    if (lastCommentRef.current) {
      const feedbackCommentElement = lastCommentRef.current.querySelector('.feedbackComment:last-child');
      if (feedbackCommentElement) {
        setGhostHeight(feedbackCommentElement.clientHeight);
      }
    }
  }, [comments]);
  return (
    <>
      {comments.map((comment,index)=>{
        const isLastComment = index === comments.length - 1;
        return(
          <div 
            key={(comment.id) ? comment.id : index} 
            className={styles.feedbackCommentContainer} 
            ref={isLastComment ? lastCommentRef : null}>
            <FeedbackComment className={`${(firstBranch && !comment.replies && !isLastComment) ? styles.borderBottom : ''} 
            ${(isLastComment) ? 'feedbackComment' : ''}`} comment={comment}
            openReply={handleReply}
            >
              {renderAddComment(comment.id)}
            </FeedbackComment>

            {
              comment.replies?.length && 
                <RepliesContainer ghostHeight={ghostHeight}>
                  <FeedbackTree comments={comment.replies} firstBranch={false}/>
                </RepliesContainer>
            
            }
          </div>
        );
      })}
    </>
  );
};

export default FeedbackTree;