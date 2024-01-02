// types.ts
interface User {
  image: string;
  name: string;
  username: string;
}

interface Comment {
  id: number;
  content: string;
  user: User;
  replyingTo?:string;
  replies?:Comment[];
}

interface Suggestions {
  id: number;
  title: string;
  category: string;
  upvotes: number;
  status: string;
  description: string;
  comments?: Comment[];
}

interface SuggestionsContextProviderProps {
  children: React.ReactNode;
  currentUser: User;
  suggestions: Suggestions[];
}

interface SuggestionsContextProps {
  currentUser: User;
  suggestions: Suggestions[];
  originalSuggestions: Suggestions[];
  roadmapList:RoadmapList;
  updateByLeastUpvotes:()=>any;
  updateByMostUpvotes:()=>any;
  updateByLeastComments:()=>any;
  updateByMostComments:()=>any;
  filterByCategory:(category:string)=>any;
}

interface DropdownItem {
  label: string;
  id: number;
  selected: boolean;
}

interface SuggestionReducerProps {
  suggestions:Suggestions[];
  originalSuggestions:Suggestions[];
  currentSort:string;
  roadmapList:RoadmapList;
}

interface RoadmapList{
  planned:Suggestions[];
  inProgress:Suggestions[];
  live:Suggestions[];
}

export enum SortOptions {
  MostUpvotes = 'Most Upvotes',
  LeastUpvotes = 'Least Upvotes',
  MostComments = 'Most Comments',
  LeastComments = 'Least Comments',
}

export enum FilterOptions{
  All = 'All',
  UI = 'UI',
  UX = 'UX',
  Enhancement = 'Enhancement',
  Bug = 'Bug',
  Feature = 'Feature'
}

export enum RoadmapStatus{
  Suggestion = 'Suggestion',
  Planned = 'Planned',
  InProgress = 'In-Progress',
  Live = 'Live'
}

export enum RoadmapStatusLowcap{
  Suggestion = 'suggestion',
  Planned = 'planned',
  InProgress = 'in-progress',
  Live = 'live'
}

export type { User, Comment, Suggestions, SuggestionsContextProviderProps, SuggestionsContextProps, DropdownItem, SuggestionReducerProps};
