// MessagesView is an object which controls the DOM elements
// responsible for displaying messages.

var MessagesView = {

  $chats: $('#chats'),

  initialize: function() {
    // TODO: Perform any work which needs to be done
    // when this view loads.
    $('.username').on('click', MessagesView.handleClick);
  },

  render: function() {
    // TODO: Render _all_ the messages.
    var room = Rooms.checkRoomSelected();
    var messages = Messages.getMessages(room);
    _.each(messages, function(message) {
      if (message.text.includes('<script')) {
        return;
      }
      if (Friends.toggleStatus(message.username)) {
        message.friend = 'friend';
      } else {
        message.friend = 'nofriend';
      }
      message = MessageView.render(message);
      message.text;
      MessagesView.$chats.append(message);
    });
    MessagesView.initialize();
  },

  renderMessage: function(message) {
    // TODO: Render a single message.
    message.friend = Friends.toggleStatus(message.username) ? 'friend' : 'nonfriend';
    var message = MessageView.render(message);
    MessagesView.$chats.prepend(message);
  },

  handleClick: function(event) {
    // TODO: handle a user clicking on a message
    // (this should add the sender to the user's friend list).
    console.log(event.target.innerText);
    Friends.addFriend(event.target.innerText);
    MessagesView.$chats.empty();
    MessagesView.render();
  }

};
