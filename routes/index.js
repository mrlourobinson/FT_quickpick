var express = require('express');
var router = express.Router();
var request = require("request");

var maxStories = 12; // stories shown on the page

// sets the options for the API post request
function setOptions(searchParam) {
	return options = {
		method: 'POST',
		url: 'http://api.ft.com/content/search/v1',
		headers: {
			'Postman-Token': 'a13aa5c2-0f28-4560-9648-f71c22a32e65',
			'Cache-Control': 'no-cache',
			'Content-Type': 'application/json',
			'X-Api-Key': APIKEY
		},
		body: {
			"queryString": searchParam, // search parameter goes here
			resultContext: {
				"maxResults": maxStories, // max stories brought in
				"sortOrder": "DESC", // sort in descending order 	-->
				"sortField": "initialPublishDateTime", // 			--> by first publishing time
				"aspects": ['title', 'lifecycle', 'location', 'metadata', 'summary', 'editorial']
			}
		},
		json: true
	};
};

// GET FRONT PAGE
router.get('/', function(req, res, next) {
	var storyArr = new Array;
	var options = setOptions(null, 0); // No search term

	request(options, function(error, response, body) {
		if (error) throw new Error(error);

		for (var i = 0; i < maxStories; i++) {
			storyArr[i] = {
				title: body.results[0].results[i].title.title,
				byLine: body.results[0].results[i].editorial.byline,
				summary: body.results[0].results[i].summary.excerpt,
				URL: body.results[0].results[i].location.uri,
				time: body.results[0].results[i].lifecycle.lastPublishDateTime,
				section: body.results[0].results[i].metadata.primarySection.term.name
			};
		};

		// render index view html
		res.render('index', {
			storyArr
		});

	});
});

// GET SEARCH RESULTS PAGE
router.get('/search/:id/', function(req, res, next) {
	var searchArr = new Array;
	var searchTerm = req.params.id;

	var options = setOptions(searchTerm); // sets options with the search term from the get

	request(options, function(error, response, body) {
		if (error) throw new Error(error);

		for (var i = 0; i < maxStories; i++) {
			searchArr[i] = {
				title: body.results[0].results[i].title.title,
				byLine: body.results[0].results[i].editorial.byline,
				summary: body.results[0].results[i].summary.excerpt,
				URL: body.results[0].results[i].location.uri,
				time: body.results[0].results[i].lifecycle.lastPublishDateTime,
				section: body.results[0].results[i].metadata.primarySection.term.name
			};
		}

		// render search html
		res.render('search', {
			title: "Search results for",
			searchTerm: searchTerm,
			searchArr
		});

	});
});

// POST SEARCH QUERY TERM
router.post('/search/submit/', function(req, res, next) {
	var id = req.body.id;
	res.redirect('/search/' + id);
});

module.exports = router;