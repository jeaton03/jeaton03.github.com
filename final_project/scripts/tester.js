
function bubble(){
		
	//str = '{\"message\":' + request.responseText + "}";
	//var str = '{\"message\":[{\"username\":\"Brian\",\"input\":\"HA I trolled Ming!!\", \"latitude\": \"5\", \"longitude\":\"10\"}]}';
	//var parsed = JSON.parse(str);
	
	var str = formdata.user.value;
	formdata.user.value = '';


	
	var speechbox = $('<p></p>');
	
	speechbox.attr('class', 'you');
	
	var namespan = $("<p></p>").text(parsed.message[0].username + ': ');
	//var name = document.createTextNode('Brian: ');

	namespan.attr('class', 'name');

	var messpan = $("<p></p>").text(parsed.message[0].input);
	//var message = document.createTextNode(str);

	messpan.attr('class', 'message');

	speechbox.append(namespan, messpan);
	
	$('#mboard').append(speechbox);
	var chatdiv = $('#chat');
	chatdiv.animate({ scrollTop: chatdiv.prop("scrollHeight") - chatdiv.height() }, 0);

	/*response*/
	/*var resp = '{\"poop\":[{\"username\":\"Ming\",\"input\":\"So do you have any QUESTIONS? adskfjakslgj?????????????????how dare you use EVALLLLLL!\", \"latitude\": \"5\", \"longitude\":\"10\"}]}';
	var parseresp = JSON.parse(resp);
	var rspbox = document.createElement('p');
	rspbox.setAttribute('class', 'someone');
	var rspspan = document.createElement("span");
	var rsp = document.createTextNode(parseresp.poop[0].username + ': ');
	rspspan.setAttribute('class', 'name');
	rspspan.appendChild(rsp);
	var mspan = document.createElement('span');
	var m = document.createTextNode(parseresp.poop[0].input);
	mspan.setAttribute('class', 'message');
	mspan.appendChild(m);
	rspbox.appendChild(rspspan);
	rspbox.appendChild(mspan);
	mboard.appendChild(rspbox);*/
}

