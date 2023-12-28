import React, { useReducer } from 'react';
import { ProductRequest, SuggestionsContextProps, SuggestionsContextProviderProps } from '../models/types';

const initialUserContextValues: SuggestionsContextProps = {
  currentUser: {
    image: '',
    name: '',
    username: '',
  },
  productRequests: [],
  updateByLeastUpvotes:()=>{/**/},
  updateByMostUpvotes:()=>{/**/},
  updateByLeastComments:()=>{/**/},
  updateByMostComments:() =>{/**/},
};

export const SuggestionsContext = React.createContext<SuggestionsContextProps>(initialUserContextValues);

type Action =
  | { type: 'UPDATE_LEAST_UPVOTES';}
  | { type: 'UPDATE_MOST_UPVOTES'; }
  | { type: 'UPDATE_LEAST_COMMENTS';}
  | { type: 'UPDATE_MOST_COMMENTS'; };
  
const suggestionsReducer = (state:ProductRequest[],action:Action) => {
  let sortedSuggestions;
  switch (action.type) {
  case 'UPDATE_LEAST_UPVOTES':
    sortedSuggestions = [...state].sort((a, b) => a.upvotes - b.upvotes);
    return sortedSuggestions;
  case 'UPDATE_MOST_UPVOTES':
    sortedSuggestions = [...state].sort((a, b) => b.upvotes - a.upvotes);
    return sortedSuggestions;
  case 'UPDATE_LEAST_COMMENTS':
    sortedSuggestions = [...state].sort((a, b) => (a.comments?.length ?? 0) - (b.comments?.length ?? 0));
    return sortedSuggestions;
  case 'UPDATE_MOST_COMMENTS':
    sortedSuggestions = [...state].sort((a, b) => (b.comments?.length ?? 0) - (a.comments?.length ?? 0));
    return sortedSuggestions;
  default:
    return state;
  }
};

export const SuggestionsContextProvider:React.FC<SuggestionsContextProviderProps> = (props) =>{

  const [suggestionsState, dispatchSuggestionsAction] = useReducer(suggestionsReducer,props.productRequests);


  const updateByLeastUpvotes = () =>{
    dispatchSuggestionsAction({type: 'UPDATE_LEAST_UPVOTES'});
  };  

  const updateByMostUpvotes = () =>{
    dispatchSuggestionsAction({type: 'UPDATE_MOST_UPVOTES'});
  };  

  const updateByLeastComments = () =>{
    dispatchSuggestionsAction({type:'UPDATE_LEAST_COMMENTS'});
  };

  const updateByMostComments = () =>{
    dispatchSuggestionsAction({type:'UPDATE_MOST_COMMENTS'});
  };

  const suggestionsCtx = {
    currentUser:props.currentUser,
    productRequests:suggestionsState,
    updateByLeastUpvotes,
    updateByMostUpvotes,
    updateByLeastComments,
    updateByMostComments
  };

  return(
    <SuggestionsContext.Provider
      value={suggestionsCtx}>
      {props.children}
    </SuggestionsContext.Provider>
  );
};
