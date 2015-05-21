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

var GITHUB_CLIENT_ID = "95e264a9b9fbc7f0101d";
var GITHUB_CLIENT_SECRET = "8ecb3e3a382f0d911a9fd624e5f5f2436b922ffd";

var VKONTAKTE_APP_ID = "4875977";
var VKONTAKTE_APP_SECRET = "FG5gyYmwD2NHyY5k9UX0";
var re = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
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
            //firstnameField: 'firstname',
            //surnameField: 'surname',
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, function(req ,email,  password, done){
//
            User.findOne({'local.email': email}, function(err, user) {
                if(err){
                    return done(err);
                }

                if(re.test(email)==false) {
                    return done(null, false, {message: 'email is invalid'});
                }
                if(user){
                    return done(null, false, {message: 'email is taken'})
                } else {
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.username = nameuser +' '+surname;
                    console.log(newUser.local.username);
                    newUser.local.password = password;
                    //newUser.local.firstname = firstname;
                    //newUser.local.surname = surname;
                    var commonProfile = {
                        username: nameuser +' '+surname,
                        email: email,
                        photo: null
                    };
                    console.log(commonProfile);
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
        function(req, email, password,done) {
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
            callbackURL:  "http://light-it-02.tk/auth/vkontakte/callback"
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
            callbackURL: "http://light-it-02.tk/auth/github/callback"
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