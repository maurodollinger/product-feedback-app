import React, { useContext, useState } from 'react';
import styles from './Roadmap.module.scss';
import Button from '../UI/Button/Button';
import { ReactComponent as PlusIcon} from '../../assets/shared/icon-plus.svg';
import { useNavigate } from 'react-router-dom';
import GoBackButton from '../UI/GoBackButton/GoBackButton';
import { SuggestionsContext } from '../../store/SuggestionsContext';
import { RoadmapStatus, Suggestions } from '../../models/types';
import RoadmapItem from './RoadmapItem';


const Roadmap:React.FC = () =>{
  const navigate = useNavigate();
  const {roadmapList} = useContext(SuggestionsContext);
  const [currentTitle, setCurrentTitle] = useState(RoadmapStatus.Planned);

  const planned = roadmapList.planned;
  const inProgress = roadmapList.inProgress;
  const live = roadmapList.live;

  const handleCurrentTitle = (title:RoadmapStatus) =>{
    setCurrentTitle(title);
  };

  return(
    <section className={`container ${styles.roadmap}`}>
      <header className={`${styles.roadmapHeader} header`}>
        <div>
          <GoBackButton/>
          <h1>Roadmap</h1>
        </div>          
        <Button buttonType={1} onClick={()=>navigate('../addfeedback')}>
          <PlusIcon/>
          {' Add Feedback'}
        </Button>
      </header>
      <div className={styles.roadmapItemsContainer}>
        <div className={styles.roadmapTabs}>
          <ul>
            <li onClick={()=>handleCurrentTitle(RoadmapStatus.Planned)} 
              className={`${styles.planned} ${(currentTitle===RoadmapStatus.Planned ? styles.selected : '')}`}>
              {RoadmapStatus.Planned} ({planned.length})
            </li>
            <li onClick={()=>handleCurrentTitle(RoadmapStatus.InProgress)} 
              className={`${styles.inProgress} ${(currentTitle===RoadmapStatus.InProgress ? styles.selected : '')}`}>
              {RoadmapStatus.InProgress} ({inProgress.length})
            </li>
            <li onClick={()=>handleCurrentTitle(RoadmapStatus.Live)}
              className={`${styles.live} ${(currentTitle===RoadmapStatus.Live ? styles.selected : '')}`}>
              {RoadmapStatus.Live} ({live.length})
            </li>
          </ul>
        </div>
        <div className={styles.roadmapTitles}>
          <div className={(currentTitle===RoadmapStatus.Planned ? styles.show : styles.hide)}>
            <h3>{RoadmapStatus.Planned} ({planned.length})</h3>
            <p className='p4'>Ideas prioritized for research</p>
          </div>
          <div className={(currentTitle===RoadmapStatus.InProgress ? styles.show :  styles.hide)}>
            <h3>{RoadmapStatus.InProgress} ({inProgress.length})</h3>
            <p className='p4'>Currently being developed</p>
          </div>
          <div className={(currentTitle===RoadmapStatus.Live ? styles.show :  styles.hide)}>
            <h3>{RoadmapStatus.Live} ({live.length})</h3>
            <p className='p4'>Released features</p>
          </div>
        </div>
        <div className={styles.roadmapItems}>
          <div className={(currentTitle===RoadmapStatus.Planned ? styles.show : styles.hide)}>
            {planned.map((item:Suggestions)=>(
              <RoadmapItem key={item.id} item={item}/>
            ))}
          </div>
          <div className={(currentTitle===RoadmapStatus.InProgress ? styles.show : styles.hide)}>
            {inProgress.map((item:Suggestions)=>(
              <RoadmapItem key={item.id} item={item}/>
            ))}
          </div>
          <div className={(currentTitle===RoadmapStatus.Live ? styles.show : styles.hide)}>
            {live.map((item:Suggestions)=>(
              <RoadmapItem key={item.id} item={item}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;