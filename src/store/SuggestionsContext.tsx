import React, { useReducer } from 'react';
import { FilterOptions, SuggestionReducerProps, Suggestions, SuggestionsContextProps, SuggestionsContextProviderProps } from '../models/types';

const initialUserContextValues: SuggestionsContextProps = {
  currentUser: {
    image: '',
    name: '',
    username: '',
  },
  suggestions: [],
  originalSuggestions:[],
  updateByLeastUpvotes:()=>{/**/},
  updateByMostUpvotes:()=>{/**/},
  updateByLeastComments:()=>{/**/},
  updateByMostComments:() =>{/**/},
  filterByCategory:()=>{/**/}
};

export const SuggestionsContext = React.createContext<SuggestionsContextProps>(initialUserContextValues);

const ActionTypes = {
  UPDATE_LEAST_UPVOTES: 'UPDATE_LEAST_UPVOTES',
  UPDATE_MOST_UPVOTES: 'UPDATE_MOST_UPVOTES',
  UPDATE_LEAST_COMMENTS: 'UPDATE_LEAST_COMMENTS',
  UPDATE_MOST_COMMENTS: 'UPDATE_MOST_COMMENTS',
  FILTER_BY_CATEGORY: 'FILTER_BY_CATEGORY',
};

type Action =
  | { type: typeof ActionTypes.UPDATE_LEAST_UPVOTES ; category?: string}
  | { type: typeof ActionTypes.UPDATE_MOST_UPVOTES ; category?: string}
  | { type: typeof ActionTypes.UPDATE_LEAST_COMMENTS ; category?: string}
  | { type: typeof ActionTypes.UPDATE_MOST_COMMENTS ; category?: string}
  | { type: typeof ActionTypes.FILTER_BY_CATEGORY; category: string };

  
const sortByUpvotes = (items: Suggestions[], ascending: boolean) =>
  [...items].sort((a, b) => (ascending ? a.upvotes - b.upvotes : b.upvotes - a.upvotes));

const sortByCommentsLength = (items: Suggestions[], ascending: boolean) =>
  [...items].sort((a, b) => (ascending ? (a.comments?.length ?? 0) - (b.comments?.length ?? 0) : (b.comments?.length ?? 0) - (a.comments?.length ?? 0)));

const filterByCategory = (items: Suggestions[], category: string) =>
  category === FilterOptions.All.toLowerCase() ? items : items.filter((item) => item.category.toLowerCase() === category.toLowerCase());

const suggestionsReducer = (state:SuggestionReducerProps,action:Action) => {
  const { suggestions, originalSuggestions, currentSort } = state;
  const category = (action.category!==undefined) ? action.category : '';

  switch (action.type) {
  case ActionTypes.UPDATE_LEAST_UPVOTES:
    return { suggestions: sortByUpvotes(suggestions, true), originalSuggestions, currentSort: ActionTypes.UPDATE_LEAST_UPVOTES};
  case ActionTypes.UPDATE_MOST_UPVOTES:
    return { suggestions: sortByUpvotes(suggestions, false), originalSuggestions, currentSort: ActionTypes.UPDATE_MOST_UPVOTES};
  case ActionTypes.UPDATE_LEAST_COMMENTS:
    return { suggestions: sortByCommentsLength(suggestions, true), originalSuggestions, currentSort: ActionTypes.UPDATE_LEAST_COMMENTS};
  case ActionTypes.UPDATE_MOST_COMMENTS:
    return { suggestions: sortByCommentsLength(suggestions, false), originalSuggestions, currentSort: ActionTypes.UPDATE_MOST_COMMENTS};
  case ActionTypes.FILTER_BY_CATEGORY:
    return { suggestions: filterByCategory(originalSuggestions, category), originalSuggestions, currentSort};

  default:
    return state;
  }
};

export const SuggestionsContextProvider:React.FC<SuggestionsContextProviderProps> = (props) =>{

  const [suggestionsState, dispatchSuggestionsAction] = useReducer(
    suggestionsReducer as React.Reducer<SuggestionReducerProps, Action>,
    {
      suggestions: props.suggestions,
      originalSuggestions: props.suggestions,
      currentSort:ActionTypes.UPDATE_MOST_UPVOTES
    }
  );  

  const updateByLeastUpvotes = () =>{
    dispatchSuggestionsAction({ type: ActionTypes.UPDATE_LEAST_UPVOTES });
  };  

  const updateByMostUpvotes = () =>{
    dispatchSuggestionsAction({ type: ActionTypes.UPDATE_MOST_UPVOTES });
  };  

  const updateByLeastComments = () =>{
    dispatchSuggestionsAction({ type: ActionTypes.UPDATE_LEAST_COMMENTS });
  };

  const updateByMostComments = () =>{
    dispatchSuggestionsAction({ type: ActionTypes.UPDATE_MOST_COMMENTS });
  };

  const filterByCategory = (category:string) =>{
    dispatchSuggestionsAction({ type:ActionTypes.FILTER_BY_CATEGORY,category});
    dispatchSuggestionsAction({ type:suggestionsState.currentSort} );
  };

  const suggestionsCtx = {
    currentUser:props.currentUser,
    suggestions:suggestionsState.suggestions,
    originalSuggestions:suggestionsState.originalSuggestions,
    updateByLeastUpvotes,
    updateByMostUpvotes,
    updateByLeastComments,
    updateByMostComments,
    filterByCategory,
  };

  return(
    <SuggestionsContext.Provider
      value={suggestionsCtx}>
      {props.children}
    </SuggestionsContext.Provider>
  );
};
