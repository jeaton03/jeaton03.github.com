File name:	README.md
Authors:	Jesse Eaton,
			Brian Cefali,
			Grace Olsen,
			Chris Shinn
Class:	Comp 20
Date:	3/14/2013
Date Modified:	3/14/2013

1.)	Title:	Traffic Jammin'

2.)	Problem:  Ever been stuck in traffic for hours on end with
		no one to rant to? What better way to let off some steam
		then to share your anguish with fellow commuters?

3.)	Solution:  Our web application will allow commuters stuck in
		traffic to chat with the people around them, anonymously
		and instantly. Mobile users will be able to instantly
		join a chatroom with other nearby people. At the same
		time, desktop users can enjoy the ability to view all
		conversations grouped as hotspots using the google maps
		API.

4.)	Features:
		Mobile:  - Able to communicate in a local messageboard
				 - Display recent speed
				 - View map of locations for different drivers
		Desktop: - View map of all conversation hotspots
				 - Select individual conversations to view

5.)	Data: Our web application collects a small set of data
		including the geolocation of users along with their
		messages.
	
6.)	Algorithms: The architecture of the application breaks down
		into a few sections. The first one being the creation of
		"hotspots". Essentially we must create an algorithm to
		identify the areas of relatively high message density.
		By grouping message sender vectors, we intend to limit
		the visibility of posted messages at any given hotspot
		to only those in that very hotspot.
		
		In addition to the grouping of message senders, our
		application will also employ several algorithms to
		solve the issue of networking that will be required
		to facilitate an instant messaging system. One of
		these may include the need for the design of a
		messaging infrastructure if we cannot find a
		suitible api for our needs.
		
		
# Comments by Ming
* You do know it is illegal to text and drive in many states, right?  Voice chat is okay but...
