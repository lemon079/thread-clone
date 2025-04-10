"use server";
import { FilterQuery, SortOrder, Types } from "mongoose";
import Community from "@/lib/models/community.model";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
/* eslint-disable */
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import { CommunityPopulated, CommunityType } from "../types";

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
      createdBy: user._id, // Use the mongoose ID of the user
    });

    // Update User model
    user.communities.push(createdCommunity._id);
    await user.save();

    return createdCommunity;
  } catch (error) {
    // Handle any errors
    console.error("Error creating community:", error);
    throw error;
  }
}

export async function fetchCommunityDetails(id: string) {
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
      .populate("members", "id name username image");
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
    // Handle any errors
    console.error("Error fetching community threads:", error);
    throw error;
  }
}

export async function fetchCommunities({
  searchString = "",
  sortBy = "desc",
}: {
  searchString?: string;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter communities.
    const query: FilterQuery<typeof Community> = {};

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the search and sort criteria.
    const communities: CommunityType[] = await Community.find(query)
      .sort(sortOptions)
      .populate("members")
      .exec();

    return { communities };
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}

export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    connectToDB();

    // Find the community by its unique id
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    // Find the user by their unique id
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is already a member of the community
    if (community.members.includes(user._id)) {
      throw new Error("User is already a member of the community");
    }

    // Add the user's _id to the members array in the community
    community.members.push(user._id);
    await community.save();

    // Add the community's _id to the communities array in the user
    user.communities.push(community._id);
    await user.save();

    return community;
  } catch (error) {
    // Handle any errors
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

    return { success: true };
  } catch (error) {
    // Handle any errors
    console.error(
      "Error removing user and their threads from community:",
      error
    );
    throw error;
  }
}

export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  image: string
) {
  try {
    connectToDB();

    // Find the community by its _id and update the information
    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, username, image },
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
