/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import FeedbackComment from './FeedbackComment';
import { Comment, User } from '../../models/types';
import styles from './Feedback.module.scss';
import AutoResizableTextarea from '../UI/AutoResizableTextarea/AutoResizableTextarea';
import Button from '../UI/Button/Button';
import { useApi } from '../../store/ApiContext';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

type Props = {
    comments:Comment[],
    firstBranch:boolean,
    idArray:string[]
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

const validationSchema = Yup.object().shape({
  description: Yup.string().required('Can\'t be empty')
});


const FeedbackTree:React.FC<Props> = ({comments, firstBranch,idArray}) =>{
  const [activeReplies, setActiveReplies] = useState<string[]>([]);
  const lastCommentRef = useRef<HTMLDivElement | null>(null);
  const [ghostHeight, setGhostHeight] = useState<number>(0);
  const { addReply } = useApi();

  const renderAddComment = (id:string, replyingTo?:string): React.ReactNode => (
    activeReplies.includes(id) && (
      <div className={styles.replyComment}>
        <Formik
          initialValues={{
            description: '',
            commentId: id,
            replyingTo: replyingTo || '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const newArray = [...idArray,values.commentId];
            addReply(newArray,values.description,values.replyingTo);
          }}
        >
          {(formik) => (
        
            <Form >
              <input type="hidden" id="commentId" name="commentId" value={id} />
              {replyingTo !== undefined && <input type='hidden' id="replyingTo" name='replyingTo' value={replyingTo}/>}
              <AutoResizableTextarea
                id='description'
                name='description'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className={formik.touched.description && formik.errors.description ? 'input-error' : ''}
              />
              <Button buttonType={1} type='submit'>Post Reply</Button>
              {formik.touched.description && formik.errors.description ? (
                <div className='error'>{formik.errors.description}</div>
              ) : null}
            </Form>          
          )}
        </Formik>
      </div>
    )
  );

  const handleReplies = (id:string): void =>{
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
            openReply={handleReplies}
            >
              {
                renderAddComment(comment.id,comment.user.username)
              }
            </FeedbackComment>

            {
              comment.replies?.length && 
                <RepliesContainer ghostHeight={ghostHeight}>
                  <FeedbackTree comments={comment.replies} firstBranch={false} idArray={[...idArray,comment.id]}/>
                </RepliesContainer>
            
            }
          </div>
        );
      })}
    </>
  );
};

export default FeedbackTree;