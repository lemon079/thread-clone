import mongoose, { Schema, model } from "mongoose";

const communitySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    image: {
      type: String,
    },
    threads: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thread",
      },
    ],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    requests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Community =
  mongoose.models.Community || model("Community", communitySchema);

export default Community;
