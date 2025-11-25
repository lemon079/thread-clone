import { Types } from "mongoose";

export interface UserPopulated {
  id: string;
  _id: Types.ObjectId;
  name: string;
  image: string;
  username: string;
}

export interface CommunityPopulated {
  id: string;
  _id: Types.ObjectId;
  name: string;
  image: string;
}

export interface UserType {
  bio: string;
  communities: CommunityType[];
  id: string;
  _id: Types.ObjectId;
  image: string;
  name: string;
  onboarded: boolean;
  threads: ThreadType[];
  username: string;
}

export interface CommunityType {
  bio: string;
  createdAt: Date;
  createdBy: any;
  id: string;
  _id: Types.ObjectId;
  members: any;
  threads: ThreadType[];
  image: string;
  name: string;
  username?: string;
  requests: string[];
}

export interface ThreadType {
  _id?: Types.ObjectId;
  text: string;
  author: Types.ObjectId & UserPopulated;
  community?: Types.ObjectId & CommunityPopulated;
  likes?: Types.ObjectId[];
  createdAt?: Date | string;
  parentId?: string | null;
  children?: ThreadType[];
}
