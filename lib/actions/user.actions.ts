/* eslint-disable */
"use server";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { SortOrder } from "mongoose";
import Thread from "../models/thread.model";

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
  connectToDB();

  try {
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true } // upsert-- update and insert, update something if exist or insert something if dont exist
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Error Creating/Updating User, ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    const USERS = await User.findOne({ id: userId });
    return USERS;
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
  searchString: string;
  pageNumber: number;
  pageSize: number;
  sortBy: SortOrder;
}) {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const userQuery = User.find({
      id: { $ne: userId },
      $or: [{ name: { $regex: regex } }, { username: { $regex: regex } }],
    })
      .sort({ createdAt: sortBy })
      .limit(pageSize)
      .skip(skipAmount);

      const users = await userQuery.exec();

    const totalUsersCount = await User.countDocuments(userQuery);

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // find all threads created by user
    const userThreads = await Thread.find({ author: userId });

    // iterate threads and concat all their child threads ( which are ids )
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // get all replies excluded of same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate("author", "name image _id");

    return replies;
  } catch (error) {}
}
