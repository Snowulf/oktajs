"use strict";

var NetworkAbstraction = require('./NetworkAbstraction.js');
var OktaAPIUsers = require('./OktaAPIUsers.js');
var OktaAPIGroups = require('./OktaAPIGroups.js');
var OktaAPISessions = require('./OktaAPISessions.js');
var OktaAPIApps = require('./OktaAPIApps.js');
var OktaAPIEvents = require('./OktaAPIEvents.js');

module.exports = OktaAPI;
/**
 * Instantiate a new Okta API session with the given API token
 * @param apiToken
 * @param domain
 * @constructor
 */
function OktaAPI(apiToken, domain) {
    if(apiToken == undefined || domain == undefined) {
        throw new Error("OktaAPI requires an API token and a domain");
    }
    this.domain = domain;
    this.request = new NetworkAbstraction(apiToken, domain);
    this.users = new OktaAPIUsers(apiToken, domain);
    this.groups = new OktaAPIGroups(apiToken, domain);
    this.sessions = new OktaAPISessions(apiToken, domain);
    this.apps = new OktaAPIApps(apiToken, domain);
    this.events = new OktaAPIEvents(apiToken, domain);
}
