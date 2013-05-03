var myLat;
var myLng;

function init(){
	base_url = $('#base_url').val();
	var options =
	{
		zoom: 13,
		center: new google.maps.LatLng(42.3790083,-71.0986),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map($('#map')[0],options);
	
	if(getMyLocation()){
		drawMe();
		getId(myLat, myLng);
	}
	else{
		localStorage.setItem('myId',-1)
	}
		
}

function getMyLocation(){
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			return true;
		});
	}
	else {
		//If this is the case, then the user will NOT be allowed
		//to send messages.
		alert("Geolocation is not supported by your web browser.");
		return false;
	}
}
function drawMe(){
	meMarker = new google.maps.Marker({
		position: new google.maps.LatLng(myLat,myLng),
		title: "You are here",
		icon: {
			origin: new google.maps.Point(636,11),
			size: new google.maps.Size(23,23),
			url: base_url + "images/traffic_jammin_sprites.png"
			},
		map: map
	});
}

function getId(lat, lng){
	var myLocation = lat.toString() + ',' + lng.toString();
	$.post("/new_user/", {'latlng' : myLocation}, function(response){
		localStorage.setItem('myId', response);
	});
}

function drawSomeone(someLat, someLng){
	someMarker = new google.maps.Marker({
		position: new google.maps.LatLng(someLat, someLng),
		title: "Some Jackass",
		icon:{
			origin: new google.maps.Point(667,12),
			size: new google.maps.Size(23,23),
			url: base_url + "images/traffic_jammin_sprites.png"
			},
		map: map
	});
}

//attempting to use enter key for submission
/*
$("textarea#message").keypress(function(){
	if($(this).keyCode == 13){
		send($(this).value);
	}
})*/

function send(formdata){

	var str = formdata.message.value;
	formdata.message.value = '';
	if (str != '') {
		/*sending to server*/
		var idnum = localStorage['myId'];
		var toSend = {"sender":idnum, "message":str, "location":(myLat + ',' + myLng)};

		/*
		The server will respond back with a JSON object with three fields:

		Field Name .. | Representation
		-------------------------------
		group_id .... | The id number of the group
		center_latlng | Center of the circle of the users current group
		radius ...... | Radius of said circle
		*/
		
		$.post("/send_message/", toSend, function(status){
			/*element creation*/
			var speechbox = $('<p></p>');
			var namespan = $("<p></p>").text('Me: ');
			var messpan = $("<p></p>").text(str);

			/*setting attributes*/
			speechbox.attr('class', 'you');
			namespan.attr('class', 'name');
			messpan.attr('class', 'message');
			
			/*appending new message*/
			speechbox.append(namespan, messpan);
			$('#mboard').append(speechbox);
			var chatdiv = $('#chat');
			chatdiv.animate({ scrollTop: chatdiv.prop("scrollHeight") - chatdiv.height() }, 0);
			
		});
	}
}

