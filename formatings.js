/* Vince Dela Roca 30005203 SENG 513 Assignment 3 */ 

const moment = require("moment");

function formatMessage(username, text, color) {
  return {
    username,
    text,
    color,
    time: moment().format("DD MM YYYY h:mm a"),
  };
}

module.exports = formatMessage;
