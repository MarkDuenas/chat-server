require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

app.get("/");

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("chat message", (msg) => {
    console.log("Message: ", msg);
  });
});

mongoose.connect(process.env.MONGODB_URI, mongooseOptions).then(() => {
  console.log("Database up and running!");
  server.listen(process.env.PORT, () =>
    console.log(`Server up on ${process.env.PORT}`)
  );
});
