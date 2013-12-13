///
/// LOGIN
///

// Demo accounts can be specified using various keys.
// @param account String the account name.
// @returns A selector to pass to mongo to get the user record.


// XXX maybe this belongs in the check package
var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});

var userQueryValidator = Match.Where(function (user) {
  check(user, {
    id: Match.Optional(NonEmptyString),
    demo: Match.Optional(NonEmptyString)
  });
  if (_.keys(user).length !== 1)
    throw new Match.Error("User property must have exactly one field");
  return true;
});

// Handler to login with plaintext password.
//
// The meteor client doesn't use this, it is for other DDP clients who
// haven't implemented SRP. Since it sends the password in plaintext
// over the wire, it should only be run over SSL!
//
// Also, it might be nice if servers could turn this off. Or maybe it
// should be opt-in, not opt-out? Accounts.config option?
Accounts.registerLoginHandler(function (options) {
  if (!options.demo)
    return undefined; // don't handle

  check(options, {demo: String});

  var selector = {'services.demo.account':options.demo};
  var user = Meteor.users.findOne(selector);
  if (!user)
    throw new Meteor.Error(403, "User not found");

  var stampedLoginToken = Accounts._generateStampedLoginToken();
  Meteor.users.update(
    user._id, {$push: {'services.resume.loginTokens': stampedLoginToken}});

  return {
    token: stampedLoginToken.token,
    tokenExpires: Accounts._tokenExpiration(stampedLoginToken.when),
    id: user._id
  };
});

Meteor.users._ensureIndex('services.demo.account', {unique: 1, sparse: 1});