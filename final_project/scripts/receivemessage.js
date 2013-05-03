var lastid;
var userid;
var datestring = new Date().getTime();

function receiver(){

	setInterval(parse, 5000);

}

function parse() {
		try{
			lastid = getlast(datestring);
			userid = localStorage['myId'];
			if(lastid != -1){
				$.get("/messages?lastid=" + lastid + "&userid=" + userid, function(status){
					if (status === 'success'){
						callback();
					}
				});
			}
			else{
				$.get("/messages?userid=" + userid, function(status){
					if (status === 'success'){
						callback();
					}
				});
			}
		}
		catch(error){
			alert('Sumthin\'s wrong, yo');
		}
		finally{
			alert('this is a webpage that may or may not have loaded correctly');
		}
}

function callback(){
	if (request.readyState == 4 && request.status == 200) {
		
		var str = '{"messages":' + request.responseText + '}';
		var parsed = JSON.parse(str);
		var num = parsed.messages.length;

		for(var i = 0; i < num; i++){

			/*local storage*/
			var s = '{"sender": "' + parsed.messages[i].sender + '", "message": "' + parsed.messages[i].message + '", "when": "' + parsed.messages[i].when + '", "id": ' + parsed.messages[i].id + '"}';
			localStorage[new Date().getTime()] = s;

			/*element creation*/
			var speechbox = $("<p></p>");
			var namespan = $("<span></span>").text(parsed.messages[i].sender + ': ');
			var messpan = $("<span></span>").text(parsed.messages[i].message);
		
			/*setting attributes*/
			speechbox.attr('class', 'someone');
			namespan.attr('class', 'name');
			messpan.attr('class', 'message');

			/*appending new message*/
			speechbox.append(namespan, messpan);
			$('#mboard').append(speechbox);

			/*setting new datestring*/
			datestring = parsed.messages[i].when;
		}
	}
}

function getlast(tempdate){

	for (key in localStorage){
		if(key != 'myId'){
			var getdate = JSON.parse(localStorage[key]);

			if (getdate.date > tempdate){
				return Math.floor(localStorage[key].id);
			}
		}
	}
	return -1;
}

