const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  _id: String,
  name: String,
  avatar: String,
});

const MessageSchema = new mongoose.Schema({
  _id: String,
  createdAt: Date,
  text: String,
  user: UserSchema,

});

const ChatRoomSchema = new mongoose.Schema({
  name: String,
  messages: [MessageSchema],
  users: [String],
  isPublic: Boolean,
  description: String,
  favoritedBy: [],
});

module.exports = mongoose.model("chatroom", ChatRoomSchema);
