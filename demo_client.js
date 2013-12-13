// Attempt to log in with a password.
//
// @param selector a string specifying which demo account to use.
// @param callback {Function(error|undefined)}
Meteor.loginAsDemo = function (selector, callback) {

  Accounts.callLoginMethod({
    methodArguments: [{demo: selector}],
    userCallback: callback});
    
};