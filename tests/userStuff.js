/*
*	Tests the nodejs wrapper. Also can serve as examples to use the wrapper.
*	Only tests operations done on events. Should call all the functions at
*	least once.
*
*/

var apikey = process.env.APIKEY;
var domain = process.env.DOMAIN;
if(process.env.APIKEY === undefined || process.env.DOMAIN === undefined) {
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
var newProfile = okta.users.helpers.constructProfile("Timothy", "McGee", "tmcgee+" + now + "@test.com");
var newCreds = okta.users.helpers.constructCredentials("superPass1", "What is my favorite book?", "Deep Six");

var noPwProfile = okta.users.helpers.constructProfile("incomp", "nopw", "incompnopw+" + now + "@test.com");
var noPwCreds = okta.users.helpers.constructCredentials("", "testetestest", "Deep Six");

var noQuesProfile = okta.users.helpers.constructProfile("incomp", "noques", "incompnoques+" + now + "@test.com");
var noQuesCred = okta.users.helpers.constructCredentials("superPass1", "", "" );

var noCredProfile = okta.users.helpers.constructProfile("incomp", "nocreds", "incompnocreds+" + now + "@test.com");
//var creds3 = OktaAPI.Helpers.constructCredentials("test", null, null );

var newUserId, newGroup, myId, myEmail = "test@test.com";

log("Starting Test Suite...", true);



function deprovisionUser() {
	/*
	*	deativate a user
	*/
	okta.users.deactivate(newUserId, function(d) {
		checking("users.deactivate");
		d.should.have.property("success", true);
		ok();
	});
}



function checkPasswordOp()
{

	/*
	*	deativate a user
	*/
	okta.users.resetPassword(newUserId, false, function(d) {
		checking("users.resetPassword");
		d.should.have.property("resp").with.property("resetPasswordUrl");
			ok();

    deprovisionUser();
		/*
		*	expires a password, sets it a temp password
		*/
		// okta.users.expirePassword(newUserId, true, function(d) {
		// 	checking("users.expirePassword give temp password");
		// 	d.should.have.property("resp").with.property("tempPassword");
		// 	ok();
    //
		// 	/*
		// 	*	expire password, user has to change pw on next login
		// 	*/
		// 	okta.users.expirePassword(newUserId, null, function(d) {
		// 		checking("users.expirePassword no params");
		// 		d.should.have.property("resp");
		// 		ok();
    //
		// 		deprovisionUser();
		// 	});
		//});

	});
}


//gets called after checkGetUsers, needs newUserId to be set
function checkCredentialOps()
{
	var secretAnswer = "eb1addff-860a-4082-ab07-4d5f449eda44";
	/*
	*	Change Password
	*/
	//lifecycle version
	// okta.forgotPassword(newUserId, false, function(d) {
	// 	checking("forgotPassword lifecycle option");
	// 	d.should.have.property("resp").with.property("resetPasswordUrl");
	// 	ok();
	// });

	/*
	*	Change recovery
	*/
	okta.users.changeRecoveryQuestion(newUserId,{ "value": "superPass1" } , {"question" : "What happens when I update my question?", "answer": secretAnswer } , function(d) {
		checking("users.changeRecoveryQuestion");
		d.should.have.property("resp").with.property("password");
		ok();

		//change pw, credentials version
		okta.users.forgotPasswordRecovery(newUserId,{ "value": "superPass239" } ,{ "answer": secretAnswer } , function(d) {
			checking("users.forgotPasswordRecovery");
			d.should.have.property("resp").with.property("password");
			ok();

			/*
			*	Change Password
			*/
			okta.users.changePassword(newUserId,{ "value": "superPass239" } ,{ "value": "superPass921380" } , function(d) {
				checking("users.changePassword");
				d.should.have.property("resp").with.property("password");
				ok();

				checkPasswordOp();
			});
		});
	});
}

function checkLifecycleOps()
{

	/*
	*	Activates a user
	*/
	okta.users.activate(newUserId, false, function(d) {
		checking("users.activate");
		d.should.have.property("success", true);
		d.should.have.property("resp").with.property("activationUrl").startWith("https://");
		ok();
		checkCredentialOps();
	});

	/*
	*	Activates a user with an email link
	*/
	//checked, don't want to spam myself
	// okta.activateUser(myId, true, function(d) {
	// 	checking("activateUser");
	// 	d.should.have.property("success", true);
	// 	ok();
	// });

	/*
	*	Unlocks a user
	*/
	okta.users.unlock(newUserId, function(d) {
		checking("users.unlock");
		d.should.have.property("success", false);
		ok();
	});

	/*
	*	resets the fators for a user
	*/
	okta.users.resetFactors(newUserId, function(d) {
		checking("users.resetFactors");
		d.should.have.property("resp");
		ok();
	});
}

function checkRelatedResources()
{

	/*
	*	Gets links to all apps assigned to a user
	*/
	okta.users.getApps(newUserId, function(d) {
		checking("users.getApps");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.be.instanceof(Array);
		ok();
	});

	/*
	*	Gets groups that user is a member of
	*/
	okta.users.getGroups(newUserId, function(d) {
		checking("users.getGroups");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.be.instanceof(Array);
		ok();
	});
}


/*
*	These operations don't effect the lifecycle of a user much, so they can return whenever,
*	as long as it's before the deprovision.
*/
function updateUser() {

	newProfile.mobilePhone = '123-456-7890';
	/*
	*	Update user with whole profile
	*/
	okta.users.update(newUserId, newProfile, null, function(d) {
		checking("users.update");
		d.should.have.property("success", true);
		d.should.have.property("resp").with.property("profile").with.property("mobilePhone", "123-456-7890");
		ok();
	});

	/*
	*	Update user with whole profile
	*/
	okta.users.updatePartial(newUserId, {mobilePhone: "321-654-0987"}, null, function(d) {
		checking("users.updatePartial");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.have.property("profile").with.property("mobilePhone", "321-654-0987");
		resp.should.have.property("profile").with.property("firstName", "Timothy");
		ok();
	});

	/*
	*	Update user with partial credentials, no recovery question
	*/
	okta.users.updatePartial(newUserId, null, noQuesCred, function(d) {
		checking("users.updatePartial, no Questions Cred");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.have.property("credentials").with.property("password");
		resp.should.have.property("profile").with.property("firstName", "Timothy");
		ok();
	});

	/*
	*	Update user with partial credentials, no passwords
	*/
	okta.users.updatePartial(newUserId, null, noPwCreds, function(d) {
		checking("users.updatePartial, no pw Cred");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.have.property("credentials").with.property("recovery_question").with.property("question" , "testetestest");
		resp.should.have.property("profile").with.property("firstName", "Timothy");
		ok();
	});



	checkRelatedResources();
	checkLifecycleOps();
}


function checkGetUsers()
{
	/*
	*	gets user with filters
	*/
	okta.users.list({'q': "tmcgee+" + now}, function(d) {
		checking("users.list");
		d.should.have.property("success", true);

		//d.should.have.property("resp")/.and != d.resp
		//it's like an object full of arrays, contains some metadata it looks like
		d.should.have.property("resp");
		var resp = d.resp;
		resp.should.be.instanceof(Array);
		ok();
		//console.log(require('util').inspect(resp));

		okta.users.list({'q': "tmcgee+" + now}, function(d) {
			checking("okta.users.list");
			d.should.have.property("success", true);
			//d.should.have.property("resp")/.and != d.resp
			//it's like an object full of arrays, contains some metadata it looks like
			d.should.have.property("resp");
			var newResp = d.resp;
			//comparison should work if no values in response profile is null
			//resp.should.equal(resp);
			ok();
		});
	});

}


function checkAddUser()
{
	/*
	*	Add user normal
	*/
	okta.users.add(newProfile, newCreds, false, function(d) {
		checking("users.add");
		d.should.have.property("success", true)
		d.should.have.property("resp").with.property("id");
		newUserId = d.resp.id;
		ok();
		updateUser();
		checkGetUsers();

	});

	/*
	*	Add user , with no pw
	*/
	okta.users.add(noPwProfile, noPwCreds, false, function(d) {
		checking("users.add no pw");
		d.should.have.property("success", true)
		d.should.have.property("resp").with.property("id");
		ok();
	});

	/*
	*	Add user , with no recovery question
	*/
	okta.users.add(noQuesProfile, noQuesCred, false, function(d) {
		checking("users.add no recovery question");
		d.should.have.property("success", true)
		d.should.have.property("resp").with.property("id");
		ok();
	});

	/*
	*	Add user , with no credentials at all
	*/
	okta.users.add(noCredProfile, null, false, function(d) {
		checking("users.add no creds");
		d.should.have.property("success", true)
		d.should.have.property("resp").with.property("id");
		ok();
	});

}

function checkGetUser()
{

	/*
	*	gets a user with their id, login or shortname
	*/
	okta.users.get(newProfile.login, function(d) {
		checking("okta.users.get");
		d.should.have.property("success", true);
		d.should.have.property("resp").with.property("id");
		ok();
	});

	// okta.getUser(myEmail, function(d) {
	// 	checking("getUser me");
	// 	d.should.have.property("success", true);
	// 	d.should.have.property("resp").with.property("id");
	// 	myId = d.resp.id;
	// 	ok();
	// });

}


function main() {
	checkAddUser();
}


main();
