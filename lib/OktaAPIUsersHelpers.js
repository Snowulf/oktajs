"use strict";

exports.constructProfile = constructProfile;
exports.constructPassword = constructPassword;
exports.constructRecoveryQuestion = constructRecoveryQuestion;
exports.constructCredentials = constructCredentials;
 
/**
 * Creates an object that reflects the structure of an Okta User Object
 * @method constructProfile
 * @param firstName
 * @param lastName
 * @param email
 * @param login optional
 * @param mobilePhone optional
 * @param customAttribs a map of property -> propertyValue for custom attributes on a user
 * @returns {{}}
 */
function constructProfile(firstName, lastName, email, login, mobilePhone, customAttribs) {
    var profile = {};
    profile.login = (login ? login : email);
    profile.email = email;
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.mobilePhone = mobilePhone;
    if(customAttribs != undefined) {
        for(var prop in customAttribs) {
            profile[prop] = customAttribs[prop];
        }
    }
    return profile;
}
/**
 * Creates an object that reflects the structure of an Okta Password Object
 * @method constructPassword
 * @param password
 * @returns {{value: *}}
 */
function constructPassword(password) {
    var newPassword = {value: password};
    return newPassword;
}
/**
 * Constructs an object that reflects the structure of an Okta Recovery Question Object
 * @method constructRecoveryQuestion
 * @param question
 * @param answer
 * @returns {{question: *, answer: *}}
 */
function constructRecoveryQuestion(question, answer) {
    var newQuestion = {question: question, answer: answer};
    return newQuestion;
}
/**
 * Constructs an object that reflects the structure of an Okta Credentials Object
 * If you don't want to set a pw or recovery question just pass in null or empty string
 * @method constructCredentials
 * @param password
 * @param question
 * @param answer
 * @returns {{}}
 */
function constructCredentials(password, question, answer) {
    var credentials = {};
    if(password) credentials.password = constructPassword(password);
    if(question && answer) credentials.recovery_question = constructRecoveryQuestion(question, answer);
    return credentials;
}
