// Constants
MOVESIZE = 34;
MAXWIDTH = 399;
MAXHEIGHT = 565;
STARTX = 195;
STARTY = 500;
LOWPOINT = 520;
JUMPTIME = 6;
LEFTBOUND = -50;
RIGHTBOUND = MAXWIDTH - LEFTBOUND;
LOGLEFT = -150;
LOGRIGHT = MAXWIDTH - LOGLEFT;
SPEEDCONST = 2;
SPEEDINCREASE = 1.5;
LEVELNUM = 1;
SCORE = 0;
furthest_frog = new Array();
furthest_frog = [false,false,false,false,false,false,false,false,false,false];
final_frog = new Array();
final_frog = [false,false,false,false,false];
FLYCHANCE = 0.75;
isFly = false;
isDead = false;
kill_place = new Array();

function start_game()
{
	num_lives = 5;
	level = 1;
	cars = new Array();
	logs = new Array();
	car_start_pos();
	log_start_pos();
	pad_places();
	make_all_cars();
	make_all_logs();
	initial_fly();
	time = 0;	// Time for jumping
	jump = false;
	get_frog();
	pic = document.getElementById('game').getContext('2d');
	image = new Image;
	image.src = "assets/frogger_sprites.png";
	dead_frog = new Image();
	dead_frog.src = 'assets/dead_frog.png';
	
	draw_canvas();
	
	add_Events();
	
	var fps = 30;
	
	game_over = setInterval(game_loop, 1000 / fps);
}

function draw_canvas()
{
	// Game board
	pic.fillStyle = "#000000";
	pic.fillRect(0,0,MAXWIDTH,MAXHEIGHT);
	pic.fillStyle = "#191970";
	pic.fillRect(0,0,399,282.5);

	pic.drawImage(image,13,11,323,34,15,15,323,34);
	pic.drawImage(image,0,55,399,54,0,60,399,54);
	pic.drawImage(image,0,119,399,36,0,278,399,36);
	pic.drawImage(image,0,119,399,36,0,485,399,36);
	
	// Footer
	pic.fillStyle = "#00FF00";
	pic.font = "Bold 24px Helvetica";
	pic.fillText("Level:",110,540);
	pic.fillText(LEVELNUM, 185, 540);
	pic.font = "Bold 14px Helvetica";
	pic.fillText("Score:",3, 560);
	pic.fillText(SCORE,52, 560);
	//pic.fillText("Highscore:",100, 560); // Highscore commented out
	//pic.fillText("0",180, 560);
}

function add_Events()
{
	$(document).keydown(function(key)
	{
		key = key.which;

		if ((key >= 37) && (key <= 40))
		{
		if (key == 37 && ((pos.x - MOVESIZE) > 0))	// Left arrow
		{
			pos.x = pos.x - MOVESIZE;
			pos.o = 0;
		}
		if (key == 38 && ((pos.y - MOVESIZE) > 0))	// Up arrow
		{
			pos.y = pos.y - MOVESIZE;
			pos.o = 1;
		}
		if (key == 39 && ((pos.x + MOVESIZE) < MAXWIDTH))	// Right arrow
		{
			pos.x = pos.x + MOVESIZE;
			pos.o = 2;
		}
		if (key == 40 && ((pos.y + MOVESIZE) < LOWPOINT))	// Down arrow
		{
			pos.y = pos.y + MOVESIZE;
			pos.o = 3;
		}
		
		time = 0;
		jump = true;
		}
	});
}

function game_loop() // - - - - - - - - GAME LOOP - - - - //
{
	score_update();
	draw_canvas(); // Redraw
	draw_pads();
	draw_cars();
	draw_logs();
	fly_stuff();
	check_log();
	draw_frogs_on_pads();
	check_new_level();
	if (!isDead)
		draw_frog();
	else
		draw_dead();
	lives();
	if (check_collide())
	{
		kill_frog();
		restart_frog();
	}
	if (num_lives <= 0)
	{
		clearInterval(game_over);
		end_game();
	}
}

