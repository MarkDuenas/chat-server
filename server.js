require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");

const ChatRoom = require("./model/user.model");

app.use(cors());

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//CORS
app.use(function (req, res, next) {
  console.log("CORS");
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/:email", async (req, res) => {
  console.log("GET!");
  let email = req.params.email;
  const publicDb = await ChatRoom.find({ isPublic: true });
  const privateDb = await ChatRoom.find({ isPublic: false });
  const userInPrivateRoomDb = privateDb.filter((room) => {
    if (room.users.includes(email)) {
      return room;
    }
  });
  res.status(200).send({ publicDb, userInPrivateRoomDb });
});

app.get("/room/:id", async (req, res) => {
  console.log(req.params.id);
  let roomDb = await ChatRoom.findById(req.params.id);
  res.status(200).send(roomDb);
});
//test
app.post("/create", async (req, res) => {
  let result = await ChatRoom.create(req.body);
  console.log("NEW ROOM:", result);
  res.status(200).send(result);
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("cleanup", (params) => {
    console.log("user disconnected from", params.query?.chatRoom);
    socket.leave(params.query?.chatRoom);
  });
  socket.on("join", (params) => {
    socket.join(params.query.chatRoom);
    console.log("user connected to ", params.query.chatRoom);
  });

  socket.on("chat message", async (msg) => {
    console.log("message room id before DB UPDATE:", msg.ChatRoomID);
    // console.log("MESSAGE IS SENT TO ROOM: ", socket.handshake.query.chatRoom);
    io.in(msg.ChatRoomID).emit("new message", msg);
    await ChatRoom.findByIdAndUpdate(
      { _id: msg.ChatRoomID },
      { $push: { messages: msg } }
    );
  });
});

mongoose.connect(process.env.MONGODB_URI, mongooseOptions).then(() => {
  console.log("Database up and running!");
  server.listen(process.env.PORT, () =>
    console.log(`Server up on ${process.env.PORT}`)
  );
});
