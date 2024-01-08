import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../UI/Button/Button';
import styles from './Feedback.module.scss';
import GoBackButton from '../UI/GoBackButton/GoBackButton';
import SuggestionItem from '../Suggestions/SuggestionItem';
import Card from '../UI/Card/Card';
import FeedbackTree from './FeedbackTree';
import AutoResizableTextarea from '../UI/AutoResizableTextarea/AutoResizableTextarea';
import { SuggestionsContext } from '../../store/SuggestionsContext';
import { Suggestions } from '../../models/types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useApi } from '../../store/ApiContext';


const validationSchema = Yup.object().shape({
  description: Yup.string().required('Can\'t be empty')
});

const FeedbackDetail:React.FC = () =>{
  const [ charactersRemaining, setCharactersRemaining] = useState<number>(250);
  const [ feedbackRequest, setFeedbackRequest] = useState<Suggestions>();
  const { suggestions } = useContext(SuggestionsContext);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addComment} = useApi();

  const formik = useFormik({
    initialValues:{
      description:''
    },
    validationSchema:validationSchema,
    onSubmit:(values)=>{
      if(id){
        addComment(id,values.description);
      }     
    }
  });

  const handleCharactersRemaining = (charactersRemaining: number) => {
    setCharactersRemaining(charactersRemaining);
  };

  const handleEditFeedback = () =>{
    if(id){
      navigate(`../editfeedback/${id}`);
    }
   
  };

  useEffect(() => {
    if(id && suggestions.length){     
      loadFeedback();
    }
   
  }, [suggestions]);
  
  const loadFeedback = () =>{
    const feedback = suggestions.find((item:Suggestions) => item.id === id);
    if (feedback) {
      setFeedbackRequest(feedback);
    } else {
      console.error(`Feedback with ID ${id} not found`);
    }
  };

  return(
    <section className={`${styles.feedbackDetailContainer} container`}>
      <div>
        <GoBackButton></GoBackButton>
        <Button buttonType={2} onClick={handleEditFeedback}>Edit Feedback</Button>
      </div>
      { feedbackRequest  && (
        <>
          <SuggestionItem request={feedbackRequest} isClickable={false}></SuggestionItem>
          {  feedbackRequest.comments && (
            <Card className={styles.comments}>
              <>
                <h3>{`${feedbackRequest.comments.length} comments`}</h3>
                {id && <FeedbackTree comments={feedbackRequest.comments} firstBranch={true} idArray={[id]}></FeedbackTree>}
              </>
            </Card>
          )}
        </>
      )
      }
      
      <Card className={styles.addComment}>
        <h3>Add Comment</h3>
        <form onSubmit={formik.handleSubmit}>
          <AutoResizableTextarea 
            id='description'
            name='description'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className={formik.touched.description && formik.errors.description ? 'input-error' : ''}
            onCharactersRemainingChange={handleCharactersRemaining} />
          {formik.touched.description && formik.errors.description ? (
            <div className='error'>{formik.errors.description}</div>
          ) : null}
          <div>
            <p className='p2'>{`${charactersRemaining} Characters left`}</p>
            <Button buttonType={1} type='submit'>Post Comment</Button>
          </div>
        </form>
      </Card>
    </section>
  );
};


export default FeedbackDetail;