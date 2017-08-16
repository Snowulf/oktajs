/*
* Tests the nodejs wrapper. Also can serve as examples to use the wrapper.
*	Only tests operations done on events. Should call all the functions at
*	least once.
*
*/
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
var username = "";
var password = "";

log("Starting Test Suite...", true);

var sessionId;


/*
*   creates a session
*/
okta.sessions.create(username, password, null, function(d) {
    checking("sessions.create");
    d.should.have.property("success", true);
    d.should.have.property("resp").with.property("id");
    sessionId = d.resp.id;
    ok();
    doThingsWithSession();
});

/*
*   creates a session, with a token
*/
okta.sessions.create(username, password, {'additionalFields' : 'cookieToken'}, function(d) {
    checking("sessions.create with one time token");
    d.should.have.property("success", true);
    d.should.have.property("resp").with.property("id");
    //sessionId = d.resp.id;
    ok();
});

function doThingsWithSession() {

    /*
    *   validates a session
    */
    okta.sessions.validate(sessionId, function(d) {
        checking("sessions.validate");
        d.should.have.property("success", true);
        d.should.have.property("resp").with.property("id", sessionId);
        ok();
    });

    /*
    *   extends a session
    */
    okta.sessions.extend(sessionId, function(d) {
        checking("sessions.extend");
        d.should.have.property("success", true);
        d.should.have.property("resp").with.property("id", sessionId);
        ok();
    });
}

setTimeout(function() {

    /*
    *   closes a session
    */
    okta.sessions.close(sessionId, function(d) {
        checking("sessions.close");
        d.should.have.property("success", true);
        ok();
    });
}, 5000);