function score_update()
{
	pos_update();
}

function pos_update()
{
	if ((pos.y < 120) && (!furthest_frog[9])){
		furthest_frog[9] = true;
		SCORE = SCORE + 10;
	}else if ((pos.y < 185) && (!furthest_frog[8])){
		furthest_frog[8] = true;
		SCORE = SCORE + 10;
	}else if ((pos.y < 220) && (!furthest_frog[7])){
		furthest_frog[7] = true;
		SCORE = SCORE + 10;
	}else if ((pos.y < 250) && (!furthest_frog[6])){
		furthest_frog[6] = true;
		SCORE = SCORE + 10;
	}else if ((pos.y < 280) && (!furthest_frog[5])){
		furthest_frog[5] = true;
		SCORE = SCORE + 10;
	}else if ((pos.y < 350) && (!furthest_frog[4])){
		furthest_frog[4] = true;
		SCORE = SCORE + 10;
	}else if ((pos.y < 385) && (!furthest_frog[3])){
		furthest_frog[3] = true;
		SCORE = SCORE + 10;
	}else if ((pos.y < 420) && (!furthest_frog[2])){
		furthest_frog[2] = true;
		SCORE = SCORE + 10;
	}else if ((pos.y < 455) && (!furthest_frog[1])){
		furthest_frog[1] = true;
		SCORE = SCORE + 10;
	}else if ((pos.y < 480) && (!furthest_frog[0]))
	{
		furthest_frog[0] = true;
		SCORE = SCORE + 10;
	}
}

function draw_pads()
{
	var array = get_pad();
	var left,ftop,x,y,wid,hei;
	
	for (var i = 0; i < pad_place.length; i++)
	{
		left = pad_place[i][0];
		ftop = pad_place[i][1];
		x = array[0];
		y = array[1];
		wid = array[2];
		hei = array[3];
		
		pic.drawImage(image,x,y,wid,hei,left,ftop,wid,hei);
	}
}

function top_left(frog_pic)
{
	var width = frog_pic[2];
	var height = frog_pic[3];
	
	var left = pos.x - (width / 2);
	var top = pos.y - (height / 2);
	
	return [left,top];
}

function draw_dead()
{
	if (dead_num > 0)
		dead_num--;
	if (dead_num <= 0)
		isDead = false;
	pic.drawImage(dead_frog,kill_place[0],kill_place[1],30,30); // draw dead frog
}

function draw_frog()
{
	var cur_pic = frog[pos.o];	// Finds the right frog pic
	if (jump)
	{
		cur_pic = frog[pos.o + 4];
		time++;
	}
	if (time > JUMPTIME)
	{
		jump = false;
		cur_pic = frog[pos.o];
	}
	var position = top_left(cur_pic);	// Top-left coords
	var left = position[0];	// Left coord on canvas
	var ftop = position[1];	// Top coord on canvas
	var x = cur_pic[0];		// Dimensions in frogger_sprites.png
	var y = cur_pic[1];
	var wid = cur_pic[2];
	var hei = cur_pic[3];
	
	pic.drawImage(image,x,y,wid,hei,left,ftop,wid,hei);
}

function draw_cars()
{
	move_cars();
	var left,right,x,y,wid,hei;
	
	for (var i = 0; i < cars.length; i++)
	{
		left = cars[i][5];
		ftop = cars[i][6];
		x = cars[i][0];
		y = cars[i][1];
		wid = cars[i][2];
		hei = cars[i][3];
		pic.drawImage(image,x,y,wid,hei,left,ftop,wid,hei);
	}
}

function move_cars()
{
	var speed = 1;
	for (var i = 0; i < cars.length; i++)
	{
		speed = SPEEDCONST * cars[i][4];
		cars[i][5] = cars[i][5] + speed;
		if (cars[i][5] < LEFTBOUND)
			cars[i][5] = RIGHTBOUND;
		if (cars[i][5] > RIGHTBOUND)
			cars[i][5] = LEFTBOUND;
	}
}

