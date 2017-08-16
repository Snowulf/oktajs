"use strict";

/*
 * Okta Sessions Documentation
 * http://developer.okta.com/docs/api/rest/sessions.html
 */


var NetworkAbstraction = require('./NetworkAbstraction.js');

module.exports = OktaAPISessions;


/**
 * Instantiate a new Okta API Sessions helper with the given API token
 * @param apiToken
 * @param domain
 * @constructor
 */
function OktaAPISessions(apiToken, domain)
{
    if(apiToken == undefined || domain == undefined)
    {
        throw new Error("OktaAPI requires an API token and a domain");
    }
    this.domain = domain;
    this.request = new NetworkAbstraction(apiToken, domain);
}


/*******************************************************************
*************** Session->Session Operations Start ******************
********************************************************************
*/

/**
 * @method create 			- Creates a new session for a user.
 * @param user 				- Requests specific token attributes
 * @param pass 				- password for an ACTIVE user
 * @param additionalFields 	- Requests specific token attributes
 * @param callback
 */
OktaAPISessions.prototype.create = function(user, pass, additionalFields, callback)
{
    if(user == undefined) throw new Error("A username is required when making a new session");
    if(pass == undefined) throw new Error("A password is required when making a new session");
    var queryObj = {};
    if(additionalFields != undefined) queryObj.additionalFields = additionalFields;
    var body = {};
    body.username = user;
    body.password = pass;
    this.request.post("sessions", body, queryObj, callback);
}

/**
 * @method validate		- Validate a user’s session.
 * @param sessionId		- id of user’s session
 * @param callback		-
 */
OktaAPISessions.prototype.validate = function(sessionId, callback)
{
    if(sessionId == undefined) throw new Error("A session ID is required when validating a session");
    this.request.get("sessions/" + sessionId, null, callback);
}

/**
 * @method extend 		- Extends the lifetime of a session for a user.
 * @param sessionId		- id of user’s session
 * @param callback		-
 */
OktaAPISessions.prototype.extend = function(sessionId, callback)
{
    if(sessionId == undefined) throw new Error("A session ID is required when extending a session");
    this.request.put("sessions/" + sessionId, null, null, callback);
}

/**
 * @method close		- Closes a session for a user (logout).
 * @param sessionId		- id of user’s session
 * @param callback		-
 */
OktaAPISessions.prototype.close = function(sessionId, callback)
{
    if(sessionId == undefined) throw new Error("A session ID is required when closing a session");
    this.request.delete("sessions/" + sessionId, null, callback);
}

/*******************************************************************
*************** Session->Session Operations End *******************
********************************************************************
*/
