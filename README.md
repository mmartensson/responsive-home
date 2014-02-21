Responsive Home
===============

In the event that someone has the urge to 
[view the source](view-source:http://www.acc.umu.se/~mortis/home/) of my
[home page](http://www.acc.umu.se/~mortis/home/) but finds it too minified and
difficult to glean any useful information from, I've decided to post the source
and build scripts here on GitHub.

Installation
------------

1. Install [node.js](http://nodejs.org/).
2. Install [Ruby](http://www.ruby-lang.org/).
3. Install [Compass](http://compass-style.org/install/).
4. Install lots of node modules by running `npm install` from the root of the source directory.
5. Install even more node modules by running `./node_modules/.bin/bower install` from the root of the source directory.
6. Create the final product by running `./node_modules/.bin/grunt` (or just `grunt` if installed properly).
7. The `dist/` directory now contains all the goodness you need to put up on any host serving static files (yes `file://` browsing works too).
8. Substitute **Markus Mårtensson** with your own name and change any parts of the text where your life does not exactly match mine. Repeat steps 6 through 8 a couple of times.
