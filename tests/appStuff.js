/*
*	Tests the nodejs wrapper. Also can serve as examples to use the wrapper.
*	Only tests operations done on Apps. Should run all ops once.
*	should deprovision/delete everything that i creates
*	Tests are chained, no way out of it that I can think of right now
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
var appId, newUserId, gid1, gid2;
var newProfile = okta.users.helpers.constructProfile("Timothy", "McGee", "tmcgee+" + now + "@test.com");
var newCreds = okta.users.helpers.constructCredentials("superPass1", "What is my favorite book?", "Deep Six");
var appModel = okta.apps.helpers.constructAppGroupModel();
var appModelOldWay = okta.apps.helpers.constructAppGroupModel();

/*
*	a bunch of profiles, grabbed these from Okta docs
*/
var appProfile =
{
  "name": "template_saml_2_0",
  "label": "Example SAML App" + now,
  "signOnMode": "SAML_2_0",
  "settings": {
    "app": {
      "audienceRestriction": "https://example.com/tenant/123",
      "forceAuthn": false,
      "postBackURL": "https://example.com/sso/saml",
      "authnContextClassRef": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
      "requestCompressed": "COMPRESSED",
      "recipient": "https://example.com/sso/saml",
      "signAssertion": "SIGNED",
      "destination": "https://example.com/sso/saml",
      "signResponse": "SIGNED",
      "nameIDFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
      "groupName": null,
      "groupFilter": null,
      "defaultRelayState": null,
      "configuredIssuer": null,
      "attributeStatements": null
    }
  }
};

var appUserProfile =
{
  "id": "",
  "scope": "USER",
  "credentials": {
    "userName": "tmcgee+" + now + "@test.com",
    "password": {
      "value": "superPass1"
    }
  }
};

var appUserProfileUpdate =
{
  "profile": {
    "salesforceGroups": [
      "Partner"
    ],
    "role": "Developer",
    "profile": "Gold Partner User"
  }
};

var newAppCred =
{
  "credentials": {
    "userName": "user@example.com",
    "password": {
      "value": "updatedP@55word"
    }
  }
};

log("Starting Test Suite...", true);


function cleanUpGroups()
{

    /*
    *   deletes a group
    */
	okta.groups.delete(gid1, function(d) {
        //checking("deleteGroup");
        d.should.have.property("success", true);
        ok();
    });

    /*
    *   deletes a group
    */
    okta.groups.delete(gid2, function(d) {
        //checking("deleteGroup");
        d.should.have.property("success", true);
        ok();
    });
}


function checkDeleteOp()
{

    /*
    *   deletes an app
    */
	okta.apps.delete(appId, function(d) {
	    checking("apps.delete");
	    d.should.have.property("success", true);

	    ok();
	});

}

function checkLifecycleOps()
{

    /*
    *   deactivates an App
    */
	//testing update app, assumes addApplication was run previously
	okta.apps.deactivate(appId, function(d) {
	    checking("apps.deactivate");
	    d.should.have.property("success", true);

	    ok();

	    /*
	    *   activates a group
	    */
		okta.apps.activate(appId, function(d) {
		    checking("apps.activate");
		    d.should.have.property("success", true);

		    ok();

		    //deactivating again to delete
			okta.apps.deactivate(appId, function(d) {
			    checkDeleteOp();
			});
		});
	});



}


function checkAppGroupOps()
{
	var newProfile = OktaAPI.Helpers.constructGroup("Test2-" + now, "Test2 group from " + now);


    /*
    *   adds a group
    */
	okta.groups.add(newProfile, function(d) {
	    checking("groups.add");
	    d.should.have.property("success", true);
	    d.should.have.property("resp").with.property("id");
	    ok();
	    gid2 = d.resp.id;


		/*
		*   assigns an app to a group
		*/
	    //checking assignment here to check the app listing
		okta.apps.assignGroup(appId, gid2, function(d) {
		    checking("apps.assignGroup");
		    d.should.have.property("success", true);
		    d.should.have.property("resp").with.property("id", gid2);
		    ok();

		    /*
		    *   gets groups that was just assigned
		    */
			okta.apps.getAssignedGroup(appId, gid2, function(d) {
			    checking("apps.getAssignedGroup");
			    d.should.have.property("success", true);
			    d.should.have.property("resp").with.property("id", gid2);
			    ok();

			    /*
			    *   get groups assigned to an application, with filter
			    */
				okta.apps.listGroupsAssigned(appId, {"limit" : 1}, function(d) {
				    checking("apps.getAssignedGroup");
				    d.should.have.property("success", true);
				    ok();

				    /*
				    *   remove group assigned to an application
				    */
				    //remove the first group
					okta.apps.removeGroup(appId, gid1, function(d) {
					    checking("apps.removeGroup");
					    d.should.have.property("success", true);
					    ok();

					    /*
					    *   remove group assigned to an application
					    */
					    //remove second group
						okta.apps.removeGroup(appId, gid2, function(d) {
						    checking("apps.removeGroup");
						    d.should.have.property("success", true);
						    ok();

							checkLifecycleOps();
						});
					});
				});
			});

		});
	});

}

