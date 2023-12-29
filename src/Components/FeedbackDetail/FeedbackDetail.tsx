import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../UI/Button/Button';
import styles from './Feedback.module.scss';
import GoBackButton from '../UI/GoBackButton/GoBackButton';
import SuggestionItem from '../Suggestions/SuggestionItem';
import request from '../../mockup/request.json';
import Card from '../UI/Card/Card';
import FeedbackTree from './FeedbackTree';
import AutoResizableTextarea from '../UI/AutoResizableTextarea/AutoResizableTextarea';
import { SuggestionsContext } from '../../store/SuggestionsContext';
import { Suggestions } from '../../models/types';

const FeedbackDetail:React.FC = () =>{
  const [ charactersRemaining, setCharactersRemaining] = useState<number>(250);
  const [ feedbackRequest, setFeedbackRequest] = useState<Suggestions>(request);
  const { suggestions } = useContext(SuggestionsContext);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleCharactersRemaining = (charactersRemaining: number) => {
    setCharactersRemaining(charactersRemaining);
  };

  const handleEditFeedback = () =>{
    navigate(`../editfeedback/${id}`);
  };

  useEffect(() => {
    const feedback = suggestions.find((item:Suggestions) => item.id.toString() === id);
    if (feedback) {
      setFeedbackRequest(feedback);
    } else {
      console.error(`Feedback with ID ${id} not found in UserContext.`);
    }
  }, [id, suggestions]);

  return(
    <section className={`${styles.feedbackDetailContainer} container`}>
      <div>
        <GoBackButton></GoBackButton>
        <Button buttonType={2} onClick={handleEditFeedback}>Edit Feedback</Button>
      </div>
      <SuggestionItem request={feedbackRequest} isClickable={false}></SuggestionItem>
      {
        feedbackRequest.comments && (
          <Card className={styles.comments}>
            <>
              <h3>{`${feedbackRequest.comments.length} comments`}</h3>
              <FeedbackTree comments={feedbackRequest.comments} firstBranch={true}></FeedbackTree>
            </>
          </Card>
        )
      }
      <Card className={styles.addComment}>
        <h3>Add Comment</h3>
        <AutoResizableTextarea  onCharactersRemainingChange={handleCharactersRemaining} />
        <div>
          <p className='p2'>{`${charactersRemaining} Characters left`}</p>
          <Button buttonType={1}>Post Comment</Button>
        </div>
      </Card>
    </section>
  );
};


export default FeedbackDetail;