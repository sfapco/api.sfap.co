
/**
 * Module dependencies
 */

var draft = require('draft')


/**
 * `Partner` model
 */

module.exports = draft({
	  name: String
	, contacts: [require('./contact')]
	, website: String
	, country: String
	, state: String
	, city: String
});