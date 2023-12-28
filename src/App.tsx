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

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/product-feedback-app" element={<Layout />}>
          <Route path='/product-feedback-app' index element={<Suggestions />} />
          <Route path='/product-feedback-app/roadmap' element={<Roadmap/>}/>
          <Route path='/product-feedback-app/feedbackdetail/:id' element={<FeedbackDetail/>}/>
        </Route>
      </Routes>
    </Fragment>
  );
}

function Layout(){
  return (
    <section>
      <SuggestionsContextProvider currentUser={data.currentUser} productRequests={data.productRequests}>
        <Outlet />
      </SuggestionsContextProvider>
    </section>
  );
}

export default App;