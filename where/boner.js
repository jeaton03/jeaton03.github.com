function parse_t()
{
	var request = new XMLHttpRequest();
	request.open("GET","http://mbtamap-cedar.herokuapp.com/mapper/redline.json",true);
	request.send(null);
	
	request.onreadystatechange = function check()
	{
		if (request.readyState === 4 && request.status === 200)
		{
			data = request.responseText;
			data = JSON.parse(data);
			begin();
		}
	}
}

function begin()
{
	var options =
	{
		zoom: 13,
		center: new google.maps.LatLng(42.3690083,-71.0486),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById('map_canvas'),options);
	
	place_red();
	getMyLocation();
	parse_WalCarm();
}

function place_red()
{
	var image = {url: 't_symbol.png'}
	
	t_stops();
	
	for (var i = 0; i < loc.length; i++)
	{
		var lat = loc[i][2];
		var lng = loc[i][3];
		var new_latlng = new google.maps.LatLng(lat,lng);
	
		var marker = new google.maps.Marker(
		{
			map: map,
			position: new_latlng,
			title: loc[i][4],
			icon: image,
			north: loc[i][0],
			south: loc[i][1]
		});
		
		popup(marker);
	}
	
	place_polyline('RALEN','RNQUN');
	place_polyline('RNQUN','RBRAN');
	one_line('RJFKN','RNQUN');
	one_line('RQUAN','RBRAN');
}

function popup(marker)
{
	infowindow = new google.maps.InfoWindow();
	var info = stop_info(marker);
	
	google.maps.event.addListener(marker,'click',function()
	{
		if (infowindow)
		{
			infowindow.close();
		}
		infowindow.setContent(info);
		infowindow.open(map, marker);
		map.setCenter(marker.position);
	});
}

function stop_info(marker)
{
	var info = marker.title;
	var first = true;

	for (var i = 0; i < data.length; i++)
	{
		if (data[i].PlatformKey == marker.north)
		{
			if (first === true)
			{
				info = info + '<br/>' + 'Time Remaining: Northbound Trains'
				first = false;
			}
			info = info + '<br/>' + data[i].TimeRemaining;
		}
	}
	
	first = true;
	for (var i = 0; i < data.length; i++)
	{
		if (data[i].PlatformKey == marker.south)
		{
			if (first === true)
			{
				info = info + '<br/>' + 'Time Remaining: Southbound Trains'
				first = false;
			}
			info = info + '<br/>' + data[i].TimeRemaining;
		}
	}
	
	return info;
}

function place_polyline(start_stop,last_stop)
{
	var all_latlngs = new Array();
	var i = 0;
	var j = 0;
	for (i = 0; loc[i][0] != start_stop; i++){}

	while (loc[i][0] != last_stop)
	{
		var lat = loc[i][2];
		var lng = loc[i][3];
		all_latlngs[j] = new google.maps.LatLng(lat,lng);
		i++;
		j++;
	}

	var line = new google.maps.Polyline(
	{
		map: map,
		path: all_latlngs,
		strokeColor: '#FF0000',
		strokeWeight: 5
	});
}

function one_line(first,second)
{
	var i;
	var j;
	for (i = 0; loc[i][0] != first; i++) {}
	for (j = 0; loc[j][0] != second; j++) {}
	var loc1 = new google.maps.LatLng(loc[i][2],loc[i][3]);
	var loc2 = new google.maps.LatLng(loc[j][2],loc[j][3]);
	
	var line = new google.maps.Polyline(
	{
		map: map,
		path: [loc1,loc2],
		strokeColor: '#FF0000',
		strokeWeight: 5
	});
	
}

function place_me()
{
	var image = {url: 'me.png'}
	
	var marker = new google.maps.Marker(
	{
		map: map,
		position: myLatLng,
		title: 'Me',
		icon: 'me.png'
	});
	
	me_popup(marker);
}

function me_popup(marker)
{
	infowindow = new google.maps.InfoWindow();
	var info = 'You are here!' + '<br/>';
	info = info + 'Latitude: ' + myLat + '<br/>';
	info = info + 'Longitude: ' + myLng;
	
	google.maps.event.addListener(marker,'click',function()
	{
		if (infowindow)
		{
			infowindow.close();
		}
		infowindow.setContent(info);
		infowindow.open(map, marker);
		map.setCenter(marker.position);
	});
	other_info();/////////--------------------------------------------------------------------------
}

function getMyLocation()
{
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(function(position)
		{
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			myLatLng = new google.maps.LatLng(myLat,myLng);
			place_me();
		});
	}
	else
	{
		alert("Geolocation is not supported by your web browser.");
	}
}

function parse_WalCarm()
{
	var request = new XMLHttpRequest();
	request.open("GET","http://messagehub.herokuapp.com/a3.json",true);
	request.send(null);
	
	request.onreadystatechange = function check()
	{
		if (request.readyState === 4 && request.status === 200)
		{
			WalCarm = request.responseText;
			WalCarm = JSON.parse(WalCarm);

			pin_WalCarm();
		}
	}
}

