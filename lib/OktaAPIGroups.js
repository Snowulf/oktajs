"use strict";

/*
 * Okta Group Documentation
 * http://developer.okta.com/docs/api/rest/groups.html
 */


var NetworkAbstraction = require('./NetworkAbstraction.js');

module.exports = OktaAPIGroups;


/**
 * Instantiate a new Okta API Groups helper with the given API token
 * @param apiToken
 * @param domain
 * @constructor
 */
function OktaAPIGroups(apiToken, domain)
{
    if(apiToken == undefined || domain == undefined)
    {
        throw new Error("OktaAPI requires an API token and a domain");
    }
    this.domain = domain;
    this.request = new NetworkAbstraction(apiToken, domain);
    this.helpers = require('./OktaAPIGroupsHelpers.js')
}

/*******************************************************************
***************** Groups->Group Operations Start *******************
********************************************************************
*/

/**
 * Add a new group to Okta
 * @method add
 * @param groupProfile a group profile object, normally constucted with OktaAPI.Helpers.constructGroup()
 * @param callback
 */
OktaAPIGroups.prototype.add = function(groupProfile, callback)
{
    if(groupProfile == undefined) throw new Error("A group profile is required when creating a group");
    var body = {};
    body.profile = groupProfile;
    this.request.post("groups", body, null, callback);
}

/**
 * @method get
 * @param groupId
 * @param callback
 */
OktaAPIGroups.prototype.get = function(groupId, callback)
{
    if(groupId == undefined) throw new Error("A group ID is required when getting a group");
    this.request.get("groups/" + groupId, null, callback);
}

/**
 * @method list
 * @param search
 * @param followLink - boolean, if set to true, tells network abstraction to follow all pagination links and return result at once
 * @param callback
 */
OktaAPIGroups.prototype.list  = function(search, followLink, callback)
{
    var queryObj = {};
    if(search != undefined)
    {
        /*
        *   backward compatibility support, old version used to only take a
        *   string for the listing params
        */
        if(typeof search == 'string') queryObj.q = search;
        else queryObj = search;
    }
    this.request.get("groups", queryObj, followLink, callback);
}

/**
 * Update the group's profile.
 * @method update
 * @param groupId
 * @param groupObj the complete group object, normally constructed with OktaAPI.Helpers.constructGroup()
 * @param callback
 */
OktaAPIGroups.prototype.update = function(groupId, groupObj, callback)
{
    if(groupId == undefined) throw new Error("A group ID is required when updating a group");
    if(groupObj == undefined) throw new Error("A group object is required when updating a group");
    var body = {profile: groupObj};
    this.request.put("groups/" + groupId, body, null, callback);
}

/**
 * Deletes a group from Okta (note: returns no response if successful)
 * @method delete
 * @param groupId
 * @param callback
 */
OktaAPIGroups.prototype.delete = function(groupId, callback)
{
    if(groupId == undefined) throw new Error("A group ID is required when updating a group");
    this.request.delete("groups/" + groupId, null, callback);
}

/*******************************************************************
***************** Groups->Group Operations End *********************
********************************************************************
*/

/*******************************************************************
************ Groups->Group Member Operations Start *****************
********************************************************************
*/

/**
 * Get a list of users in the group
 * @method getUsers
 * @param groupId
 * @param callback
 */
OktaAPIGroups.prototype.getUsers = function(groupId, queryObj, followLink, callback)
{
    if(groupId == undefined) throw new Error("A group ID is required when fetching users in a group");
    this.request.get("groups/" + groupId + "/users", queryObj, followLink, callback);
}

/**
 * @method addUser Adds an Okta user to an Okta group.
 * @param groupId
 * @param userId
 * @param callback
 */
OktaAPIGroups.prototype.addUser = function(groupId, userId, callback)
{
    if(groupId == undefined) throw new Error("A group ID is required to add a user to a group");
    if(userId == undefined) throw new Error("A user ID is required to add a user to a group");
    this.request.put("groups/" + groupId + "/users/" + userId, null, null, callback);
}

/**
 * @method removeUser Removes an Okta user from an Okta group.
 * @param groupId
 * @param userId
 * @param callback
 */
OktaAPIGroups.prototype.removeUser = function(groupId, userId, callback)
{
    if(groupId == undefined) throw new Error("A group ID is required to remove a user from a group");
    if(userId == undefined) throw new Error("A user ID is required to remove a user from a group");
    this.request.delete("groups/" + groupId + "/users/" + userId, null, callback);
}

/*******************************************************************
************ Groups->Group Member Operations End *******************
********************************************************************
*/

/*******************************************************************
**************** Groups->Related Resources Start *******************
********************************************************************
*/

/**
 * @method getApps Enumerates all applications that are assigned to the group
 * @param groupId
 * @param search
 * @param callback
 */
OktaAPIGroups.prototype.getApps = function(groupId, search, followLink, callback)
{
    if (groupId == undefined) throw new Error("A group ID is required when getting apps for a group");
    this.request.get("groups/" + groupId + "/apps", search, followLink, callback);
}

/*******************************************************************
***************** Groups->Related Resources End ********************
********************************************************************
*/
