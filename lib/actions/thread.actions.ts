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
    console.log("path: ", path);
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
      .populate("author")
      .populate("community");

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
  threadId: string;
  path: string;
  communityId: string | null;
}) {
  connectToDB();
  try {
    // removing quotes from the userId to convert into ObjectId ref
    userId = removeQuotes(userId);
    const authorId = new mongoose.Types.ObjectId(userId);

    const community = communityId ? await Community.findOne({ community: communityId }) : null;

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
      options: { sort: { createdAt: "desc" } },
      populate: [
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
          },
        },
        {
          path: "community",
          model: Community,
        },
      ],
    });

    return threads;
  } catch (error: any) {
    console.log(`Error Fetching User Threads ${error.message}`);
  }
}

export async function fetchThreadsReplies(userId: string) {
  try {
    connectToDB();

    const replies = await Thread.find({
      author: userId,
      parentId: { $ne: null },
    }).populate("author", "name id _id image");

    return replies;
  } catch (error: any) {
    console.log(`Error Fetching User Threads ${error.message}`);
  }
}