function draw_logs()
{
	move_logs();
	
	var left,right,x,y,wid,hei;
	
	for (var i = 0; i < logs.length; i++)
	{
		left = logs[i][5];
		ftop = logs[i][6];
		x = logs[i][0];
		y = logs[i][1];
		wid = logs[i][2];
		hei = logs[i][3];
		pic.drawImage(image,x,y,wid,hei,left,ftop,wid,hei);
	}
}

function move_logs()
{
	var speed = 1;
	for (var i = 0; i < logs.length; i++)
	{
		speed = SPEEDCONST * logs[i][4];
		logs[i][5] = logs[i][5] + speed;
		if (logs[i][5] < LOGLEFT)
			logs[i][5] = LOGRIGHT;
		if (logs[i][5] > LOGRIGHT)
			logs[i][5] = LOGLEFT;
	}
}

function check_log()
{
	if (on_log() >= 0)
	{
		var num = on_log();
		pos.x = pos.x + SPEEDCONST * logs[num][4];
		
		if ((pos.x < 0) || (pos.x > MAXWIDTH))
		{
			kill_frog();
			restart_frog();
		}
	}
}

function on_log()
{
	var frog_left,frog_top,frog_right,frog_bot;
	var left_bound,top_bound,right_bound,bot_bound;
	
	var TopLeft = top_left(frog[pos.o]);
	frog_left = TopLeft[0];
	frog_top = TopLeft[1];
	frog_right = frog_left + frog[pos.o][2];
	frog_bot = frog_top + frog[pos.o][3];
	
	for (var i = 0; i < logs.length; i++)
	{
		left_bound = logs[i][5];
		top_bound = logs[i][6];
		right_bound = left_bound + logs[i][2];
		bot_bound = top_bound + logs[i][3];
		
		if (collide_one(frog_left,frog_top,frog_right,frog_bot,
					left_bound,top_bound,right_bound,bot_bound))
		{
			return i;
		}
	}
	if (pos.y < 278)
	{
		on_pad(); // CHeck for frog on pad
	}
}

function on_pad()
{
	var frog_left,frog_top,frog_right,frog_bot;
	var left_bound,top_bound,right_bound,bot_bound;
	
	var TopLeft = top_left(frog[pos.o]);
	frog_left = TopLeft[0];
	frog_top = TopLeft[1];
	frog_right = frog_left + frog[pos.o][2];
	frog_bot = frog_top + frog[pos.o][3];
	
	var dleft = get_pad()[2];
	var dtop = get_pad()[3];
	
	for (var i = 0; i < pad_place.length; i++)
	{
		left_bound = pad_place[i][0];
		top_bound = pad_place[i][1];
		right_bound = left_bound + dleft;
		bot_bound = top_bound + dtop;
		
		if (collide_one(frog_left,frog_top,frog_right,frog_bot,
					left_bound,top_bound,right_bound,bot_bound))
		{
			if (!final_frog[i])
			{
				num_lives++;
				final_frog[i] = true;
				restart_frog();
				SCORE = SCORE + 50;
				if ((isFly) && (fly[4] = pad_place[i][0]))
					SCORE = SCORE + 200;
				for (var j = 0; j < furthest_frog.length; j++)
					furthest_frog[j] = false;	// Reset scoring
				return;						// for furthest frog
			}
		}
	}
	kill_frog();
	restart_frog();
}

function frog_on_pad(num)
{
	var array = frog[3];
	var x = array[0];
	var y = array[1];
	var wid = array[2];
	var hei = array[3];
	
	pic.drawImage(image,x,y,wid,hei,pad_place[num][0]+7,pad_place[num][1]+4,wid,hei);
}

function draw_frogs_on_pads()
{
	for (var i = 0; i < pad_place.length; i++)
	{
		if (final_frog[i])
			frog_on_pad(i);
	}
}

