export interface ResourceInfo {
  user_id: number;
  name: string;
  is_faculty: boolean,
  resource_id: number;
  title: string;
  description: string;
  url: string;
  origin: string;
  author_id: number;
  creation_date: string;
  content_type: string;
  recommended_week?: string;
  evaluation?: string;
  justification?: string;
}

export interface ResourceInfoWithVotes {
  user_id: number;
  name: string;
  is_faculty: boolean,
  resource_id: number;
  title: string;
  description: string;
  url: string;
  origin: string;
  author_id: number;
  creation_date: string;
  content_type: string;
  recommended_week?: string;
  evaluation?: string;
  justification?: string;
  votesInfo: { upvotes: number; downvotes: number; totalVotes: number }
}

export interface UserInterface {
  id: number;
  name: string;
  is_faculty: boolean;
}

export interface PostedResource{
  title: string;
  description: string;
  url: string;
  origin: string;
  author_id: number;
  content_type: string;
  recommended_week?: string;
  evaluation?: string;
  justification?: string;
  tags: string[];
}