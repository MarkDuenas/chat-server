const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  avatar: String,
});

const MessageSchema = new mongoose.Schema({
  text: String,
  user: UserSchema,
});

const ChatRoomSchema = new mongoose.Schema({
  name: String,
  messages: [MessageSchema],
  users: [String],
  public: Boolean,
  description: String,
  favoritedBy: [],
});

module.exports = mongoose.model("chatroom", ChatRoomSchema);
