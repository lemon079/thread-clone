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
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
    default: null,
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
});

// thread.model.ts  
threadSchema.index({ author: 1, createdAt: -1 }); // User's threads
threadSchema.index({ parentId: 1 }); // Comments lookup

const Thread = mongoose.models.Thread || model("Thread", threadSchema);

export default Thread;