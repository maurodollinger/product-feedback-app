// types.ts
interface User {
  image: string;
  name: string;
  username: string;
  upvotes?: string[];
}

interface DatabaseUser extends User{
  id:string;
  uid:string;
}

interface Comment {
  id: string;
  content: string;
  user: User;
  replyingTo?: string;
  replies?: Comment[];
}

interface Suggestions {
  id: string;
  title: string;
  category: string;
  upvotes: number;
  status: string;
  description: string;
  comments?: Comment[];
}

interface AddSuggestion{
  id?: string;
  title: string;
  category: string;
  upvotes: number;
  status: string;
  description: string;
}

interface SuggestionsContextProviderProps {
  children: React.ReactNode;
  //currentUser: User;
  ///suggestions: Suggestions[];
}

interface SuggestionsContextProps {
  currentUser: User;
  suggestions: Suggestions[];
  originalSuggestions: Suggestions[];
  roadmapList: RoadmapList;
  currentSort: string;
  currentCategory: string;
  updateByLeastUpvotes: () => any;
  updateByMostUpvotes: () => any;
  updateByLeastComments: () => any;
  updateByMostComments: () => any;
  updateByCategory: (category: string) => any;
}

interface DropdownItem {
  label: string;
  value: string;
  id: number;
  selected: boolean;
}

interface SuggestionReducerProps {
  suggestions: Suggestions[];
  originalSuggestions: Suggestions[];
  currentSort: string;
  currentCategory: string;
  roadmapList: RoadmapList;
}

interface RoadmapList {
  planned: Suggestions[];
  inProgress: Suggestions[];
  live: Suggestions[];
}

interface ApiContextProps {
  currentUser: User;
  suggestions: Suggestions[];
  users:DatabaseUser[]
}

interface ApiContextData {
  data: ApiContextProps;
  isLoading: boolean;
}

interface ApiContextValue {
  context: ApiContextData;
  addSuggestion: (newData: AddSuggestion) => Promise<void>;
  deleteSuggestion: (id: string) => Promise<void>;
  updateSuggestion: (id:string, updatedData:Suggestions) => Promise<void>;
  upvoteSuggestion: (id: string) => Promise<void>;
  addComment: (id:string, comment:string) => Promise<void>;
  addReply: (idArray:string[], comment:string, replyingTo?:string) => Promise<void>;
}

interface ApiType {
  getData: () => Promise<ApiContextProps>;
  addSuggestion: (newData: AddSuggestion) => Promise<void>;
  getNodeById: (id: string, path?:string) => Promise<string>;
  deleteSuggestion: (id: string) => Promise<void>;
  updateSuggestion: (id:string, updatedData:Suggestions) => Promise<void>;
  upvoteSuggestion: (id: string) => Promise<void>;
  addComment: (id:string, newData:Comment) => Promise<void>;
  addReply: (idArray:string[], newData:Comment) => Promise<void>;
  loginUser: () => Promise<any>;
  //listenAuthState: (callback: (user: User | null) => void) => void;
}

export enum SortOptions {
  MostUpvotes = 'Most Upvotes',
  LeastUpvotes = 'Least Upvotes',
  MostComments = 'Most Comments',
  LeastComments = 'Least Comments',
}

export enum SortConstants {
  MostUpvotes = 'UPDATE_MOST_UPVOTES',
  LeastUpvotes = 'UPDATE_LEAST_UPVOTES',
  MostComments = 'UPDATE_MOST_COMMENTS',
  LeastComments = 'UPDATE_LEAST_COMMENTS',
}

export enum FilterOptions {
  All = 'All',
  UI = 'UI',
  UX = 'UX',
  Enhancement = 'Enhancement',
  Bug = 'Bug',
  Feature = 'Feature'
}

export enum RoadmapStatus {
  Suggestion = 'Suggestion',
  Planned = 'Planned',
  InProgress = 'In-Progress',
  Live = 'Live'
}

export enum RoadmapStatusLowcap {
  Suggestion = 'suggestion',
  Planned = 'planned',
  InProgress = 'in-progress',
  Live = 'live'
}

export enum LogMessages {
  Error = 'Internal error, please try again later',
  Added = 'Suggestion added successfully',
  Edited = 'Suggestion edited successfully',
  Deleted = 'Suggestion removed successfully',
  Updated = 'Suggestion has been updated succesfully',
  CommentAdded = 'Comment has been added succesfully',
  Logged = 'logged succesfully'
}

export type { User, Comment, Suggestions, SuggestionsContextProviderProps, SuggestionsContextProps, DropdownItem, SuggestionReducerProps,
  ApiContextData, ApiContextProps, ApiContextValue, ApiType, AddSuggestion, DatabaseUser };
