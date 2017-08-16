/*
* Tests the nodejs wrapper. Also can serve as examples to use the wrapper.
*	Only tests operations done on events. Should call all the functions at
*	least once.
*
*/
// Pull the API Key from enviromental variable
// Which is embeded in travis-ci
var apikey = process.env.APIKEY;
var domain = process.env.DOMAIN;
if(process.env.APIKEY === undefined || process.env.DOMAIN === undefined){
  console.log("No API key or domain");
  process.exit(1);
}


var OktaAPI = require("../index.js");
var okta = new OktaAPI(apikey, domain);
var should = require("should");
var log = function(str, newline) {
	if(newline == undefined) newline = false;
	process.stdout.write(str + (newline ? "\n" : ""));
}
var checking = function(str) {
	log("Checking " + str + "()");
}
var ok = function() {
	log(" OK!", true);
}

var now = new Date().valueOf();
var newProfile = okta.groups.helpers.constructGroup("Test-" + now, "Test group from " + now);
var uid, gid;

log("Starting Test Suite...", true);

/*
*   add a new group
*/
okta.groups.add(newProfile, function(d) {
    checking("groups.add");
    d.should.have.property("success", true);
    d.should.have.property("resp").with.property("id");
    ok();
    gid = d.resp.id;
    getUser();
});



function deleteEveryThing() {

    /*
    *   deletes a group
    */
    okta.groups.delete(gid, function(d) {
        checking("groups.delete");
        d.should.have.property("success", true);
        ok();
    });
}

function doThingsWithGroup() {

    /*
    *   gets a group by it's id
    */
    okta.groups.get(gid, function(d) {
        checking("groups.get");
        d.should.have.property("success", true);
        d.should.have.property("resp").with.property("id");
        ok();
    });

    /*
    *   updates a group with a new profile
    */
    okta.groups.update(gid, newProfile, function(d) {
        checking("groups.update");
        d.should.have.property("success", true);
        d.should.have.property("resp").with.property("id");
        ok();
    });

    /*
    *   adds a user to a group by group id and user id
    */
    okta.groups.addUser(gid, uid, function(d) {
        checking("groups.addUser");
        d.should.have.property("success", true);
        ok();

        /*
        *   removes a user to a group by group id and user id
        */
        okta.groups.removeUser(gid, uid, function(d) {
            checking("groups.removeUser");
            d.should.have.property("success", true);
            ok();
        });
    });

    /*
    *   gets all users in a group by group id
    */
    okta.groups.getUsers(gid,null, function(d) {
        checking("groups.getUsers");
        d.should.have.property("success", true);
        d.should.have.property("resp").instanceof(Array);
        ok();
    });

    /*
    *   gets all users in a group by group id, with a filter
    */
    okta.groups.getUsers(gid, {'limit' : 20}, function(d) {
        checking("groups.getUsers with limit");
        d.should.have.property("success", true);
        d.should.have.property("resp").instanceof(Array);
        ok();
    });

    /*
    *   gets all groups
    */
    okta.groups.list(null, function(d) {
        checking("groups.get");
        d.should.have.property("success", true);
        d.should.have.property("resp").instanceof(Array);
        ok();
    });

    /*
    *   gets all groups, with filter
    */
    okta.groups.list({'q': "Test-" + now, 'limit' : 1 }, function(d) {
        checking("groups.list with query");
        d.should.have.property("success", true);
        d.should.have.property("resp").instanceof(Array);
        ok();
    });

    /*
    *   gets all apps assigned to group
    */
    okta.groups.getApps(gid, null, function(d) {
        checking("groups.getApps");
        d.should.have.property("success", true);
        d.should.have.property("resp").instanceof(Array);
        ok();
    });
}

function getUser() {
    /*
    *   gets a user to put in a group
    */
    okta.users.get("test@example.com", function(d) {
        if (!d.success) {
            throw new Error("Failed to get user from Okta: " + d.error);
        } else if (d.resp.hasOwnProperty("errorCode")) {
            throw new Error("Failed to get user from Okta: " + d.resp.errorCode);
        }
        uid = d.resp.id;
        doThingsWithGroup();
    });
}

setTimeout(deleteEveryThing, 5000);