function pin_WalCarm()
{
	for (var i = 0; i < WalCarm.length; i++)
	{
		var lat = WalCarm[i].loc.latitude;
		var lng = WalCarm[i].loc.longitude;
		var latlng = new google.maps.LatLng(lat,lng)
		
		if (WalCarm[i].name === 'Waldo')
		{
			var image = {url: 'waldo.png'};
		}
		else if (WalCarm[i].name === 'Carmen Sandiego')
		{
			var image = {url: 'carmen.png'};
		}
		
		var marker = new google.maps.Marker(
		{
			map: map,
			position: latlng,
			title: WalCarm[i].name,
			icon: image,
			lat: lat,
			lng: lng
		});
		
		WalCarm_popup(marker,i);
	}
}

function WalCarm_popup(marker,counter)
{
	infowindow = new google.maps.InfoWindow();
	
	var info = WalCarm[counter].loc.note;
	info = info + '<br/>' + WalCarm_latlng(counter);
	
	google.maps.event.addListener(marker,'click',function()
	{
		if (infowindow)
		{
			infowindow.close();
		}
		infowindow.setContent(info);
		infowindow.open(map, marker);
		map.setCenter(marker.position);
	});
}

function WalCarm_latlng(counter)
{
	var lat = WalCarm[counter].loc.latitude;
	var lng = WalCarm[counter].loc.longitude;
	var info = 'Latitude: ' + lat + '<br/>' + 'Longitude: ' + lng;
	return info;
}

function distance(lat1,lon1,lat2,lon2)
{
	// Copied from < http://www.movable-type.co.uk/scripts/latlong.html >

	var R = 3958.756; // miles
	console.log('lat2: ' + lat2 + ', lat1: ' + lat1);
	var dLat = (lat2-lat1).toRad();
	console.log('dLat: ' + dLat);
	var dLon = (lon2-lon1).toRad();
	var lat1 = lat1.toRad();
	var lat2 = lat2.toRad();

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	
	return d;
}

function other_info()
{
	var side_col = document.getElementById('text');
	
	//if (typeof WalCarm != 'undefined')
	//{
		console.log('Gets inside If Satedment inside other_info()');
		var text = WalCarm_text();
		console.log('Text (Outside function): ' + text);
		side_col.innerHTML = text;
	//}
	//else {console.log('DID NOT PASS THROUGH IF STATEMENT');}
	//console.log('Finished other_info function');
}

function WalCarm_text()
{
	var text;
	
	for (var i = 0; i < WalCarm.length; i++)
	{
		var lat = WalCarm[i].loc.latitude;
		var lng = WalCarm[i].loc.longitude;
		console.log('Lat: ' + lat + '<br/>' + 'Long: ' + lng);
		
		text = WalCarm[i].name + ' is ' + distance(myLat,myLng,lat,lng) + ' miles away!';
		console.log('Text: ' + text);
	}
	console.log('Text_Final: ' + text);
	
	return text;
}

function t_stops()
{
	// This function gets all the T stops on the red line
	//   and puts them into an array by their Platform Key
	
	/*
		var location: [Platform Key North, Plaform Key South
						Lattitude, Longitude, Station]
	*/
	loc =
	[
		['RALEN','titties',42.39543,-71.1425,'Alewife'],
		['RDAVN','RDAVS',42.39674,-71.121815,'Davis'],
		['RPORN','RPORS',42.3884,-71.119149,'Porter'],
		['RHARN','RHARS',42.373362,-71.118956,'Harvard'],
		['RCENN','RCENS',42.365486,-71.103802,'Central'],
		['RKENN','RKENS',42.36249079,-71.08617653,'Kendall'],
		['RMGHN','RMGHS',42.361166,-71.070628,'Charles'],
		['RPRKN','RPRKS',42.35639457,-71.0624242,'Park'],
		['RDTCN','RDTCS',42.355518,-71.060225,'Downtown Crossing'],
		['RSOUN','RSOUS',42.352271,-71.055242,'South'],
		['RBRON','RBROS',42.342622,-71.056967,'Broadway'],
		['RANDN','RANDS',42.330154,-71.057655,'Andrew'],
		['RJFKN','RJFKS',42.320685,-71.052391,'JFK'],
		['RSAVN','RSAVS',42.31129,-71.053331,'Savin Hill'],
		['RFIEN','RFIES',42.300093,-71.061667,'Fields Corner'],
		['RSHAN','RSHAS',42.29312583,-71.06573796,'Shawmut'],
		['RASHS','RASHS',42.284652,-71.064489,'Ashmont'],
		['RNQUN','RNQUS',42.275275,-71.029583,'North Quincy'],
		['RWOLN','RWOLS',42.2665139,-71.0203369,'Wollaston'],
		['RQUCN','RQUCS',42.251809,-71.005409,'Quincy Center'],
		['RQUAN','RQUAS',42.233391,-71.007153,'Quincy Adams'],
		['RBRAN','RBRAS',42.2078543,-71.0011385,'Braintree']
	];
}