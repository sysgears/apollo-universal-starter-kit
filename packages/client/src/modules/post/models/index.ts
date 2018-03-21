export interface Post {
  id: number;
  content: string;
  title: string;
  comments: Comment[];
}

export interface Comment {
  id?: number;
  content: string;
}
