/* eslint-disable */
"use server";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import mongoose, { Types } from "mongoose";
import { removeQuotes } from "../utils";
import Community from "../models/community.model";
import { ThreadType } from "../types";

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
    let createdThread;

    if (communityId) {
      // Find the community by its 'id'
      const community = await Community.findOne({ id: communityId });

      // Create the thread with the community reference
      createdThread = await Thread.create({
        text,
        author,
        community: community?._id || null,
      });

      // Push the thread to the community's threads array
      await Community.findByIdAndUpdate(community._id, {
        $push: { threads: createdThread._id },
      });
    } else {
      // Create the thread without community reference
      createdThread = await Thread.create({
        text,
        author,
        community: null,
      });
    }

    // Push the thread to the user's threads array
    await User.findByIdAndUpdate(
      author,
      { $push: { threads: createdThread._id } },
      { new: true }
    );

    revalidatePath(path);
  } catch (error: any) {
    console.log(`Error Creating Thread ${error.message}`);
  }
}

export async function fetchThread() {
  connectToDB();
  try {
    const threads: ThreadType[] = await Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
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
      .populate("author")
      .populate("community")
      .exec();

    return { threads };
  } catch (error: any) {
    console.log(`Error fetching Threads ${error.message}`);
    throw error;
  }
}

export async function fetchThreadById(threadId: string) {
  connectToDB();
  try {
    const thread: ThreadType = await Thread.findById(threadId)
      .populate("author", "_id id name image")
      .populate({
        path: "children",
        model: Thread,
        options: { sort: { createdAt: "desc" } }, // Sort children by createdAt in descending order
        populate: { path: "author", model: User },
      })
      .populate("community")
      .sort({ createdAt: "desc" });

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
  communityId,
}: {
  commentText: string;
  userId: string;
  threadId: Types.ObjectId | string;
  path: string;
  communityId: string | null;
}) {
  connectToDB();
  try {
    // removing quotes from the userId to convert into ObjectId ref
    userId = removeQuotes(userId);
    const authorId = new mongoose.Types.ObjectId(userId);

    const community = communityId
      ? await Community.findOne({ community: communityId })
      : null;

    // find original thread by id
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) throw new Error("Thread Not Found");

    // create a comment document
    const commentThread = await Thread.create({
      text: commentText,
      author: authorId,
      community: community ? community._id : null,
      parentId: threadId,
    });

    // update original thread to include this comment document to its children
    originalThread.children.push(commentThread._id);
    await originalThread.save();

    // revalidate the path
    revalidatePath("/thread/[id]");
    return commentThread;
  } catch (error: any) {
    console.log(`Error Adding Comment ${error.message}`);
  }
}

export async function fetchUserThreads(userId: Types.ObjectId) {
  try {
    connectToDB();

    const threads: ThreadType[] = await Thread.find({
      $or: [{ author: userId }],
    })
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        model: Thread,
        match: { author: userId },
        select: "_id content author createdAt",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      });

    return threads;
  } catch (error: any) {
    console.log(`Error Fetching User Threads ${error.message}`);
  }
}

export async function fetchThreadsReplies(userId: string) {
  try {
    connectToDB();

    const replies: ThreadType[] = await Thread.find({
      author: userId,
      parentId: { $ne: null },
    }).populate("author", "name id _id image");

    return replies;
  } catch (error: any) {
    console.log(`Error Fetching User Threads ${error.message}`);
  }
}

export async function addLikeToThread(userId: string, threadId: any) {
  connectToDB();
  try {
    threadId = removeQuotes(threadId);
    const user = await User.findOne({ id: userId });
    const { likes }: any = await Thread.findByIdAndUpdate(
      { _id: threadId },
      { $addToSet: { likes: user._id } },
      { new: true }
    ).lean();
    revalidatePath(`/thread/${threadId}`);
    return likes;
  } catch (error: any) {
    console.log(`Error incrementing likes ${error.message}`);
  }
}

export async function removeLikeFromThread(userId: string, threadId: any) {
  connectToDB();
  try {
    threadId = removeQuotes(threadId);
    const user = await User.findOne({ id: userId });
    const { likes }: any = await Thread.findByIdAndUpdate(
      { _id: threadId },
      { $pull: { likes: user._id } },
      { new: true }
    ).lean();

    revalidatePath(`/thread/${threadId}`);
    return likes;
  } catch (error: any) {
    console.log(`Error decrementing likes ${error.message}`);
  }
}
