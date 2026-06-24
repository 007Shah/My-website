export interface User {
  id: number;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  createdAt: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  image?: string;
  createdAt: string;
  username: string;
  displayName: string;
  avatar?: string;
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  pageId?: number;
  pageName?: string;
  pageHandle?: string;
  pageAvatar?: string;
  pageOwnerId?: number;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  username: string;
  displayName: string;
  avatar?: string;
}

export interface Page {
  id: number;
  ownerId: number;
  name: string;
  handle: string;
  category: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  createdAt: string;
  followersCount?: number;
  isFollowing?: boolean;
}
