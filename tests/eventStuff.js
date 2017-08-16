/*
*	Tests the nodejs wrapper. Also can serve as examples to use the wrapper.
*	Only tests operations done on events. Should call all the functions at 
*	least once.
*
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
	/*
	*	get all events for your org, can return alot of info
	*/
	// okta.events.list({"startDate" : "2014-10-30T00:00:00.000Z", "limit" : 5}, function(d) {
	//     checking("getEvents");
	//     d.should.have.property("success", true);
	//     console.log(d.resp);
	//     ok();

	// });
	okta.events.list({"startDate" : "2014-10-30T00:00:00.000Z", "limit" : 5}, false, function(d) {
	    checking("getEvents");
	    d.should.have.property("success", true);
	    console.log(d.resp);
	    ok();

	});
}



main();
