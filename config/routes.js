
/**
 * API routes for `api.sfap.co`
 */

module.exports = function (app) {
	var db = app.sfapdb
	  , Event = require('../models/event')
	  , Contact = require('../models/contact')
	  , Partner = require('../models/partner')
	  , Theme = require('../models/theme')
	  , isArray = Array.isArray
	  , inArray = function (a, i) { return !!~[].indexOf.call(a, i); }

	function parseResults (results, res) {
		try {
			return JSON.parse(results);
		} catch (e) {
			console.log(e)
			res.json(500, {
				message: "Error reading results from database"
			});
			return false;
		}
	}

	function handleError (err, name, res) {
		switch (err.name.toLowerCase()) {
			case 'notfounderror':
				res.json(404, {
					message: "No "+ name +" found"
				});

				break;

			default:
				res.json(500, {
					messag: err.message
				})
		}
	}

	// filter to check for database
	app.use(function (req, res, next) {
		if (!app.sfapdb) {
			res.json(503, {
				message: "Database unavailable"
			});
		} else {
			db = app.sfapdb
			next();
		}
	});


	
	/**
	 * Reads events from `sfapdb` connection
	 */

	app.get('/events', function (req, res) {
		db.get('events', function (err, results) {
			if (err) {
				handleError(err, 'events', res);
			} else {
				results = parseResults(results, res);
				if (results) {
					res.json(200, {
						results: results
					});
				}
			}
		});
	});


	/**
	 * Creates an event in the `sfapdb` connection
	 */

	app.post('/events', function (req, res) {
		db.get('events', function (err, results) {
			if (err) {
				handleError(err, 'events', res);
			} else {
				results = parseResults(results, res);
				if (results) {
					var event

					if (!Object.keys(req.body).length) {
						return res.json(400, {
							message: "Missing body"
						});
					}

					if (!req.body.name) {
						return res.json(400, {
							message: "Missing event name"
						});
					} else if (!req.body.date) {
						return res.json(400, {
							message: "Missing event date"
						});
					} else if (!req.body.price) {
						return res.json(400, {
							message: "Missing event price"
						});
					} else if (!req.body.date) {
						return res.json(400, {
							message: "Missing event date"
						});
					} 
					
					event = new Event(req.body);

					for (var i = 0; i < results.length; i++) {
						if (event.name === results[i].name) {
							return res.json(400, {
								message: "Event "+ event.name +" already exists"
							});
						}
					}
					

					if (req.body.theme) {
						event.theme = new Theme(req.body.theme);
					}

					if (isArray(req.body.partners)) {
						event.partners = req.body.partners.map(function (partner) {
							return new Partner(partner);
						});
					}

					results.push(event)
					db.put('events', JSON.stringify(results), function (err) {
						if (err) {
							res.json(500, {
								message: err.message
							});
						}

						res.json(200, event.toJSON());
					});
					
				}
			}
		});
	});
};