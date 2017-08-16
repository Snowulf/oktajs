"use strict";

/*
 * Okta Applications Documentation
 * http://developer.okta.com/docs/api/rest/apps.html
 */


var NetworkAbstraction = require('./NetworkAbstraction.js');

module.exports = OktaAPIApps;

/**
 * Instantiate a new Okta API Applications helper with the given API token
 * @param apiToken
 * @param domain
 * @constructor
 */
function OktaAPIApps(apiToken, domain)
{
    if(apiToken == undefined || domain == undefined)
    {
        throw new Error("OktaAPI requires an API token and a domain");
    }
    this.domain = domain;
    this.request = new NetworkAbstraction(apiToken, domain);
    this.helpers = require('./OktaAPIAppsHelpers.js');
}


/*******************************************************************
*************** Apps->Application Operations Start *****************
********************************************************************
*/

 /**
  * @method add
  * @param appModel an app model per Okta docs
  * @param callback
  */
OktaAPIApps.prototype.add = function(appModel, callback)
{
    if(appModel == undefined) throw new Error("An application model is required when adding an application");
    this.request.post("apps", appModel, null, callback);
}


/**
 * @method get
 * @param id an application ID to get
 * @param callback
 */
OktaAPIApps.prototype.get = function(id, callback)
{
    if(id == undefined) throw new Error("An application ID is required when getting an application");
    this.request.get("apps/" + id, null, callback);
}

/**
 * @method list
 * @param queryObj an object to filter search; refer to Okta docs
 * @param callback - paged response; callback can be called several times
 */
OktaAPIApps.prototype.list = function(queryObj, callback)
{
    this.request.get("apps", queryObj, callback);
}

 /**
  * @method update Updates an application in your organization.
  * @param id
  * @param profile
  */
OktaAPIApps.prototype.update = function(id, profile, callback)
{
    if(id == undefined) throw new Error("An application ID is required when updating an application");
    if(profile == undefined) throw new Error("An application profile is required when updating an application");
    this.request.put("apps/" + id, profile, null, callback);
}

/**
 * @method delete removes a deactivated application
 * @param id
 * @param callback
 */
OktaAPIApps.prototype.delete = function(id, callback)
{
    if(id == undefined) throw new Error("An application ID is required when deleting an application");
    this.request.delete("apps/" + id, null, callback);
}

/*******************************************************************
**************** Apps->Application Operations End ******************
********************************************************************
*/

/*******************************************************************
*********** Apps->Application Lifecycle Operations Start ***********
********************************************************************
*/

/**
 * @method activate Activates an inactive application.
 * @param id
 * @param callback
 */
OktaAPIApps.prototype.activate = function(id, callback)
{
    if(id == undefined) throw new Error("An application ID is required when activating an application");
    this.request.post("apps/" + id + "/lifecycle/activate", null, null, callback);
}

/**
 * @method deactivate Deactivates an active application.
 * @param id
 * @param callback
 */
OktaAPIApps.prototype.deactivate = function(id, callback)
{
    if(id == undefined) throw new Error("An application ID is required when deactivating an application");
    this.request.post("apps/" + id + "/lifecycle/deactivate", null, null, callback);
}

/*******************************************************************
************ Apps->Application Lifecycle Operations End ************
********************************************************************
*/

/*******************************************************************
************ Apps->Application User Operations Start ***************
********************************************************************
*/

/**
 * @method assignUser - assigns a user to an app
 * @param appId - the id of the App you assign the user to
 * @param appUserModel - the user that you want to assign to the app
 * @param callback - paged response; callback can be called several times
 */
OktaAPIApps.prototype.assignUser = function(appId, appUserModel, callback)
{
    if(appId == undefined) throw new Error("An application Id is required when assigning a user to an application");
    if(appUserModel == undefined) throw new Error("An Application User is required when assigning a user to an application");
    this.request.post("apps/" + appId + "/users", appUserModel, null, callback);
}

/**
 * @method getAssignedUser - gets one user that has been assigned to app
 * @param appId - the id of the App you want the user from
 * @param uid - the user that you want to get from the app
 * @param callback - paged response; callback can be called several times
 */
OktaAPIApps.prototype.getAssignedUser = function(appId, uid, callback)
{
    if(appId == undefined) throw new Error("An application Id is required when getting an assigned user for an application");
    if(uid == undefined) throw new Error("A user ID is required when getting an assigned user for an application");
    this.request.get("apps/" + appId + "/users/" + uid, null, callback);
}

/**
 * @method listUsersAssigned - gets all users that has been assigned to app
 * @param id - the id of the App you want the users from
 * @param callback - paged response; callback can be called several times
 */
OktaAPIApps.prototype.listUsersAssigned = function(id, callback)
{
    if(id == undefined) throw new Error("An application ID is required when getting a list of users assigned to an application");
    this.request.get("apps/" + id + "/users", null, callback);
}

