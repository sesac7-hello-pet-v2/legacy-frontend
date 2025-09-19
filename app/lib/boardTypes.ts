export interface BoardDetails {
  board: BoardResponse;
  comment: Comment[];
}

export interface BoardResponse {
  id: number;
  email: string;
  nickname: string;
  title: string;
  content: string;
  image_url: string;
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  category: string;
  petType: string;
}

export interface Comment {
  id: number;
  email: string;
  nickname: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  boardId: number;
}

export interface Board {
  id: number;
  nickname: string;
  title: string;
  content: string;
  image_url: string;
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  category: string;
  petType: string;
}