//i had to chain them all together b/c they rely on eachother
function checkAppUserOps()
{

    /*
    *   adds a user
	*/
	okta.users.add(newProfile, newCreds, false, function(d) {
		checking("users.add");
		d.should.have.property("success", true);
		d.should.have.property("resp").with.property("id");
		newUserId = d.resp.id;
		ok();

	    /*
	    *   assigns a user to an Application, *NOTE* appUserProfile != response you get from adding a user
		*/
		appUserProfile.id = newUserId;
		okta.apps.assignUser(appId, appUserProfile, function(d) {
			checking("users.assignUser");
			d.should.have.property("success", true);
			d.should.have.property("resp").with.property("id", newUserId);
			ok();

		    /*
		    *   gets a user that was assigned to an application
			*/
			okta.apps.getAssignedUser(appId, newUserId, function(d) {
				checking("apps.getAssignedUser");
				d.should.have.property("success", true);
				d.should.have.property("resp").with.property("id", newUserId);
				ok();


			    /*
			    *   gets all users assigned to an app
				*/
				okta.apps.listUsersAssigned(appId, function(d) {
					checking("apps.listUsersAssigned");
					d.should.have.property("success", true);
					var resp = d.resp;
					resp.should.be.instanceof(Array);
					resp[0].should.have.property("id", newUserId);
					//d.should.have.property("resp").with.property("id", newUserId);
					ok();

				    /*
				    *   updates the credentials for an application
					*/
					okta.apps.updateAppCredsForUser(appId ,newUserId ,newAppCred , function(d) {
						checking("apps.updateAppCredsForUser");
						d.should.have.property("success", true);
						var resp = d.resp;
						d.should.have.property("resp").with.property("id", newUserId);
						d.should.have.property("resp").with.property("credentials").with.property("userName", newAppCred.credentials.userName);
						ok();

					    /*
					    *   updates the profile for an application
						*/
						okta.apps.updateAppProfileForUser(appId ,newUserId ,newAppCred , function(d) {
							checking("apps.updateAppProfileForUser");
							d.should.have.property("success", true);
							var resp = d.resp;
							d.should.have.property("resp").with.property("id", newUserId);
							d.should.have.property("resp").with.property("credentials").with.property("userName", newAppCred.credentials.userName);
							ok();

						    /*
						    *   removes a user from an application
							*/
							okta.apps.removeUser(appId ,newUserId , function(d) {
								checking("apps.removeUser");
								d.should.have.property("success", true);
								ok();

								checkAppGroupOps();
							});
						});
					});
				});
			});

		});
	});
}


function checkAppOps()
{
	var newProfile = okta.groups.helpers.constructGroup("Test-" + now, "Test group from " + now);


    /*
    *   creates a group to test with
	*/
	//need this to assign apps to groups
	okta.groups.add(newProfile, function(d) {
	    checking("groups.add");
	    d.should.have.property("success", true);
	    d.should.have.property("resp").with.property("id");
	    ok();
	    gid1 = d.resp.id;

	    /*
	    *   assigns the group to an app
		*/
	    //checking assignment here to check the app listing
		okta.apps.assignGroup(appId, gid1, function(d) {
		    checking("apps.assignGroup");
		    d.should.have.property("success", true);
		    d.should.have.property("resp").with.property("id", gid1);
		    ok();

		    /*
		    *   gets all applications that matches the filter
			*/
			//list apps, some filters, more then 1 app, it sends back as multiple responses
			okta.apps.list({"filter" : "group.id eq \"" + gid1 + "\"", "limit" : 1}, function(d) {
			    checking("apps.list some args");
			    d.should.have.property("success", true);
			    d.should.have.property("resp");
				var resp = d.resp;
				resp.should.be.instanceof(Array);
				resp[0].should.have.property("id", appId);


			    ok();

			    checkAppUserOps();

			});
		});
	});

    /*
    *   get profile for an application
	*/
	okta.apps.get(appId, function(d) {
	    checking("apps.get");
	    d.should.have.property("success", true);
	    d.should.have.property("resp").with.property("id");
	    ok();
	});

    /*
    *   get profile for an application
	*/
	//list apps, no args
	okta.apps.list(null, function(d) {
	    checking("apps.list no args");
	    d.should.have.property("success", true);
	    d.should.have.property("resp");
		var resp = d.resp;
		resp.should.be.instanceof(Array);
	    ok();
	});


    /*
    *   updates the profile for an application
	*/
	//testing update app, assumes addApplication was run previously
	okta.apps.update(appId, appProfile, function(d) {
	    checking("apps.update");
	    d.should.have.property("success", true);
	    var resp = d.resp;
	    for(var attr in appProfile)
	    {
	    	resp.should.have.property(attr, appProfile[attr]);
	    }
	    ok();
	});


}



function checkAddOp()
{

    /*
    *   adds an application
	*/
	okta.apps.add(appProfile, function(d) {
	    checking("apps.add");
	    d.should.have.property("success", true);
	    d.should.have.property("resp").with.property("id");
		appId = d.resp.id;
	    ok();

		checkAppOps();
	});

}

function main()
{
	checkAddOp();
}



main();