function check_new_level()
{
	var num = 0;
	for (var i = 0; i < pad_place.length; i++)
	{
		if (final_frog[i])
			num++;
	}
	if (num == 5)
	{
		LEVELNUM++;
		num_lives++;
		SCORE = SCORE + 1000;
		restart_frog();
		for (var j = 0; j < pad_place.length; j++)
		{
			final_frog[j] = false;
		}
		SPEEDCONST = SPEEDCONST * SPEEDINCREASE;
	}
}

function kill_frog()
{
	dead_num = 20;
	isDead = true;
	kill_place[0] = pos.x;
	kill_place[1] = pos.y;
}

function make_all_cars()
{
		make_car(1,0);
		make_car(1,1);
		make_car(1,2);
		make_car(2,3);
		make_car(2,4);
		make_car(2,5);
		make_car(3,6);
		make_car(3,7);
		make_car(3,8);
		make_car(4,9);
		make_car(4,10);
		make_car(4,11);
		make_car(5,12);
		make_car(5,13);
}

function make_car(type,num)
{
	cars[num] = get_car(type);
	cars[num][5] = all_pos[num][0];	// Adds start pos
	cars[num][6] = all_pos[num][1];	//  to the array
}

function make_all_logs()
{
	make_log(1,0);
	make_log(1,1);
	make_log(1,2);
	make_log(2,3);
	make_log(2,4);
	make_log(2,5);
	make_log(3,6);
	make_log(3,7);
	make_log(4,8);
	make_log(4,9);
	make_log(4,10);
	make_log(5,11);
	make_log(5,12);
	make_log(5,13);
}

function make_log(type,num)
{
	logs[num] = get_log(type);
	logs[num][5] = log_pos[num][0];	// Adds start pos
	logs[num][6] = log_pos[num][1];	//  to the array
}

function check_collide()
{
	var frog_left,frog_top,frog_right,frog_bot;
	var left_bound,top_bound,right_bound,bot_bound;
	
	var TopLeft = top_left(frog[pos.o]);
	frog_left = TopLeft[0];
	frog_top = TopLeft[1];
	frog_right = frog_left + frog[pos.o][2];
	frog_bot = frog_top + frog[pos.o][3];
	
	for (var i = 0; i < cars.length; i++)
	{
		left_bound = cars[i][5];
		top_bound = cars[i][6];
		right_bound = left_bound + cars[i][2];
		bot_bound = top_bound + cars[i][3];

		if (collide_one(frog_left,frog_top,frog_right,frog_bot,
					left_bound,top_bound,right_bound,bot_bound))
		{
			return true;
		}
	}
}

function collide_one(fl,ft,fr,fb,cl,ct,cr,cb)
{
	var collision = false;
	
	if ((ft < cb) && (ft > ct))
	{
		if ( ((fl < cr) && (cl < fl)) ||
			 ((fr > cl) && (fr < cr)))
		{
			collision = true;
		}
	}
	if ((fb > ct) && (fb < cb))
	{
		if ( ((fl < cr) && (cl < fl)) ||
			 ((fr > cl) && (fr < cr)))
		{
			collision = true;
		}
	}
	
	return collision;
}

function restart_frog()
{
	num_lives--;
	pos.x = STARTX;
	pos.y = STARTY;
	pos.o = 1;
	lives();
	
	if (num_lives == 0)
	{
		return true;
	}
	return false;
}

function fly_stuff()
{
	var rand_num = 100 * Math.random();
	var rand_num_2 = 100 * Math.random();
	
	if (rand_num < FLYCHANCE)
	{
		make_fly();
		isFly = true;
	}
	if (rand_num_2 < FLYCHANCE)
	{
		isFly = false;
	}
	if (isFly)
		draw_fly();
}

function make_fly()
{
	var rand_num = 100 * Math.random();
	if ((rand_num < 20) && (!final_frog[0])){
		fly[4] = pad_place[0][0] + 5;
		fly[5] = pad_place[0][1];
	}else if ((rand_num < 40) && (!final_frog[1])){
		fly[4] = pad_place[1][0] + 5;
		fly[5] = pad_place[1][1];
	}else if ((rand_num < 60) && (!final_frog[2])){
		fly[4] = pad_place[2][0] + 5;
		fly[5] = pad_place[2][1];
	}else if ((rand_num < 80) && (!final_frog[3])){
		fly[4] = pad_place[3][0] + 5;
		fly[5] = pad_place[3][1];
	}else if (!final_frog[4]){
		fly[4] = pad_place[4][0] + 5;
		fly[5] = pad_place[4][1];
	}
}

