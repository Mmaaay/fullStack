import mongoose from ".mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  Thumbnail: String,
  Prompt: String,
  Video: String,
  UserId: String,
});
