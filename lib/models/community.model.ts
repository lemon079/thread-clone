import mongoose, { Schema, model } from "mongoose";

const communitySchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  image: String,
  bio: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  threads: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  members: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: {
    type: Schema.Types.ObjectId,
    ref: "Community",
  },
});

const Community = mongoose.models.Community || model("Community", communitySchema);

export default Community;
