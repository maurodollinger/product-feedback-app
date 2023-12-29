import React from 'react';
import styles from './Roadmap.module.scss';
import Button from '../UI/Button/Button';
import { ReactComponent as PlusIcon} from '../../assets/shared/icon-plus.svg';
import { useNavigate } from 'react-router-dom';
import GoBackButton from '../UI/GoBackButton/GoBackButton';

const Roadmap:React.FC = () =>{
  const navigate = useNavigate();

  return(
    <section className={`container ${styles.roadmap}`}>
      <header className={`${styles.roadmapHeader} header`}>
        <div>
          <GoBackButton/>
          <h1>Roadmap</h1>
        </div>          
        <Button buttonType={1} onClick={()=>navigate('./addfeedback')}>
          <PlusIcon/>
          {' Add Feedback'}
        </Button>
      </header>
    </section>
  );
};

export default Roadmap;