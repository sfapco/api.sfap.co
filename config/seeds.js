
/**
 * Provides seed data to the database
 */

module.exports = function (app, done) {
	var db = app.sfapdb
	  , collections = [
		'events'
	]

	!function next () {
		if (collections.length) {
			var collection = collections.pop()
			db.get(collection, function (err, results) {
				// does not exist
				if (err && 'notfounderror' === err.name.toLowerCase()) {
					console.log("sfapi: info: seeded database with collection '%s'", collection);
					db.put(collection, JSON.stringify([]), function (err) {
						if (err) throw err;
						else next();
					});
				} else {
					next();					
				}
			});
		} else {
			done();
		}
	}();
};