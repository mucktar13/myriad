import {BaseModel} from './base.interface';
import {Comment} from './comment';
import {Like} from './interaction';
import {People} from './people';
import {PostOrigin} from './timeline';
import {User} from './user';

export type ImageData = {
  src: string;
  width: number;
  height: number;
};

export type SocialMetric = {
  like: number;
  retweet: number;
};

export interface TipsReceived {
  tokenId: string;
  totalTips: number;
}

export type PostAsset = {
  images: string[];
  videos: string[];
};

export type PostMetric = {
  likes: number;
  dislikes: number;
  comments: number;
};

export type PostProps = {
  asset?: PostAsset;
  createdBy: string;
  importers: string[];
  metric: PostMetric;
  originCreatedAt: Date;
  originPostId: string;
  peopleId: string;
  platform: PostOrigin;
  tags: string[];
  text: string;
  title?: string;
  url: string;
};

export interface Post extends PostProps, BaseModel {
  user: User;
  people?: People;
  likes?: Like[];
  comments?: Comment[];
  //TODO: change this on migrating new schema of transaction
  transactions?: any[];
}

export type ImportPostProps = {
  url: string;
  importer: string;
  tags?: string[];
};

export type Dislike = {
  id: string;
  status: boolean;
  postId: string;
  userId: string;
};

export type UpoadedFile = {
  file: File;
  preview: string;
};
