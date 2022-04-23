// FormView is an object which houses all the message form functionality.
// Consider the provided code and complete the functionality.
// Apply what you learn here to other interactive views if necessary.

var FormView = {

  $form: $('form'),

  initialize: function() {
    FormView.$form.on('submit', FormView.handleSubmit);
  },

  handleSubmit: function(event) {
    // Stop the browser from submitting the form
    event.preventDefault();
    var text = $('#message').val();
    var message = {roomname: Rooms.checkRoomSelected(), text: text, username: App.username};
    Parse.create(message, function(data) {
      console.log('success');
      //var msg = JSON.parse(data);
      // if (typeof data === 'string') {
        // data = JSON.parse(data);
      // }
      console.log(data);
      Messages.addMessage(data);
      MessagesView.renderMessage(data);
    }, function(data) {
      console.log('POST Fail:  ' + JSON.stringify(data));
    });
    // TODO: Currently, this is all handleSubmit does.
    // Make this function actually send a message to the Parse API.
  },

  setStatus: function(active) {
    var status = active ? 'true' : null;
    FormView.$form.find('input[type=submit]').attr('disabled', status);
  }

};