/* Vince Dela Roca 30005203 SENG 513 Assignment 3 */ 

const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./formatings");
const {
  UserConnected,
  getCurrentUser,
  userDisconnected,
  getActiveUsers,
  updateName,
  updateColor,
} = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

/*/ Static Folder */
app.use(express.static(path.join(__dirname, "public")));

const botName = "Server";

/* Run on client connect */
io.on("connection", (socket) => {
  socket.on("joinChat", ({ username, room, color }) => {
    const user = UserConnected(socket.id, username, room, color);

    socket.join(user.room);

    // Welcome current user
    socket.emit(
      "messageRecieved",
      formatMessage(botName, "Welcome " + username + "!", "#8291ad")
    );

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "messageRecieved",
        formatMessage(
          botName,
          `${user.username} has joined the chat`,
          "#8291ad"
        )
      );

    // Send users and room info
    io.to(user.room).emit("activeUsers", {
      room: user.room,
      users: getActiveUsers(user.room),
    });
  });
  
  /* Listen for name change */
  socket.on("changeNameRequest", (newName) => {
    const previousUser = getCurrentUser(socket.id);

    let result = updateName(socket.id, newName);
    if (result) {
      const user = getCurrentUser(socket.id);
      io.to(socket.id).emit("errorMessage", {
        success: true,
        message: "Name changed.",
      });
      io.to(user.room).emit(
        "messageRecieved",
        formatMessage(
          user.username,
          `<i>changed the name to ${user.username}</i>`,
          user.color
        )
      );

      io.to(user.room).emit("activeUsers", {
        room: user.room,
        users: getActiveUsers(user.room),
      });
    } else {
      io.to(socket.id).emit("errorMessage", {
        success: false,
        message: "Name already exists. Try again.",
      });
    }
  });

  /* Listen for color change */
  socket.on("changeColorRequest", (newColor) => {
    updateColor(socket.id, newColor);
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit(
      "messageRecieved",
      formatMessage(user.username, `<i>changed username color</i>`, user.color)
    );

    io.to(user.room).emit("activeUsers", {
      room: user.room,
      users: getActiveUsers(user.room),
    });
  });

  /* Listen for message sent */
  socket.on("sendMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    console.log(user);
    io.to(user.room).emit(
      "messageRecieved",
      formatMessage(user.username, msg, user.color)
    );
  });

  /* Run when client disconnects */
  socket.on("disconnect", () => {
    const user = userDisconnected(socket.id);

    if (user) {
      io.to(user.room).emit(
        "messageRecieved",
        formatMessage(botName, `<i>${user.username} has left the chat</i>`, "#8291ad")
      );

      /* Send users room and info */
      io.to(user.room).emit("activeUsers", {
        room: user.room,
        users: getActiveUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
