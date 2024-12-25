/* eslint-disable */
"use server";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { removeQuotes } from "../utils";
import Community from "../models/community.model";

export async function createThread({
  text,
  author,
  communityId,
  path,
}: {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}) {
  author = removeQuotes(author);
  connectToDB();

  try {
    const createdThread = await Thread.create({
      text,
      author,
      community: communityId,
    });

    // push the thread to the user's threads array
    await User.findByIdAndUpdate(
      author,
      {
        $push: {
          threads: createdThread._id,
        },
      },
      { new: true }
    );

    // push the thread to the community's threads array
    if (!communityId) {
      await Community.findByIdAndUpdate(author, {
        $push: {
          threads: createdThread._id,
        },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    console.log(`Error Creating Thread ${error.message}`);
  }
}

export async function fetchThread(pageNumber = 1, pageSize = 20) {
  connectToDB();
  try {
    // calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // fetching posts that have no parents (top-level threads)
    const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: Thread })
      .populate({
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      })
      .populate("author");

    const totalThreadCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const threads = await threadsQuery.exec();

    const isNext = totalThreadCount > skipAmount + threads.length; // return true or false;

    return { threads, isNext };
  } catch (error: any) {
    console.log(`Error fetching Threads ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  connectToDB();
  try {
    // TODO: Populate community
    const thread = await Thread.findById(threadId)
      .populate("author", "_id id name image")
      .populate({
        path: "children",
        model: Thread,
        populate: "author",
      });

    return thread;
  } catch (error: any) {
    console.log(`Error fetching Thread ${error.message}`);
  }
}

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: {
  commentText: string;
  userId: string;
  threadId: string;
  path: string;
}) {
  connectToDB();
  try {
    // removing quotes from the userId to convert into ObjectId ref
    userId = removeQuotes(userId);
    const authorId = new mongoose.Types.ObjectId(userId);

    // find original thread by id
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) throw new Error("Thread Not Found");

    // create a comment document
    const commentThread = await Thread.create({
      text: commentText,
      author: authorId,
      parentId: threadId,
    });

    // update original thread to include this comment document to its children
    originalThread.children.push(commentThread._id); // as the children takes the _id of the thread
    await originalThread.save();

    // revalidate the path
    revalidatePath(path);
  } catch (error: any) {
    console.log(`Error Adding Comment ${error.message}`);
  }
}

export async function fetchUserThreads(userId: string) {
  try {
    connectToDB();

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
        },
      },
    });

    return threads;
  } catch (error: any) {
    console.log(`Error Fetching User Threads ${error.message}`);
  }
}
