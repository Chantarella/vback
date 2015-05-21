app.controller('CalendarController', ['$scope', '$rootScope', 'ngDialog', 'CalendarService', 'VacationService', 'UserService', function($scope, $rootScope, ngDialog, CalendarService, VacationService, UserService){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });
    $scope.loaded = false;

    $scope.baseConfig = CalendarService;
    $scope.vacations = null;
    $scope.vacationsByUser = null;
    $scope.userHistory = null;
    $scope.vac = null;

    $scope.usersList = {};
    $scope.userIds = [];

    $scope.comment = false;
    $scope.commented = false;

    //$scope.predicate = 'common.profile.username';

    $scope.monthHider = {
        startMonth: '1',
        endMonth: '12'
    };

    function hideMonth() {
        $scope.showMonth = [];

        if(+$scope.monthHider.startMonth < +$scope.monthHider.endMonth){
            for(var i = +$scope.monthHider.startMonth; i <= +$scope.monthHider.endMonth; i++) {
                console.log(i);
                $scope.showMonth.push('' + i);
            }
        } else {
            $scope.monthHider.startMonth = '1';
            $scope.monthHider.endMonth = '12';
        }

    }

    $scope.getMonthPosition = function(month) {
        if(~($scope.showMonth.indexOf(month))) {
            return ($scope.showMonth.indexOf(month) + 1);
        } else {
            console.log('no month');
            return ;
        }
    }

    $scope.$watch('monthHider', function() {
        hideMonth();
        console.log($scope.monthHider, $scope.showMonth);
    }, true);


    //$scope.showMonth = [1,2,3,4,5,6,7,8,9,10,11,12];

    var rank_list = [
        'Разработчик',
        'Менеджер',
        'Начальник'
    ];

    //Fill vacations-array with data from db
    var run = function() {
        VacationService.getVacations()
            .success(function (data) {
                $scope.vacations = data;
                console.log(data);
                angular.forEach($scope.vacations, function (el) {
                    UserService.getUser(el.user_id)
                        .success(function (user, status) {
                            el.user = user.common.profile.username || user.common.profile.email; // if name isn't defined - set email as user
                            // set email as username
                            el.rank = rank_list[user.common.rank] || 'Сотрудник';

                            $scope.usersList[el.user_id] = angular.fromJson(user);
                        })
                        .error(function (err, status) {
                            throw new Error(err)
                        });
                });

                diffByUsers($scope.vacations);

                $scope.loaded = true;
            })
            .error(function (err) {
                throw new Error(err);
            });
    };

    run();

    //Create array sorting vacations by user and month [user_id] => [1] => [{vac},{vac}...], [2] => ...
    function diffByUsers(vacations) {
        $scope.vacationsByUser = {};
        var tempMonth = [];

        vacations.forEach(function(vac) {
            if($scope.vacationsByUser[vac.user_id] === undefined) {
                $scope.vacationsByUser[vac.user_id] = [];
            }
        });
        for(var user in $scope.vacationsByUser) {
            $scope.userIds.push(user);
            for(var i = 1; i <= 12; i++) {
                $scope.vacationsByUser[user][i] = [];
                vacations.forEach(function(vac) {
                    if(~vac.month.indexOf(i) && user === vac.user_id) {
                        $scope.vacationsByUser[user][i].push(angular.fromJson(vac));
                    } else {
                        $scope.vacationsByUser[user][i].push({});
                    }
                });
            }
        }


    }

    $scope.openVacationParameters = function(vac) {
        $scope.vac = null;
        var access = null;

        UserService.getCurrentUser()
            .success(function(user) {
                access = user.common.access;

                var _template = access === 0 ? 'vacation' : 'manager_vacation';

                VacationService.getVacation(vac._id)
                    .success(function(data) {
                        $scope.vac = data[0];

                        UserService.getUser(data[0].user_id)
                            .success(function(data) {
                                $scope.vac.user = data.common.profile.username || data.common.profile.email;

                                ngDialog.open({
                                    template: '../templates/'+_template+'.html',
                                    className: 'ngdialog-theme-default',
                                    scope: $scope
                                });
                            })
                            .error(function(err) {
                                throw err;
                            });
                    })
                    .error(function(err) {
                        throw err;
                    });


            })
            .error(function(err) {
                throw err;
            });



    };

    $scope.defineRangeFromData = function(days, month, year) {
        return VacationService.defineRangeFromData(days, month, year);
    };

    $scope.showUserHistory = function(user_id) {
        $scope.userHistory = null;

        VacationService.getVacationsByUser(user_id)
            .success(function(data, status) {
                $scope.userHistory = data;

                UserService.getUser(user_id)
                    .success(function(user, status) {
                        $scope.userHistoryName = user.common.profile.username || user.common.profile.email;

                        console.log(data);
                    })
                    .error(function(err) {
                        throw new Error(err);
                    });

                console.log($scope.userHistory);

                ngDialog.open({
                    template: '../templates/user-history.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            }).
            error(function(error, status) {
                throw new Error(error);
            });
    };


    $scope.changeState = function(id, setState, cb) {
        VacationService.changeState(id, setState)
            .success(function(data, status) {

                setTimeout(cb, 300);
            })
            .error(function(err) {
                throw new Error(err);
            });
    };

    $scope.addComment = function(id, comment) {
        console.log(comment);
        VacationService.addComment(id, comment)
            .success(function(data, status) {
                console.log(data);
            })
            .error(function(error) {
                throw error;
            });
    };

    $scope.showState = function(num) {
        var states = ['Рассматривается', 'Подтверждена', 'Отказ'];

        states[10] = 'Одобрена';
        states[11] = 'Отклонена';

        return states[num];
    };

    $scope.prettyDate = function(day, year, month) {
        return CalendarService.getPrettyDate(day, year, month-1);
    };
    $scope.sortUsers = function(){
        VacationService.getVacations()
            .success(function (data) {
                $scope.vacations = data;
                diffByUsers($scope.vacations);
                x = [];
                $.each($scope.usersList, function (i, n) {
                    x.push(n);
                });
                $scope.usersList = x.sort(comparesSurname);
                var vacationsUser = [];
                $.each($scope.usersList, function (i, n) {
                    vacationsUser.push($scope.vacationsByUser[n._id]);
                });
                $scope.vacationsByUser = vacationsUser;
            })
            .error(function(err) {
                throw err;
            })
    };
    function comparesSurname(surname1, surname2) {
        console.log(surname1.common.profile.username.split(' ')[1],surname2.common.profile.username.split(' ')[1]);
        return surname1.common.profile.username.split(' ')[1] > surname2.common.profile.username.split(' ')[1];
    }
    $scope.resortUsers = function(){
        VacationService.getVacations()
        .success(function (data) {
                $scope.vacations = data;
                diffByUsers($scope.vacations);
                x = [];
                $.each($scope.usersList, function (i, n) {
                    x.push(n);
                });
                $scope.usersList = x.sort(comparesSurnameRevers);
                var vacationsUser = [];
                $.each($scope.usersList, function (i, n) {
                    vacationsUser.push($scope.vacationsByUser[n._id]);
                });
                $scope.vacationsByUser = vacationsUser;
            })
            .error(function(err) {
                throw err;
            });
    };
    function comparesSurnameRevers(surname1, surname2) {
        console.log(surname1.common.profile.username.split(' ')[1],surname2.common.profile.username.split(' ')[1]);
        return surname1.common.profile.username.split(' ')[1] < surname2.common.profile.username.split(' ')[1];
    }
    $scope.$on('deleteUser', function (event, data) {
        console.log('removed user');
        $scope.vacations = null;
        $scope.vacationsByUser = null;
        $scope.userHistory = null;
        $scope.vac = null;

        $scope.usersList = {};
        $scope.userIds = [];

        run();
    });

}]);