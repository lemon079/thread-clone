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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    //creating parentId incase this thread is a comment
    type: String,
    default: null,
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thread", // recursion, means one thread can have multiple threads as children
    },
  ],
});

const Thread = mongoose.models.Thread || model("Thread", threadSchema);

export default Thread;

// Children attribute because
// Thread Original
//  -> Thread Comment1
//  -> Thread Comment2
//     -> Thread Comment3 // comment on the Thread Comment2
