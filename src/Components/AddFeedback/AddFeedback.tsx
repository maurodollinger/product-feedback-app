import React, { useState } from 'react';
import Card from '../UI/Card/Card';
import GoBackButton from '../UI/GoBackButton/GoBackButton';
import styles from './AddFeedback.module.scss';
import AutoResizableTextarea from '../UI/AutoResizableTextarea/AutoResizableTextarea';
import { ReactComponent as PlusIconImage } from '../../assets/shared/icon-new-feedback.svg';
import Button from '../UI/Button/Button';
import Dropdown from '../UI/Dropdown/Dropdown';
import { DropdownItem, FilterOptions } from '../../models/types';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  feedback: Yup.string().required('Can\'t be empty')
});


const labelsMock = [
  {label: FilterOptions.All as string,value:'',id:1, selected:true},
  {label: FilterOptions.UI as string,value:'',id:2, selected:false},
  {label: FilterOptions.UX as string,value:'',id:3, selected:false},
  {label: FilterOptions.Enhancement as string,value:'',id:4, selected:false},
  {label: FilterOptions.Bug as string,value:'',id:5, selected:false},
  {label: FilterOptions.Feature as string,value:'',id:6, selected:false}
];

const AddFeedback:React.FC = () =>{
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      title: '',
      feedback:''
    },
    validationSchema:validationSchema,
    onSubmit:(values)=>{
      console.log(values);
    }
  });

  const [sortOpen,setSortOpen] = useState(false);
  const [sortList, setSortList] = useState(labelsMock);

  const handleSortVisible = () => {
    setSortOpen(prevState=>!prevState);
  };

  const handleClickOnItem = (updatedList: typeof sortList) => {
    setSortList(updatedList);
    setSortOpen(prevState=>!prevState);
  };

  const selected: DropdownItem | undefined = sortList.find((item) => item.selected);

  return(
    <section className={`${styles.addFeedbackContainer} thinContainer`}>
      <GoBackButton/>
      <Card className={styles.addFeedback}>
        <PlusIconImage/>
        <h1>Create New Feedback</h1>
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
                  {selected?.label}
                </button>
                { sortOpen &&
              <Dropdown items={sortList} clickOnItem={handleClickOnItem}/>
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
            <Button buttonType={3} onClick={()=>navigate(-1)}>Cancel</Button>
            <Button buttonType={1} type='submit'>Add Feedback</Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default AddFeedback;