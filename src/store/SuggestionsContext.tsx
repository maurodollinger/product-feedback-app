import React, { useEffect, useReducer } from 'react';
import { FilterOptions, RoadmapStatusLowcap, SortConstants, SuggestionReducerProps, Suggestions, SuggestionsContextProps, SuggestionsContextProviderProps } from '../models/types';
import { useApi } from './ApiContext';

const ActionTypes = {
  UPDATE_LEAST_UPVOTES: SortConstants.LeastUpvotes as string,
  UPDATE_MOST_UPVOTES: SortConstants.MostUpvotes as string,
  UPDATE_LEAST_COMMENTS: SortConstants.LeastComments as string,
  UPDATE_MOST_COMMENTS: SortConstants.MostComments as string,
  POPULATE_SUGGESTIONS: 'POPULATE_SUGGESTIONS',
  FILTER_BY_CATEGORY: 'FILTER_BY_CATEGORY',
  UPDATE_ROADMAP_LIST: 'UPDATE_ROADMAP_LIST'
};

const initialUserContextValues: SuggestionsContextProps = {
  currentUser: {
    image: '',
    name: '',
    username: '',
  },
  suggestions: [],
  originalSuggestions:[],
  roadmapList:{planned:[],inProgress:[],live:[]},
  currentSort:ActionTypes.UPDATE_MOST_UPVOTES,
  currentCategory:FilterOptions.All,
  updateByLeastUpvotes:()=>{/**/},
  updateByMostUpvotes:()=>{/**/},
  updateByLeastComments:()=>{/**/},
  updateByMostComments:() =>{/**/},
  updateByCategory:()=>{/**/}
};

export const SuggestionsContext = React.createContext<SuggestionsContextProps>(initialUserContextValues);

type Action =
  | { type: typeof ActionTypes.POPULATE_SUGGESTIONS; category?: string; suggestions?:Suggestions[];}
  | { type: typeof ActionTypes.UPDATE_LEAST_UPVOTES; category?: string; suggestions?:Suggestions[]; }
  | { type: typeof ActionTypes.UPDATE_MOST_UPVOTES; category?: string; suggestions?:Suggestions[]; }
  | { type: typeof ActionTypes.UPDATE_LEAST_COMMENTS; category?: string; suggestions?:Suggestions[]; }
  | { type: typeof ActionTypes.UPDATE_MOST_COMMENTS; category?: string; suggestions?:Suggestions[]; }
  | { type: typeof ActionTypes.FILTER_BY_CATEGORY; category: string; suggestions?:Suggestions[]; }
  | {
      type: typeof ActionTypes.UPDATE_ROADMAP_LIST;
      category?: string;
      suggestions?:Suggestions[];
      planned: Suggestions[];
      inProgress: Suggestions[];
      live: Suggestions[];
    };

  
const sortByUpvotes = (items: Suggestions[], ascending: boolean) =>
  [...items].sort((a, b) => (ascending ? a.upvotes - b.upvotes : b.upvotes - a.upvotes));

const sortByCommentsLength = (items: Suggestions[], ascending: boolean) =>
  [...items].sort((a, b) => (ascending ? (a.comments?.length ?? 0) - (b.comments?.length ?? 0) : (b.comments?.length ?? 0) - (a.comments?.length ?? 0)));

const filterByCategory = (items: Suggestions[], category: string) =>
  category.toLowerCase() === FilterOptions.All.toLowerCase() ? items : items.filter((item) => item.category.toLowerCase() === category.toLowerCase());

