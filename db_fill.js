//var mongoose = require('mongoose');
//var config = require('./config/db');
//var faker = require('faker');
//var async = require('async');
//
//var User = require('./models/user.js');
//var Vacation = require('./models/vacation.js');
//var Mail = require('./models/mail.js');
//
//mongoose.connect(config.url);
//
//var userIds = [];
//
//function getRandomInt(min, max) {
//    return Math.floor(Math.random() * (max - min + 1)) + min;
//}
//
//function run() {
//        var Users = User.find({}, function (err, data) {
//            if (data.length < 2) {
//                for (var i = 0; i < 30; i++) {
//                    var newUser = new User();
//                    newUser.local.email = faker.internet.email();
//                    newUser.local.password = faker.internet.password();
//
//                    var commonProfile = {
//                        username: faker.name.findName(),
//                        email: newUser.local.email,
//                        photo: null
//                    };
//
//                    //duplicate object_id in common with local strategy
//                    newUser.addCommonData(newUser._id, commonProfile);
//
//                    userIds.push({_id: newUser._id, rank: newUser.rank});
//
//                    newUser.save(function (err, data) {
//                        if (err) {
//                            throw err;
//                        }
//
//                        return true;
//
//                    });
//                }
//
//
//            } else {
//                process.exit(code = 0);
//            }
//        });
//        //userIds.forEach(function (user) {
//        //    for (var x = 0; x < getRandomInt(1, 5); x++) {
//        //        var randMonth = getRandomInt(0, 11);
//        //        var daysCount = new Date(2015, randMonth, 0).getDate();
//        //        var month = [null, null];
//        //        var range = [[], null];
//        //
//        //        var randSplit = getRandomInt(0, 10);
//        //
//        //        randSplit = randSplit < 5;
//        //
//        //        var start = getRandomInt(1, daysCount);
//        //        var end = getRandomInt(start, daysCount);
//        //
//        //
//        //        month[0] = randMonth;
//        //
//        //        for (var i = start; i <= end; i++) {
//        //            range[0].push(i);
//        //        }
//        //
//        //        if (randSplit) {
//        //            randMonth += 1;
//        //            month[1] = randMonth;
//        //
//        //            daysCount = new Date(2015, randMonth, 0).getDate();
//        //            start = getRandomInt(1, daysCount);
//        //            end = getRandomInt(start, daysCount);
//        //
//        //            range[1] = [];
//        //
//        //            for (var y = start; y <= end; i++) {
//        //                range[1].push(y);
//        //            }
//        //        }
//        //
//        //        var newVacation = new Vacation();
//        //        newVacation.user_id = user.id;
//        //        newVacation.rank = user.rank;
//        //        newVacation.month = month;
//        //        newVacation.days = range;
//        //        newVacation.year = 2015;
//        //        newVacation.comment = faker.lorem.sentence();
//        //
//        //        newVacation.save(function (err, data) {
//        //            if (err) {
//        //                throw err;
//        //            }
//        //
//        //            console.log('Vacation #' + data._id + ' saved');
//        //        });
//        //
//        //    }
//        //});
//
//}
// run();