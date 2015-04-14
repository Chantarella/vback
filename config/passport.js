/*
* Levels:
* 0 - Admin
* 1 - User
* */
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var VKontakteStrategy = require('passport-vkontakte').Strategy;

var GitHubStrategy = require('passport-github').Strategy;
var User = require("../models/user");

var GITHUB_CLIENT_ID = "9fed19d59ffcfce73c1b";
var GITHUB_CLIENT_SECRET = "78b9a3e98886090d2f8b1397f285767a4569dd3d";

var VKONTAKTE_APP_ID = "4875977";
var VKONTAKTE_APP_SECRET = "FG5gyYmwD2NHyY5k9UX0";

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email,  password, done){
            User.findOne({'local.email': email}, function(err, user) {
                if(err){
                    return done(err);
                }

                if(user){
                    return done(null, false, {message: 'email is taken'})
                } else {
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = password;

                    var commonProfile = {
                        username: null,
                        email: email,
                        photo: null
                    };

                    //duplicate object_id in common with local strategy
                    newUser.addCommonData(newUser._id,  commonProfile);

                    newUser.save(function(err) {
                        if(err) {
                            throw err;
                        }

                        return done(null, newUser);
                    });
                }
            });

        }
    ));

    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, {message: "user doesn't exist"});
                }

                if (user.local.password !== password) {
                    return done(null, false, {message: "password isn't correct"});
                }


                return done(null, user);
            });

        }));

    passport.use(new VKontakteStrategy({
            clientID:     VKONTAKTE_APP_ID, // VK.com docs call it 'API ID'
            clientSecret: VKONTAKTE_APP_SECRET,
            callbackURL:  "http://localhost:3000/auth/vkontakte/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({'vkontakte.id': profile.id}, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (!user) {
                        var newUser = new User();
                        newUser.vkontakte.id = profile._json.id;
                        newUser.vkontakte.profile = profile;

                        var commonProfile = {
                            username: profile._json.first_name + ' ' + profile._json.last_name,
                            email: '',
                            photo: profile._json.photo
                        };


                        newUser.addCommonData(profile._json.id, commonProfile);

                        console.log(newUser);

                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }
                        });
                    }

                    console.log(profile);

                    return done(null, user || newUser);
                });
            });
        }
    ));

    passport.use(new GitHubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/github/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({'github.id': profile.id}, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (!user) {
                        var newUser = new User();
                        newUser.github.id = profile.id;
                        newUser.github.profile = profile;

                        var commonProfile = {
                            username: profile._json.name,
                            email: profile.emails[0].value,
                            photo: profile._json.avatar_url
                        };


                        newUser.addCommonData(profile.id,commonProfile);
                        console.log(newUser);

                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }
                        });
                    }

                    return done(null, user || newUser);
                });
            });
        }
    ));
};