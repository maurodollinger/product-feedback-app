import React, { Fragment } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Suggestions from './Components/Suggestions/Suggestions';
import Roadmap from './Components/Roadmap/Roadmap';
//import data from './mockup/empty.json';
//import data from './mockup/data.json';
import data from './mockup/data-with-ids.json';
import { SuggestionsContextProvider } from './store/SuggestionsContext';
import FeedbackDetail from './Components/FeedbackDetail/FeedbackDetail';
import './scss/main.scss';
import AddFeedback from './Components/AddFeedback/AddFeedback';
import EditFeedback from './Components/EditFeedback/EditFeedback';
import { ApiProvider } from './store/ApiContext';

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path='/' index element={<Suggestions />} />
          <Route path='/roadmap' element={<Roadmap/>}/>
          <Route path='/feedbackdetail/:id' element={<FeedbackDetail/>}/>
          <Route path='/addfeedback' element={<AddFeedback/>}/>
          <Route path='/editfeedback/:id' element={<EditFeedback/>}/>
        </Route>
      </Routes>
    </Fragment>
  );
}

function Layout(){
  return (
    <section>
      <ApiProvider>
        <SuggestionsContextProvider currentUser={data.currentUser} suggestions={data.productRequests}>
          <Outlet />
        </SuggestionsContextProvider>
      </ApiProvider>
    </section>
  );
}

export default App;
