import { ObjectId } from "mongodb";

export interface UserModel {
  _id: ObjectId
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  site: string;
  posts?: PostModel[];
  // follower: UserModel[];
  // followerIDs: string[];
  // following: UserModel[];
  // followingIDs: string[];
  // followingTags: Tag[];
  // tagId: string[];
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  // comment: Comment[];
  // replies: Reply[];
  // saved: SavedPost[];
}

export interface TagModel {
  _id: ObjectId
  id: string;
  label: string;
  value: string;
  description: string;
  color: string;
  // User: User[];
  userId: string[];
  // Post: Post[];
  postId: string[];
}

export interface ReplyModel {
  _id: ObjectId
  id: string;
  content: string;
  // author: User;
  authorId: string;
  // comment: Comment;
  commentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentModel {
  _id: ObjectId
  id: string;
  content: string;
  // author: User;
  authorId: string;
  // post: Post;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
  // replies: Reply[];
}

export interface SavedPostModel {
  id: string;
  // user: User;
  userId: string;
  // post: Post;
  postId: string;
  createdAt: Date;
}

enum PostType {
  DRAFT,
  PUBLISHED
}

export interface PostModel {
  _id: ObjectId;
  id: string;
  title: string;
  path?: string;
  image?: string;
  content: Object;
  author: UserModel;
  authorId: string;
  // tags: Tag[];
  tagId: string[];
  comments: Comment[];
  views: number;
  type: PostType;
  createdAt: Date;
  updatedAt: Date;
  // saved: SavedPost[];
}


