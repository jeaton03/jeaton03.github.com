ANGLE = 3;
BACKANGLE = -1 * ANGLE;
temp_angle = 0;
delay = 30;	// milliseconds

function init()
{
	rotating_foward = setInterval(rotate_foward, delay);
	clearInterval(rotating_backward);
}

function rotate_foward()
{
	temp_angle += ANGLE;
	pokeball.style['-webkit-transform'] = 'rotate(' + temp_angle + 'deg)';
	console.log('temp_angle: ' + temp_angle);
}

function stop_rotate()
{
	clearInterval(rotating_foward);
	
	rotating_backward = setInterval(rotate_backward, delay);
}

function rotate_backward()
{	
	temp_angle += BACKANGLE;
	pokeball.style['-webkit-transform'] = 'rotate(' + temp_angle + 'deg)';
	console.log('temp_angle: ' + temp_angle);
	
	if ((temp_angle <= 0) || (temp_angle % 360) == 0)
	{
		temp_angle = 0;
		pokeball.style['-webkit-transform'] = 'rotate(' + temp_angle + 'deg)';
		clearInterval(rotating_backward);
	}
}