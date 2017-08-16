/*
*	Tests for checking misc. things, backwards compatibility, aliasing, etc.
*
*	not up to date with new design
*/



var OktaAPI = require("../index.js");
var okta = new OktaAPI("", "");
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


function main()
{
	// okta.users.list({"limit" : 5}, false,  function(d) {
	//     checking("users.list");
	//     d.should.have.property("success", true);
	//     console.log(require('util').inspect(d));
	//     ok();

	//     var newList = d.resp;

	// 	okta.listUsers({"limit" : 5}, false,  function(d) {
	// 	    checking("getUsers");
	// 	    d.should.have.property("success", true);
	// 	    d.should.have.property("resp", newList);
	// 	    ok();

	// 	});
	// });


	/*
	*	testing naming changes
	*/
	// okta.listGroups({"limit" : 5}, false,  function(d) {
	//     checking("getEvents");
	//     d.should.have.property("success", true);
	//     console.log(require('util').inspect(d));
	//     ok();

	// });

	// var now = new Date().valueOf();
	// var newProfile = OktaAPI.Helpers.constructProfile("Timothy", "McGee", "tmcgee+" + now + "@test.com");
	// var newCreds = OktaAPI.Helpers.constructCredentials("superPass1", "What is my favorite book?", "Deep Six");

	// okta.createUser(newProfile, newCreds, false, function(d) {
	// 	checking("addUser");
	// 	d.should.have.property("success", true)
	// 	d.should.have.property("resp").with.property("id");
	// 	newUserId = d.resp.id;
	// 	ok();

	// });




	/*
	*	testing getGroups change
	*/
	// var getGroupsResp;
	// okta.getGroups({'q' : 'Guests'}, function(d) {
	// 	checking("getUsers");
	// 	d.should.have.property("success", true);

	// 	//d.should.have.property("resp")/.and != d.resp
	// 	//it's like an object full of arrays, contains some metadata it looks like
	// 	d.should.have.property("resp");
	// 	var resp = d.resp;
	// 	resp.should.be.instanceof(Array);
	// 	ok();
	// 	getGroupsResp = resp;
	// 	okta.getGroups('Guests', function(d) {
	// 		checking("getUsers");
	// 		d.should.have.property("success", true);

	// 		//d.should.have.property("resp")/.and != d.resp
	// 		//it's like an object full of arrays, contains some metadata it looks like
	// 		d.should.have.property("resp", getGroupsResp);
	// 		var resp = d.resp;
	// 		resp.should.be.instanceof(Array);
	// 		ok();
	// 	});
	// });


	/*
	*	get all events for your org, can return alot of info
	*/
	// okta.getEvents({"limit" : 5, 'followLink' : true},  function(d) {
	//     checking("getEvents");
	//     d.should.have.property("success", true);
	//     console.log(require('util').inspect(d));
	//     ok();

	// });


	/*
	*	get all events for your org, can return alot of info
	*/
	// okta.getEvents({"limit" : 5},  function(d) {
	//     checking("getEvents");
	//     d.should.have.property("success", true);
	//     console.log(require('util').inspect(d));
	//     ok();

	// });

	/*
	*	get all events for your org, can return alot of info
	*/
	// okta.getEvents(null,  function(d) {
	//     checking("getEvents");
	//     d.should.have.property("success", true);
	//     console.log(require('util').inspect(d));
	//     ok();

	// });

}



main();
