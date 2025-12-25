/* eslint-disable */
"use server";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { SortOrder, Types } from "mongoose";
import Thread from "../models/thread.model";
import { UserType } from "../types";
import { getCache, setCache, invalidateCache, CacheKeys } from "../redis";

interface PARAMS {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: PARAMS): Promise<void> {
  await connectToDB();

  try {
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true }
    );

    // Invalidate user cache on update
    await invalidateCache(CacheKeys.user(userId));

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Error Creating/Updating User, ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    // Check cache first
    const cacheKey = CacheKeys.user(userId);
    const cached = await getCache<UserType>(cacheKey);
    if (cached) return cached;

    await connectToDB();
    const USER = await User.findOne({ id: userId })
      .populate({
        path: "threads",
        model: Thread,
        match: { parentId: null },
      })
      .lean<UserType>();

    // Cache for 5 minutes
    if (USER) {
      await setCache(cacheKey, USER, 300);
    }

    return USER;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    // Check cache first (only for non-search queries)
    const cacheKey = CacheKeys.usersList(pageNumber, searchString);
    if (!searchString) {
      const cached = await getCache<{ users: UserType[]; isNext: boolean }>(
        cacheKey
      );
      if (cached) return cached;
    }

    await connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const query = {
      id: { $ne: userId },
      $or: [{ name: { $regex: regex } }, { username: { $regex: regex } }],
    };

    const users = await User.find(query)
      .sort({ createdAt: sortBy })
      .limit(pageSize)
      .skip(skipAmount)
      .lean<UserType[]>();

    const totalUsersCount = await User.countDocuments(query);

    const isNext = totalUsersCount > skipAmount + users.length;

    const result = { users, isNext };

    // Cache for 1 minute (only non-search queries)
    if (!searchString) {
      await setCache(cacheKey, result, 60);
    }

    return result;
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function getActivity(userId: Types.ObjectId) {
  try {
    await connectToDB();

    // find all threads created by user
    const userThreads = await Thread.find({ author: userId }).lean();

    // iterate threads and concat all their child threads (which are ids)
    const childThreadIds = userThreads.reduce((acc: any[], userThread: any) => {
      return acc.concat(userThread.children);
    }, []);

    // get all replies excluded of same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    })
      .populate("author", "name image _id")
      .lean();

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch replies: ${error.message}`);
  }
}