/**
 * @method updateAppCredsForUser - updates a user's credentials for an application
 * @param aid - the id of the App you want the credentials updated for
 * @param uid - the id of the user you want the credentials updated for
 * @param appUserModel - the credentials that you want to update to
 * @param callback - paged response; callback can be called several times
 */
OktaAPIApps.prototype.updateAppCredsForUser = function(aid, uid, appUserModel, callback)
{
    // TODO: abstract the appUserModel
    if(aid == undefined) throw new Error("An application ID is required when updating creds for an application");
    if(uid == undefined) throw new Error("A user ID is required when updating creds for an application");
    //throw new Error("Not yet implemented"); // this is intentional. Uncomment if you wish to use this call w/o abstracted user models
    this.request.post("apps/" + aid + "/users/" + uid, appUserModel, null, callback);
}

/**
 * @method updateAppProfileForUser - updates a user's profile for an application
 * @param aid - the id of the App you want the profile updated for
 * @param uid - the id of the user you want the profile updated for
 * @param appUserModel - the profile that you want to update to
 * @param callback - paged response; callback can be called several times
 */
OktaAPIApps.prototype.updateAppProfileForUser = function(aid, uid, appUserModel, callback)
{
    // TODO: abstract the appUserModel
    if(aid == undefined) throw new Error("An application ID is required when updating the profile for an application");
    if(uid == undefined) throw new Error("A user ID is required when updating the profile for an application");
    //throw new Error("Not yet implemented"); // this is intentional. Uncomment if you wish to use this call w/o abstracted user models
    this.request.post("apps/" + aid + "/users/" + uid, appUserModel, null, callback);
}

/**
 * @method removeUser - removes a user credentials form an application
 * @param aid - the id of the App you want the user removed for
 * @param uid - the id of the user you want removed
 * @param callback - paged response; callback can be called several times
 */
OktaAPIApps.prototype.removeUser = function(aid, uid, callback)
{
    if(aid == undefined) throw new Error("An application ID is required when removing a user from an app");
    if(uid == undefined) throw new Error("A user ID is required when removing a user from an app");
    this.request.delete("apps/ " + aid + "/users/" + uid, null, callback);
}

/*******************************************************************
************* Apps->Application User Operations End ****************
********************************************************************
*/

/*******************************************************************
*********** Apps->Application Group Operations Start ***************
********************************************************************
*/

/**
 * @method assignGroup - assigns a group to use an app
 * @param aid - the id of the App you want the group assigned to
 * @param gid - the id of the group you want to assign
 * @param callback - paged response; callback can be called several times
 */
OktaAPIApps.prototype.assignGroup = function(aid, gid, appGroup, callback) {
    // TODO: there is an optional "appgroup" param. Figure out what it does and how to use it.
    if(aid == undefined) throw new Error("An application ID is required when assigning an application to a group");
    if(gid == undefined) throw new Error("A group ID is required when assigning an application to a group");
    //backwards compatability support
    if(typeof appGroup == 'function')
    {
    	callback = appGroup;
    	appGroup = {};
    }
    this.request.put("apps/" + aid + "/groups/" + gid, appGroup, null, callback);
}

/**
 * @method getAssignedGroup - get a group assigned to an app
 * @param aid - the id of the App the group is assigned to
 * @param gid - the id of the group you want to get
 * @param callback - paged response; callback can be called several times
 */
OktaAPIApps.prototype.getAssignedGroup = function(aid, gid, callback) {
    if(aid == undefined) throw new Error("Application ID is required when getting a group assigned to an application");
    if(gid == undefined) throw new Error("A group ID is required when getting a group assigned to an application");
    this.request.get("apps/" + aid + "/groups/" + gid, null, callback);
}

/**
 * @method listGroups - get all groups assigned to an app
 * @param aid - the id of the App the groups are assigned to
 * @param queryObj - filters for the list of groups returned
 * @param callback - paged response; callback can be called several times
 */
OktaAPIApps.prototype.listGroupsAssigned = function(aid, queryObj, callback) {
    if(aid == undefined) throw new Error("An application ID is required when getting the groups assigned to an application");
    this.request.get("apps/" + aid + "/groups", queryObj, callback);
}

/**
 * @method removeGroup - removes a group from an app
 * @param aid - the id of the App the groups is assigned to
 * @param gid - the id of the group you want removed
 * @param callback - paged response; callback can be called several times
 */
OktaAPIApps.prototype.removeGroup = function(aid, gid, callback)
{
    if(aid == undefined) throw new Error("An application ID is required when unassigning an application to a group");
    if(gid == undefined) throw new Error("A group ID is required when unassigning an application to a group");
    this.request.delete("apps/" + aid + "/groups/" + gid, null, null, callback);
}

/*******************************************************************
************ Apps->Application Group Operations End ****************
********************************************************************
*/
