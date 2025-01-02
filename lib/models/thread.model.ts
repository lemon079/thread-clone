import mongoose, { model, Schema } from "mongoose";

const threadSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: Schema.Types.ObjectId,
    ref: "Community",
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ], // Missing comma was here

  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    // creating parentId in case this thread is a comment
    type: String,
    default: null,
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thread", // recursion, one thread can have multiple threads as children
    },
  ],
});

const Thread = mongoose.models.Thread || model("Thread", threadSchema);

export default Thread;
