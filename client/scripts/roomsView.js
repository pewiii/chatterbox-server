// RoomsView is an object which controls the DOM elements
// responsible for displaying and selecting rooms.

var RoomsView = {

  $button: $('#rooms button'),
  $select: $('#rooms select'),

  initialize: function() {
    // TODO: Perform any work which needs to be done
    // when this view loads.
    //RoomsView.rooms = Rooms;
    RoomsView.$select.change(RoomsView.handleChange);
    RoomsView.$button.on('click', RoomsView.handleClick);
  },

  render: function() {
    // TODO: Render out the list of rooms.
    RoomsView.$select.empty();
    var rooms = Rooms.getRooms();
    _.each(rooms, function(room) {
      RoomsView.$select.append('<option value="' + room + '">' + room + '</option>');
    });
    RoomsView.renderRoom('lobby');
  },

  renderRoom: function(roomname) {
    // TODO: Render out a single room.
    MessagesView.$chats.empty();
    if (!Rooms.checkRoomExists(roomname)) {
      RoomsView.$select.append('<option value="' + roomname + '">' + roomname + '</option>');
    }
    Rooms.add(roomname);
    RoomsView.$select.val(roomname);

    MessagesView.render();
  },

  handleChange: function(event) {
    // TODO: Handle a user selecting a different room.

    RoomsView.renderRoom(event.target.value);

  },

  handleClick: function(event) {
    // TODO: Handle the user clicking the "Add Room" button.
    var room = $('#message').val();
    RoomsView.$select.append('<option value="' + room + '">' + room + '</option>');
    Rooms.add(room);
    RoomsView.renderRoom(room);
    console.log(room);
  }


};
