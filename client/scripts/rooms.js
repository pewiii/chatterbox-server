// This object houses all the room _data_ for the app.
// Treat it like a data structure - add methods to interact
// with and manipulate the data.

var Rooms = {

  // TODO: Define how you want to store the list of rooms
  _data: {},

  // TODO: Define methods which allow you to add rooms, update the list,
  // mark a room as selected, etc.
  add: function(roomName) {
    Rooms._data[roomName] = roomName;
  },

  getRooms: function() {
    return Object.keys(Rooms._data);
  },

  checkRoomExists: function(roomName) {
    if (Rooms._data[roomName] !== undefined) { return true; }
  },

  checkRoomSelected: function() {
    return $('#rooms select').find(':selected').text();
  },

};