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

	/*$('#messageHolder').scroll(function(){
		if($('#messageHolder').scrollTop() + $('#messageHolder').height() == $('#messageHolder').height()) {
       		alert("middle");
   		}
   		else if($('#messageHolder').scrollTop() == 0){
   			alert("topkek");
   		}
	});*/

  function memes(){
    alert('memes');
  }

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

	$('#messageHolder').bind('scroll', function(){
		if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight){
			$(this).removeClass();
    }
    else if($(this).scrollTop() + $(this).innerHeight() < $(this)[0].scrollHeight && $(this).scrollTop() + $(this).innerHeight() > $(this).innerHeight()){
			$(this).removeClass();
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

  $('#createChat').click(function(){
    var isCreatable = true
    $("#existingChats > option").each(function() {
      if ($('#chatInput').val() == $(this).val()){
        isCreatable = false;
      }
    });

    if($('#chatInput').val().length >= 4 && isCreatable == true){
      $('<option/>').text($('#chatInput').val()).appendTo($('#existingChats'));
      rooms.push($('#chatInput').val());
      swal("Success!", "You've opened a new chat!", "success");
      var mostRecentChat = rooms[rooms.length - 1]
      /*myDataRef.push(mostRecentChat);*/
      /*rooms.push($('#chatInput').val());*/
    }else if (isCreatable == false){
      swal("Oh no!", "Please come up with a unique name for your chat.", "error");
    }else{
      sweetAlert("Oops...", "Please make sure the name of your chat room is longer than three characters.", "error");
    }
  });

  $('#existingChats').change(function(){
    currentChat = $('#existingChats').find(":selected").text();
    /*alert(currentChat)*/
  });

  $('#messageInput').keypress(function (e) {
    if (e.keyCode == 13) {
      currentChat = $('#existingChats').find(":selected").text();
      /*var name = $('#nameInput').val();*/
      var text = $('#messageInput').val();
      /*myDataRef.push({name: llamo, text: text});*/
      /*un = myDataRef.child(currentChat)
      un.push({name: llamo, text: text});*/
      myDataRef.child(currentChat).push({name: llamo, text: text});
      /*kidPath = myDataRef.child(currentChat).toString();
      kidReference = new Firebase(kidPath)*/
      $('#messageInput').val('');
     /* alert(myDataRef.child(currentChat))
      alert(un)*/
    }
  });

  myDataRef.child(currentChat).on('child_added', function(snapshot) {
    var message = snapshot.val();
      displayChatMessage(message.name, message.text);
  });

  function displayChatMessage(name, text) {
    if(name == llamo){
      $('<div style="text-align: right;"><div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messages'));
      $('#messageHolder')[0].scrollTop = $('#messages')[0].scrollHeight;
    }
    else{
      $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messages'));
      $('#messageHolder')[0].scrollTop = $('#messages')[0].scrollHeight;
    }
  };

});

//http://stackoverflow.com/questions/12555258/set-webkit-scrollbar-thumb-visibility-in-jquery
//http://stackoverflow.com/questions/8525221/programmatically-setting-the-name-of-a-variable