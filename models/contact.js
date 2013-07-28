
/**
 * Module dependencies
 */

var draft = require('draft')


/**
 * `Contact` model
 */

module.exports = draft({
	  name: String
	, email: String
	, phone: Number
	, website: String
});