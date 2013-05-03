var lastid;
var userid;
var datestring = new Date().getTime();

function receiver() {
	setInterval(parse, 5000);
}

function parse() {
		try {
			lastid = getlast(datestring);
			userid = localStorage['myId'];
			if (typeof userid === "undefined" || userid == "-1") return;
			if (lastid != -1) {
				$.get("/messages?lastid=" + lastid + "&userid=" + userid, function(response){
					callback(response);
				});
			}
			else{
				$.get("/messages?userid=" + userid, function(response){
					callback(response);
				});
			}
		}
		catch(error) {
			console.log(error);
		}
}

function callback(response){
	var parsed = JSON.parse('{"messages": '+response+'}');
	var num = parsed.messages.length;
	console.log("Message: "+response);
	console.log("Number of msgs: "+num);
	for(var i = 0; i < num; i++){
		
		/*local storage*/
		var s = '{"sender": "' + parsed.messages[i].sender + '", "message": "' + parsed.messages[i].message + '", "when": "' + parsed.messages[i].when + '"}';
		localStorage[parsed.messages[i].when] = s;

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

function getlast(tempdate){

	for (key in localStorage){
		if(key != 'myId'){
			var getdate = JSON.parse(localStorage[key]);

			if (getdate.when > tempdate){
				return parseInt(localStorage[key].id);
			}
		}
	}
	return -1;
}

