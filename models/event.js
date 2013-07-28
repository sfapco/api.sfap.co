
/**
 * Module dependencies
 */

var draft = require('draft')


/**
 * `Event` model
 */

module.exports = draft({
	  name: String
	, date: Date
	, price: Number
	, theme: require('./theme')
	, partners: [require('./partner')]
});