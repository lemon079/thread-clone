import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
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
  threads: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});

userSchema.index({ id: 1 }); // Primary lookup
userSchema.index({ username: 1 }); // Search
userSchema.index({ createdAt: -1 }); // Sorting

const User = mongoose.models.User || model("User", userSchema);

export default User;
