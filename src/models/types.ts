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

interface ProductRequest {
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
  productRequests: ProductRequest[];
}

interface SuggestionsContextProps {
  currentUser: User;
  productRequests: ProductRequest[];
  updateByLeastUpvotes:()=>any;
  updateByMostUpvotes:()=>any;
  updateByLeastComments:()=>any;
  updateByMostComments:()=>any;
}

interface DropdownItem {
  label: string;
  id: number;
  selected: boolean;
}

export type { User, Comment, ProductRequest, SuggestionsContextProviderProps, SuggestionsContextProps, DropdownItem };
