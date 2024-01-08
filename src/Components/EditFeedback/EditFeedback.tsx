import React, { useContext, useEffect, useState } from 'react';
import Card from '../UI/Card/Card';
import GoBackButton from '../UI/GoBackButton/GoBackButton';
import styles from './EditFeedback.module.scss';
import AutoResizableTextarea from '../UI/AutoResizableTextarea/AutoResizableTextarea';
import { ReactComponent as PlusIconImage } from '../../assets/shared/icon-new-feedback.svg';
import Button from '../UI/Button/Button';
import Dropdown from '../UI/Dropdown/Dropdown';
import {  FilterOptions, RoadmapStatus, Suggestions } from '../../models/types';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { SuggestionsContext } from '../../store/SuggestionsContext';
import { useApi } from '../../store/ApiContext';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Can\'t be empty')
});


const labelsMock = [
  {label: FilterOptions.All as string,value:'all',id:1, selected:true},
  {label: FilterOptions.UI as string,value:'ui',id:2, selected:false},
  {label: FilterOptions.UX as string,value:'ux',id:3, selected:false},
  {label: FilterOptions.Enhancement as string,value:'enhancement',id:4, selected:false},
  {label: FilterOptions.Bug as string,value:'bug',id:5, selected:false},
  {label: FilterOptions.Feature as string,value:'feature',id:6, selected:false}
];

const updatedStatusMock = [
  {label: RoadmapStatus.Suggestion as string,value:'suggestion',id:1, selected:true},
  {label: RoadmapStatus.Planned as string,value:'planned',id:2, selected:false},
  {label: RoadmapStatus.InProgress as string,value:'in-progress',id:3, selected:false},
  {label: RoadmapStatus.Live as string,value:'live',id:4, selected:false}
];

const EditFeedback:React.FC = () =>{
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [ feedbackRequest, setFeedbackRequest] = useState<Suggestions>();
  const { suggestions } = useContext(SuggestionsContext);
  const { deleteSuggestion, updateSuggestion } = useApi();

  const formik = useFormik({
    initialValues: {
      title: feedbackRequest ? feedbackRequest.title : '',
      description: feedbackRequest ? feedbackRequest.description : ''
    },
    validationSchema:validationSchema,
    onSubmit:(values)=>{
      if(feedbackRequest){
        const updateComment = {
          ...values,
          category:selectedSort ?? feedbackRequest.category,
          status:selectedStatus?.toLowerCase() ?? feedbackRequest.status.toLowerCase(),
          upvotes:feedbackRequest.upvotes ?? 1,
          id:feedbackRequest.id, 
          ...(feedbackRequest.comments !== undefined && { comments: feedbackRequest.comments }),
        };
        if(id){
          updateSuggestion(id,updateComment).then(()=>{
            navigate(-1);
          });
        }
      }
     

    }
  });

  const [sortOpen,setSortOpen] = useState(false);
  const [statusOpen,setStatusOpen] = useState(false);
  const [sortList, setSortList] = useState(labelsMock);
  const [statusList, setStatusList] = useState(updatedStatusMock);
  const [selectedSort, setSelectedSort] = useState(labelsMock[0].label);
  const [selectedStatus, setSelectedStatus] = useState(updatedStatusMock[0].label);

  const handleSortVisible = () => {
    setSortOpen(prevState=>!prevState);
  };

  const handleStatusVisible = () => {
    setStatusOpen(prevState=>!prevState);
  };

  const handleClickOnSortItem = (updatedList: typeof sortList) => {
    setSortList(updatedList);
    const selected = updatedList.find((item) => item.selected);
    if(selected) setSelectedSort(selected?.label);
    setSortOpen(prevState=>!prevState);
  };

  const handleClickOnStatusItem = (updatedList: typeof statusList) => {
    setStatusList(updatedList);
    const selected = updatedList.find((item) => item.selected);
    if(selected) setSelectedStatus(selected?.label);
    setStatusOpen(prevState=>!prevState);
  };

  const handleDelete = () =>{
    if(id){
      deleteSuggestion(id).then(()=>{
        navigate(-2);
      });
    }  
  };

  useEffect(() => {
    if(id && suggestions.length){
      const feedback = suggestions.find((item:Suggestions) => item.id.toString() === id);
      if (feedback) {
        setFeedbackRequest(feedback);     
    
        formik.resetForm({
          values: {
            title: feedback.title,
            description: feedback.description,
          },
        });
      } else {
        
        console.error(`Feedback with ID ${id} not found in UserContext.`);
      }
    }
   
  }, [id, suggestions]);

  
  useEffect(()=>{
    if (feedbackRequest) {
      const category = sortList.find((item)=>item.value===feedbackRequest.category.toLowerCase());
      if(category) setSelectedSort(category.label);
      const status = statusList.find((item)=>item.value===feedbackRequest.status.toLowerCase());
      if(status) setSelectedStatus(status.label);
    }  

  },[feedbackRequest]);

  return(
    <section className={`${styles.editFeedbackContainer} thinContainer`}>
      <GoBackButton/>
      <Card className={styles.editFeedback}>
        <PlusIconImage/>
        <h1>{`Editing '${feedbackRequest?.title}'`}</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className='form-group'>
            <div>
              <h4>Feedback Title</h4>
              <p className='p5'>Add a short, descriptive headline</p>
              <input 
                className={`form-input ${formik.touched.title && formik.errors.title ? 'input-error' : ''}`}
                type='text'
                id='title'
                name='title'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
              />
              {formik.touched.title && formik.errors.title ? (
                <div className='error'>{formik.errors.title}</div>
              ) : null}
            </div>
            <div>
              <h4>Category</h4>
              <p className='p5'>Choose a category for your feedback</p>
              <div className='form-select-dropdown'>
                <button type='button' className='form-select' onClick={handleSortVisible}>
                  {selectedSort}
                </button>
                { sortOpen &&
              <Dropdown items={sortList} clickOnItem={handleClickOnSortItem}/>
                }
              </div>
            </div>
            <div>
              <h4>Update Status</h4>
              <p className='p5'>Change feedback state</p>
              <div className='form-select-dropdown'>
                <button type='button' className='form-select' onClick={handleStatusVisible}>
                  {selectedStatus}
                </button>
                { statusOpen &&
              <Dropdown items={statusList} clickOnItem={handleClickOnStatusItem}/>
                }
              </div>
            </div>
            <div>
              <h4>Feedback Detail</h4>
              <p className='p5'>Include any specific comments on what should be improved, added, etc.</p>       
              <AutoResizableTextarea
                id='description'
                name='description'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className={formik.touched.description && formik.errors.description ? 'input-error' : ''}
              />
              {formik.touched.description && formik.errors.description ? (
                <div className='error'>{formik.errors.description}</div>
              ) : null}
            </div>
          </div>
          <div className={styles.actions}>
            <Button buttonType={4} onClick={handleDelete}>Delete</Button>
            <Button buttonType={3} onClick={()=>navigate(-1)}>Cancel</Button>
            <Button buttonType={1} type='submit'>Edit Feedback</Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default EditFeedback;