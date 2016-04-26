jQuery(document).ready(function($){

  var myDataRef = new Firebase('https://fireside-chat.firebaseio.com/');
  var llamo;
  var rooms = [];
  var currentChat = "Global";
  /*var kidPath;
  var kidReference;
  var un = myDataRef.child(currentChat)*/

	$('#start_button').click(function(){
		window.location = "chat.html";
	});

//main alert that show up when you first load into chat.html
  $(window).load(function() {
    swal({
      title: "Who are you?",
      text: "Set a name for yourself:",
      type: "input",
      showCancelButton: false,
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: "Name"
    }, function(inputValue) {
        if (inputValue === false) return false;
        if (inputValue === "") {
          swal.showInputError("You need to write something!");
          return false
        }
      swal("Nice!", "Hi " + inputValue + ".");
      llamo = inputValue
    });
  });

//controls the animations for the scrollbar, makes it change when its at the top, the middle, and the bottom.
	$('#messageHolder').bind('scroll', function(){
		if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight){
			$(this).removeClass();
      $(this).addClass('thumbBottom')
    }
    else if($(this).scrollTop() + $(this).innerHeight() < $(this)[0].scrollHeight && $(this).scrollTop() + $(this).innerHeight() > $(this).innerHeight()){
			$(this).removeClass();
      $(this).addClass('thumbMiddle')
    }
	});

	var lastScrollTop = 0;
	$('#messageHolder').scroll(function(event){
   	var st = $(this).scrollTop();
   	if (st < lastScrollTop && $(this).scrollTop() + $(this).innerHeight() <= $(this).innerHeight()){
      $(this).removeClass();
      $(this).addClass('thumbTop').animate(1000);
   	}
    lastScrollTop = st;
  });
//end of scrollbar animations

//function that checks to make sure that you can create a new chat
  $('#createChat').click(function(){
    var isCreatable = true;
    $("#existingChats > option").each(function() {
      if ($('#chatInput').val() == $(this).val()){
        isCreatable = false;
      }
    });

//logic that adds a chat to html or not depending on whether isCreatable = true
    if($('#chatInput').val().length >= 4 && isCreatable == true){
      $('<option/>').text($('#chatInput').val()).appendTo($('#existingChats'));
      rooms.push($('#chatInput').val());
      swal("Success!", "You've opened a new chat, select it in the dropdown menu to start talking!", "success");
      var mostRecentChat = rooms[rooms.length - 1];
      /*myDataRef.push(mostRecentChat);*/
      /*rooms.push($('#chatInput').val());*/
    }else if (isCreatable == false){
      swal("Oh no!", "Please come up with a unique name for your chat.", "error");
    }else{
      sweetAlert("Oops...", "Please make sure the name of your chat room is longer than three characters.", "error");
    }
  });

//function called when you change that chat room, and it displays all the previous messages in that chat room.
  $('#existingChats').change(function(){
    $('#messages').html('');
    currentChat = $('#existingChats').find(":selected").text();
    
    myDataRef.child(currentChat).on('child_added', function(snapshot) {
      var message = snapshot.val();
      displayChatMessage(message.name, message.text);
    });
  });

//when you press enter it sends a message, it writes the data into either the specific chat that you are in, or if the chat doesnt exist, it creates a new chat room and
//adds your name and message into the server
  $('#messageInput').keypress(function (e) {
    if (e.keyCode == 13) {
      if($('#existingChats').find(":selected").text() != "Select Chat Room"){
        currentChat = $('#existingChats').find(":selected").text();
        var text = $('#messageInput').val();
        myDataRef.child(currentChat).push({name: llamo, text: text, identifier:currentChat});
        $('#messageInput').val('');
      }else{
        sweetAlert("Hold on there!", "Please select the chat room you'd like to chat in.", "error");
        $('#messageInput').val('');
      }
    }
  });

//this runs every time data is added to the server. it checks to see if any of the selected chat boxes match the identifier of a message
//the identifier is basically the name of the chat room on the server and depending on whether another user has the chat or not  it will
//add it to their client on startup of the program.
  myDataRef.on('child_added', function(snapshot) {
    snapshot.forEach(function(childSnapshot){
      var serverSideChatName = childSnapshot.child("identifier");
      var chatName = serverSideChatName.val();
      
      var canAddChat = true
      $("#existingChats > option").each(function() {
        if($(this).val() == chatName)
          canAddChat = false;
      }); 

      if(canAddChat == true){
         $('<option/>').text(chatName).appendTo($('#existingChats'));
      } 
    });
  });

// this function dynamically appends html div and em tags to another specified div tag. Within these tags is the data to be written and is sent to all users
//at the same time.
  function displayChatMessage(name, text) {
    if(name == llamo){
      $('<div class = "my_msg"><div/>').text(text + " ").prepend($('<em/>').text(name+': ')).appendTo($('#messages'));
      $('<div class = "line_break"><div/>').appendTo($('#messages'));
      $('#messageHolder')[0].scrollTop = $('#messages')[0].scrollHeight;
    }
    else{
      $('<div class = "their_msg"><div/>').text(text + " ").prepend($('<em/>').text(name+': ')).appendTo($('#messages'));
      $('<div class = "line_break"><div/>').appendTo($('#messages'));
      $('#messageHolder')[0].scrollTop = $('#messages')[0].scrollHeight;
    }
  };

});