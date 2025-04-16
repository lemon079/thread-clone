/* eslint-disable */
"use server";
import { Document, Types } from "mongoose";
import Community from "@/lib/models/community.model";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import { CommunityType } from "../types";

export async function fetchCommunities() {
  try {
    connectToDB();

    const communities: CommunityType[] = await Community.find({}).populate({
      path: "members",
      model: User,
      select: "name image id _id",
    });

    return communities;
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}

export async function createCommunity(
  id: string,
  name: string,
  imageUrl: string,
  createdBy: string | undefined,
  slug: string
) {
  try {
    connectToDB();

    // Find the user with the provided unique id
    const user = await User.findOne({ id: createdBy });

    if (!user) throw new Error("User not found"); // Handle the case if the user with the id is not found

    const createdCommunity = await Community.create({
      id,
      name,
      bio: slug,
      image: imageUrl,
      createdBy: user._id,
    });

    // Update User model
    user.communities.push(createdCommunity._id);
    await user.save();
    console.log(createdCommunity);

    return createdCommunity;
  } catch (error) {
    // Handle any errors
    console.error("Error creating community:", error);
    throw error;
  }
}

export async function updateCommunityInfo(
  communityId: string,
  name: string,
  image: string | undefined
) {
  try {
    connectToDB();

    // Find the community by its _id and update the information
    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, image },
      { new: true }
    );

    if (!updatedCommunity) {
      throw new Error("Community not found");
    }

    return updatedCommunity;
  } catch (error) {
    // Handle any errors
    console.error("Error updating community information:", error);
    throw error;
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    await connectToDB(); // Ensure database connection

    // Find the community by its ID and delete it
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunity) throw new Error("Community not found");

    // Delete all threads associated with the community
    await Thread.deleteMany({ community: deletedCommunity._id });

    // Remove the community from the 'communities' array for all users
    const communityUsers = await User.find({
      communities: deletedCommunity._id,
    });

    const userUpdatePromises = communityUsers.map(async (user) => {
      user.communities.pull(deletedCommunity._id); // Remove the community from the user's list
      return user.save();
    });

    await Promise.all(userUpdatePromises);

    // Revalidate the homepage (or relevant paths)
    revalidatePath("/");

    return { message: "Community and associated data deleted successfully." };
  } catch (error) {
    console.error("Error deleting community: ", error);
    throw new Error("Failed to delete the community");
  }
}

export async function fetchCommunity(id: string) {
  try {
    connectToDB();

    const communityDetails: CommunityType = await Community.findOne({ id })
      .populate({ path: "createdBy", model: User, select: "name image id" })
      .populate({
        path: "threads",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      })
      .populate("members", "_id id name username image")
      .populate("requests", "_id id name username image email");
    return communityDetails;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching community details:", error);
    throw error;
  }
}

export async function fetchCommunityThreads(id: Types.ObjectId) {
  try {
    connectToDB();

    const community: CommunityType = await Community.findById(id).populate({
      path: "threads",
      model: Thread,
      options: { sort: { createdAt: -1 } }, // 👈 Sort threads by createdAt descending
      populate: [
        {
          path: "community",
          model: Community,
          select: "name image id _id",
        },
        {
          path: "author",
          model: User,
          select: "name image id _id",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image _id id",
          },
        },
      ],
    });

    return community.threads;
  } catch (error) {
    console.error("Error fetching community threads:", error);
    throw error;
  }
}

export async function addUserToCommunity(communityId: string, userId: string) {
  try {
    await connectToDB();

    // Find the community by its unique id
    const community = await Community.findOne({ id: communityId });
    if (!community) throw new Error("Community not found");

    // Find the user by their unique id
    const user = await User.findOne({ id: userId });
    if (!user) throw new Error("User not found");

    // Check if the user is already a member of the community
    if (community.members.includes(user._id)) {
      throw new Error("User is already a member of the community");
    }

    // Add the user's _id to the members array in the community
    community.members.push(user._id);

    // Add the community's _id to the communities array in the user
    user.communities.push(community._id);

    // Save changes to the user
    await user.save();

    // Remove the user's request from the community.requests array
    community.requests.pull(user._id);
    // Save changes to the community
    await community.save();

    // Revalidate the path
    revalidatePath(`/communities/${communityId}`);

    return {
      message: "Success",
    };
  } catch (error) {
    console.error("Error adding member to community:", error);
    throw error;
  }
}

export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    connectToDB();

    // Fetch user and community objects
    const user = await User.findOne({ id: userId }, { _id: 1 });

    const community = await Community.findOne({ id: communityId });

    if (!user) {
      throw new Error("User not found");
    }

    if (!community) {
      throw new Error("Community not found");
    }

    // Find and remove threads authored by the user in the community
    await Thread.deleteMany({ author: user._id });

    // Remove the user's _id from the members array in the community
    await Community.updateOne(
      { members: { $in: user._id } },
      { $pull: { members: user._id } }
    );

    // Remove the community's _id from the communities array in the user
    await User.updateOne(
      { _id: user._id },
      { $pull: { communities: community._id } }
    );

    // Remove the thread if it is a comment
    Thread.deleteMany({ children: { $in: user._id } });

    // revalidate path
    revalidatePath(`/communities/${communityId}`);

    return {
      message: "Success",
    };
  } catch (error) {
    // Handle any errors
    console.error(
      "Error removing user and their threads from community:",
      error
    );
    throw error;
  }
}

export async function RequestToJoinCommunity(
  userId: string,
  communityId: string
) {
  try {
    await connectToDB();

    // Find the user with the provided unique id
    const user = await User.findOne({ id: userId });

    if (!user) throw new Error("User not found");

    const community = await Community.findOne({ id: communityId });

    if (!community) throw new Error("Community not found");

    const _userId = user._id; // dont remove it.

    community.requests.push(_userId);
    await community.save();

    revalidatePath(`/communities/${communityId}`);

    return {
      _id: _userId.toString(),
      requestTime: Date.now(),
      status: 200,
    };
  } catch (error) {
    console.error("Error requesting to join community:", error);
    throw new Error("Failed to send request to community");
  }
}

export async function removeUserFromCommunityRequest(
  communityId: string,
  userId: string
) {
  try {
    connectToDB();

    const user = await User.findOne({ id: userId });

    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      {
        $pull: { requests: user._id },
      },
      { new: true }
    );
    revalidatePath(`/communities/${communityId}`);

    return {
      message: "Success",
    };
  } catch (error) {
    console.error("Failed to remove user from request list:", error);
    throw new Error("Could not remove the user from the request list.");
  }
}
