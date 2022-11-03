EngageX
This is a simple game.

STRUCTURE:
	img/
	main.js
	index.html


HOW TO RUN:

Note: avoid clicking in index.html because ES6 requires an HTTP connection, causing the browser to trigger CORS Policy errors.

1. index.html and its respective root folder must be hosted (locally or remotely) and served in an HTTP connection.
You can use a web hosting provider or you can serve yourself using Node.js or, in my case, python:
	$ python3 -m http.server 9000

2. access localhost:9000 or your server.
