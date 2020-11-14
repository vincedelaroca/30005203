/* Vince Dela Roca 30005203 SENG 513 Assignment 3 */ 

const users = [];

/* Join User */
function UserConnected(id, username, room, color) {
  const user = { id, username, room, color };

  users.push(user);

  return user;
}

/* Get User */
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

/* User Disconnect */
function userDisconnected(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

/* Get Userlist */
function getActiveUsers(room) {
  return users.filter((user) => user.room === room);
}

/* Name Update */
function updateName(id, name) {
  const nameIndex = users.findIndex((user) => user.username == name);

  if (nameIndex !== -1) {
    return false;
  } else {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
      users[index].username = name;
      return true;
    } else {
      return false;
    }
  }
}

/* Color Update */
function updateColor(id, color) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    users[index].color = color;
  }
}

module.exports = {
  UserConnected,
  getCurrentUser,
  userDisconnected,
  getActiveUsers,
  updateName,
  updateColor,
};
