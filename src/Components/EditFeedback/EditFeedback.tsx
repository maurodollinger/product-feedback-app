import React, { useContext, useEffect, useState } from 'react';
import Card from '../UI/Card/Card';
import GoBackButton from '../UI/GoBackButton/GoBackButton';
import styles from './EditFeedback.module.scss';
import AutoResizableTextarea from '../UI/AutoResizableTextarea/AutoResizableTextarea';
import { ReactComponent as PlusIconImage } from '../../assets/shared/icon-new-feedback.svg';
import Button from '../UI/Button/Button';
import Dropdown from '../UI/Dropdown/Dropdown';
import { DropdownItem, FilterOptions, RoadmapStatus, Suggestions } from '../../models/types';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { SuggestionsContext } from '../../store/SuggestionsContext';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  feedback: Yup.string().required('Can\'t be empty')
});


const labelsMock = [
  {label: FilterOptions.All as string,id:1, selected:true},
  {label: FilterOptions.UI as string,id:2, selected:false},
  {label: FilterOptions.UX as string,id:3, selected:false},
  {label: FilterOptions.Enhancement as string,id:4, selected:false},
  {label: FilterOptions.Bug as string,id:5, selected:false},
  {label: FilterOptions.Feature as string,id:6, selected:false}
];

const updatedStatusMock = [
  {label: RoadmapStatus.Suggestion as string,id:1, selected:true},
  {label: RoadmapStatus.Planned as string,id:2, selected:false},
  {label: RoadmapStatus.InProgress as string,id:3, selected:false},
  {label: RoadmapStatus.Live as string,id:3, selected:false}
];

const EditFeedback:React.FC = () =>{
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [ feedbackRequest, setFeedbackRequest] = useState<Suggestions>();
  const { suggestions } = useContext(SuggestionsContext);
  
  const formik = useFormik({
    initialValues: {
      title: feedbackRequest ? feedbackRequest.title : '',
      feedback: feedbackRequest ? feedbackRequest.description : ''
    },
    validationSchema:validationSchema,
    onSubmit:(values)=>{
      console.log(values);
    }
  });

  const [sortOpen,setSortOpen] = useState(false);
  const [statusOpen,setStatusOpen] = useState(false);
  const [sortList, setSortList] = useState(labelsMock);
  const [statusList, setStatusList] = useState(updatedStatusMock);


  const handleSortVisible = () => {
    setSortOpen(prevState=>!prevState);
  };

  const handleStatusVisible = () => {
    setStatusOpen(prevState=>!prevState);
  };

  const handleClickOnSortItem = (updatedList: typeof sortList) => {
    setSortList(updatedList);
    setSortOpen(prevState=>!prevState);
  };

  const handleClickOnStatusItem = (updatedList: typeof statusList) => {
    setStatusList(updatedList);
    setStatusOpen(prevState=>!prevState);
  };

  useEffect(() => {
    const feedback = suggestions.find((item:Suggestions) => item.id.toString() === id);
    if (feedback) {
      setFeedbackRequest(feedback);
      formik.resetForm({
        values: {
          title: feedback.title,
          feedback: feedback.description,
        },
      });
    } else {
      console.error(`Feedback with ID ${id} not found in UserContext.`);
    }
  }, [id, suggestions]);

  const selectedSort: DropdownItem | undefined = sortList.find((item) => item.selected);
  const selectedStatus: DropdownItem | undefined = statusList.find((item) => item.selected);

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
                  {selectedSort?.label}
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
                  {selectedStatus?.label}
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
                id='feedback'
                name='feedback'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.feedback}
                className={formik.touched.feedback && formik.errors.feedback ? 'input-error' : ''}
              />
              {formik.touched.feedback && formik.errors.feedback ? (
                <div className='error'>{formik.errors.feedback}</div>
              ) : null}
            </div>
          </div>
          <div className={styles.actions}>
            <Button buttonType={4}>Delete</Button>
            <Button buttonType={3} onClick={()=>navigate(-1)}>Cancel</Button>
            <Button buttonType={1} type='submit'>Edit Feedback</Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default EditFeedback;