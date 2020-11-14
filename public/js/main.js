/* Vince Dela Roca 30005203 SENG 513 Assignment 3 */ 

const socket = io();
const room = "chatapp";
let username = "";
let nameChangeRequest = "";
let color = "";

/* Get Cookie of Username */
if (getCookie("UserName") == null) {
  let userId = Math.ceil(Math.random(1, 2000) * 100000);
  username = "User-" + userId;
  color = "#f15331";
  setCookie("UserName", username, 365);
  setCookie("color", color, 365);
} else {
  username = getCookie("UserName");
  color = getCookie("color");
}

/* Join Chatroom */
console.log("color", color);
socket.emit("joinChat", { username, room, color });
function sendMessage(messageText) {
  let message = messageText;
  if (message.length >= 5) {
    let nameString = message.substring(0, 5);
	
    /* Name Command Check */
    if (nameString == "/name") {
      console.log("found name command");
      let newUserName = message.substring(
        message.indexOf("{") + 1,
        message.indexOf("}")
      );
      if (newUserName.length == 0) {
        alert("Invalid Name Entered");
      } else {
        nameChangeRequest = newUserName;
        socket.emit("changeNameRequest", newUserName);
      }
    } else {
      console.log("else working");
	  
      /* Color Command Check */
      let colorString = message.substring(0, 6);
      if (colorString == "/color") {
        let newColorCode = message.substring(
          message.indexOf("{") + 1,
          message.indexOf("}")
        );
        if (newColorCode.length !== 6) {
          alert("Invalid Color Code Entered");
        } else {
          newColorCode = "#" + newColorCode;
          socket.emit("changeColorRequest", newColorCode);
          color = newColorCode;
          setCookie("color", color, 365);
        }
      } else {
        socket.emit("sendMessage", messageText);
      }
    }
  } else {
    socket.emit("sendMessage", messageText);
  }

  $("#write_msg").val("");
  $("#write_msg").focus();
}

/* Error */
socket.on("errorMessage", (message) => {
  console.log(message);
  if (message.success == true) {
    username = nameChangeRequest;
    setCookie("UserName", username, 365);
  } else {
    alert(message.message);
  }
});

socket.on("messageRecieved", (message) => {
  let html = ``;
  $("#welcome-text").html("User " + username);
  if (message.username == username) {
    html = `<div class="outgoing_msg">
    <div class="sent_msg">
      <p style="font-weight:bold;">${message.text}</p>
      <span class="msg_time"> ${message.time}</span>
    </div>
  </div>`;
  } else {
    html = `<div class="arriving_msg">
    <div class="arriving_msg_img">
      <span style="font-weight: bold; color: ${message.color}">${message.username}</span>
    </div>
    <div class="delivered_msg">
      <div class="delivered_withd_msg">
      <p>${message.text}</p>
      <span class="msg_time"> ${message.time}</span>
      </div>
    </div>
  </div>`;
  }

  $("#messaging_history").append(html);
  $(".messaging_history")
    .stop()
    .animate({ scrollTop: $(".messaging_history")[0].scrollHeight }, 1000);
});

/* Show User List */
function showAllConnectedUsers(users) {
  let html = ``;
  $("#connected_people").html("");
  for (let i = 0; i < users.length; i++) {
    html = `  <div class="single_connected_user">
    <h5>${users[i].username}</h5>
  </div>`;
    $("#connected_people").append(html);
  }
}

/* Get Active Users */
socket.on("activeUsers", ({ room, users }) => {
  showAllConnectedUsers(users);
});

$("body").delegate("#messageSendButton", "click", function () {
  let message = $("#write_msg").val();
  sendMessage(message);
});

$("body").delegate("#write_msg", "keyup", function (e) {
  e.preventDefault();

  let message = e.target.value; //🙂 🙁 😮
  let first_emoji = ":\\)";
  let second_emoji = ":\\(";
  let third_emoji = ":o";
  if (e.keyCode === 13) {
    sendMessage(message);
  }

  /* Emoji Checker */
  if (message.search(first_emoji) > -1) {
    let index = message.search(first_emoji);
    let firstString = message.substring(0, index);
    let secondString = message.substring(index + 2, message.length);
    message = firstString + "🙂" + secondString;
    $("#write_msg").val(message);
  } else if (message.search(second_emoji) > -1) {
    let index = message.search(second_emoji);
    let firstString = message.substring(0, index);
    let secondString = message.substring(index + 2, message.length);
    message = firstString + "🙁" + secondString;
    $("#write_msg").val(message);
  } else if (message.search(third_emoji) > -1) {
    let index = message.search(third_emoji);
    let firstString = message.substring(0, index);
    let secondString = message.substring(index + 2, message.length);
    message = firstString + "😮" + secondString;
    $("#write_msg").val(message);
  }
});


/* Set Cookie */
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/* Get Cookie */
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