function draw_fly()
{
	var x = fly[0];
	var y = fly[1];
	var wid = fly[2];
	var hei = fly[3];
	var left = fly[4];
	var ftop = fly[5];
	
	pic.drawImage(image,x,y,wid,hei,left,ftop,wid,hei);
}

function lives()
{
	if (num_lives >= 1)
		pic.drawImage(image,12,333,19,25,2,520,19,25);
	if (num_lives >= 2)
		pic.drawImage(image,12,333,19,25,22,520,19,25);
	if (num_lives >= 3)
		pic.drawImage(image,12,333,19,25,42,520,19,25);
	if (num_lives >= 4)
		pic.drawImage(image,12,333,19,25,62,520,19,25);
	if (num_lives >= 5)
		pic.drawImage(image,12,333,19,25,82,520,19,25);
}

function get_frog()
{
	frog = new Array();
	pos = new Object();
	pos.x = STARTX;
	pos.y = STARTY;
	pos.o = 1;	// Orientation
	frog = // Left, Up, Right, Down [sx,sy,swidth,sheight]
   [[82,335,18,23],
	[12,369,23,18],
	[12,334,19,23],
	[80,368,24,19],
	[111,337,28,23],
	[46,365,21,27],
	[43,334,25,23],
	[113,365,24,28]];
}

function get_car(type)
{
	var car = new Array();
	
	// [sx,sy,swidth,sheight,speed]
	if (type == 1)
		car = [81,264,23,25,-1];
	if (type == 2)
		car = [73,301,26,22,1];
	if (type == 3)
		car = [10,265,28,22,-1.5];
	if (type == 4)
		car = [46,264,28,25,1];
	if (type == 5)
		car = [104,300,51,23,-2];
		
	return car;
}

function car_start_pos()
{
	all_pos = new Array();
	
	all_pos =
		[[325,455],
		[125,455],
		[225,455],
		[200,420],
		[100,420],
		[0,420],
		[0,385],
		[100,385],
		[200,385],
		[200,350],
		[300,350],
		[400,350],
		[100,320],
		[250,320]];
}

function get_log(type)
{
	var log = new Array();
	
	if (type == 1)
		log = [7,198,118,22,0.75];
	if (type == 2)
		log = [15,405,108,25,-1];
	if (type == 3)
		log = [7,165,178,22,1.5];
	if (type == 4)
		log = [15,405,108,25,-1];
	if (type == 5)
		log = [7,229,85,22,0.75];
	
	return log;
}

function log_start_pos()
{
	log_pos = new Array();
	
	log_pos = 
	[[25,250],
	[200,250],
	[375,250],
	[50,220],
	[200,220],
	[350,220],
	[25,185],
	[300,185],
	[25,150],
	[200,150],
	[375,150],
	[50,120],
	[200,120],
	[350,120]];
}

function get_pad()
{
	var a_pad = new Array();
	a_pad = [131,405,36,27];
	return a_pad;
}

function pad_places()
{
	pad_place = new Array();
	
	pad_place = 
	[[9,80],
	[95,80],
	[180,80],
	[263,80],
	[348,80]];
}

function initial_fly()
{
	fly = new Array();
	fly = [139,234,18,19];
}

function end_game()
{
	pic.fillStyle = "#FF0000";
	pic.font = "Bold 40px Helvetica";
	pic.fillText("GAME OVER",70,400);
	pic.font = "20px Helvetica";
	pic.fillText("Refresh to Restart",120,425);
	
	post_score();
}

function post_score()
{
	var xml = new XMLHttpRequest;
	var name = window.prompt('Please enter your name.', 'Name goes here');
	//xml.open('POST', '',true);
	//xml.send();
}