// This object houses all the message _data_ for the app.
// Treat it like a data structure - add methods to interact
// with and manipulate the data.

var Messages = {

  // TODO: Define how you want to store your messages.
  _data: {},

  // TODO: Define methods which allow you to retrieve from,
  // add to, and generally interact with the messages.
  addMessage: function(data) {
    if (!Messages._data[data.roomname]) {
      Messages._data[data.roomname] = [];
    }
    Messages._data[data.roomname].push(data);
  },

  getMessages: function(roomname) {
    return Messages._data[roomname];
  }

};