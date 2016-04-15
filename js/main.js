jQuery(document).ready(function($){

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

	$('#messageHolder').bind('scroll', function(){
		if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight){
			$(this).removeClass();
      $(this).addClass('thumbBottom').animate(1000);
    }
    else if($(this).scrollTop() + $(this).innerHeight() < $(this)[0].scrollHeight && $(this).scrollTop() + $(this).innerHeight() > $(this).innerHeight()){
			$(this).removeClass();
      $(this).addClass('thumbMiddle').animate(10000);
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

  var myDataRef = new Firebase('https://fireside-chat.firebaseio.com/');
    $('#messageInput').keypress(function (e) {
      if (e.keyCode == 13) {
        var name = $('#nameInput').val();
        var text = $('#messageInput').val();
        myDataRef.push({name: name, text: text});
        $('#messageInput').val('');
      }
    });

    myDataRef.on('child_added', function(snapshot) {
      var message = snapshot.val();
      displayChatMessage(message.name, message.text);
    });

    function displayChatMessage(name, text) {
      if(name == $('#nameInput').val()){
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