const suggestionsReducer = (state:SuggestionReducerProps,action:Action) => {
  const { suggestions, originalSuggestions, currentSort, currentCategory, roadmapList } = state;
  const category = (action.category!==undefined) ? action.category : 'suggestion';

  //console.log(action.type,state);
  switch (action.type) {
  case ActionTypes.POPULATE_SUGGESTIONS:
    return { suggestions: action.suggestions, originalSuggestions:action.suggestions, currentCategory,  currentSort, roadmapList};
  case ActionTypes.UPDATE_LEAST_UPVOTES:
    return { suggestions: sortByUpvotes(suggestions, true), originalSuggestions, currentCategory, currentSort: ActionTypes.UPDATE_LEAST_UPVOTES, roadmapList};
  case ActionTypes.UPDATE_MOST_UPVOTES:
    return { suggestions: sortByUpvotes(suggestions, false), originalSuggestions, currentCategory, currentSort: ActionTypes.UPDATE_MOST_UPVOTES, roadmapList};
  case ActionTypes.UPDATE_LEAST_COMMENTS:
    return { suggestions: sortByCommentsLength(suggestions, true), originalSuggestions,currentCategory,  currentSort: ActionTypes.UPDATE_LEAST_COMMENTS, roadmapList};
  case ActionTypes.UPDATE_MOST_COMMENTS:
    return { suggestions: sortByCommentsLength(suggestions, false), originalSuggestions,currentCategory,  currentSort: ActionTypes.UPDATE_MOST_COMMENTS, roadmapList};
  case ActionTypes.FILTER_BY_CATEGORY:
    return { suggestions: filterByCategory(originalSuggestions, category), originalSuggestions, currentCategory:category,  currentSort, roadmapList};
  case ActionTypes.UPDATE_ROADMAP_LIST:{
    const { planned, inProgress, live } = action as {
      type: typeof ActionTypes.UPDATE_ROADMAP_LIST;
      planned: Suggestions[];
      inProgress: Suggestions[];
      live: Suggestions[];
    };
    return {
      suggestions: suggestions,
      originalSuggestions: originalSuggestions,
      currentSort: currentSort,
      currentCategory:currentCategory,
      roadmapList: {
        planned: planned,
        inProgress: inProgress,
        live: live,
      },
    };
  }
  default:
    return state;
  }
};

const suggestionsPropsMock: SuggestionReducerProps = {
  currentSort: ActionTypes.UPDATE_MOST_UPVOTES as string,
  currentCategory: FilterOptions.All as string,
  roadmapList: { planned: [], inProgress: [], live: [] },
  suggestions: [],  
  originalSuggestions: [], 
};


export const SuggestionsContextProvider:React.FC<SuggestionsContextProviderProps> = (props) =>{
  const { context } = useApi();
  const { data, isLoading} = context ;
  const localStorageData = JSON.parse(localStorage.getItem('product-feedback-app') || 'null');

  const storedSuggestionWithLocalStorage : SuggestionReducerProps = {
    currentSort: localStorageData?.currentSort || suggestionsPropsMock.currentSort,
    currentCategory: localStorageData?.currentCategory || suggestionsPropsMock.currentCategory,
    roadmapList: suggestionsPropsMock.roadmapList,
    suggestions: suggestionsPropsMock.suggestions,
    originalSuggestions:  suggestionsPropsMock.originalSuggestions,
  };
  
  const [suggestionsState, dispatchSuggestionsAction] = useReducer(
    suggestionsReducer as React.Reducer<SuggestionReducerProps, Action>,storedSuggestionWithLocalStorage
  );  

  useEffect(() => {
    if (!isLoading) {
      dispatchSuggestionsAction({type: ActionTypes.POPULATE_SUGGESTIONS, suggestions:data.suggestions});
      updateByCategory(suggestionsState.currentCategory);
    }
  }, [isLoading,data]);

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

  const updateByCategory = (category:string) =>{
    dispatchSuggestionsAction({ type:ActionTypes.FILTER_BY_CATEGORY,category});
    dispatchSuggestionsAction({ type:suggestionsState.currentSort} );
  };

  useEffect(() => {
    const planned = suggestionsState.originalSuggestions.filter((item) => item.status === RoadmapStatusLowcap.Planned);
    const inProgress = suggestionsState.originalSuggestions.filter((item) => item.status === RoadmapStatusLowcap.InProgress);
    const live = suggestionsState.originalSuggestions.filter((item) => item.status === RoadmapStatusLowcap.Live);

    dispatchSuggestionsAction({
      type: ActionTypes.UPDATE_ROADMAP_LIST,
      planned,
      inProgress,
      live,
    });
  }, [suggestionsState.originalSuggestions]);
  
  useEffect(()=>{
    const storage = {
      currentSort:suggestionsState.currentSort,
      currentCategory:suggestionsState.currentCategory
    };
    localStorage.setItem('product-feedback-app',JSON.stringify(storage));
  },[suggestionsState]);

  const suggestionsCtx = {
    currentUser:props.currentUser,
    suggestions:suggestionsState.suggestions,
    originalSuggestions:suggestionsState.originalSuggestions,
    roadmapList:suggestionsState.roadmapList,
    currentSort:suggestionsState.currentSort,
    currentCategory:suggestionsState.currentCategory,
    updateByLeastUpvotes,
    updateByMostUpvotes,
    updateByLeastComments,
    updateByMostComments,
    updateByCategory,
  };


  return(
    <SuggestionsContext.Provider
      value={suggestionsCtx}>
      {!isLoading && props.children}
    </SuggestionsContext.Provider>
  );
};
