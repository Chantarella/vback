app.directive('confirm', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, atrs) {
            $elm.on('click', function() {
                var elm = $('div[data-vac="'+atrs.confirm+'"]');
                var classes = ['rangeAccepted', 'rangeApproved', 'rangeDeclined', 'rangeRefused'];

                classes.forEach(function(cl) {
                    $(elm).removeClass(cl);
                });

                if(!atrs.manager) {
                    $(elm).addClass('rangeAccepted');

                } else {
                    $(elm).addClass('rangeApproved');
                }
            });

        }
    };
});

app.directive('refuse', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, atrs) {
            $elm.on('click', function() {
                var elm = $('div[data-vac="'+atrs.refuse+'"]');
                var classes = ['rangeAccepted', 'rangeApproved', 'rangeDeclined', 'rangeRefused'];

                classes.forEach(function(cl) {
                    $(elm).removeClass(cl);
                });

                if(!atrs.manager) {
                    $(elm).addClass('rangeRefused');

                } else {
                    $(elm).addClass('rangeDeclined');
                }
            });

        }
    };
});

app.directive('scrollOnClick', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, atrs) {
            $elm.on('click', function() {
                var target = $('.month-wrapper');
                var shift = 0;
                var prevPos = atrs.target-1 < 0 ? 0 : atrs.target-1;

                for(var i = 0; i < (prevPos); i++) {
                    shift += target[i].clientWidth;
                    if(i > 3) shift+=10;
                }

                $(".swipe-area").animate({scrollLeft: shift}, "slow");


            });
        }
    }
});


app.directive('startPosition', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, atrs) {
            $(document).ready(function() {
                setTimeout(function() {
                    var target = $('.month-wrapper');
                    var shift = 0;


                    for(var i = 0; i < (atrs['startPosition'] - 1); i++) {
                        shift += target[i].clientWidth;
                        if(i > 3) shift+=20;
                    }

                    $(".swipe-area").animate({scrollLeft: shift}, "slow");

                }, 1000)

            });
        }
    };
});

app.directive('horizontalScroll', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, atrs) {
            $(".swipe-area").mousewheel(function(event, delta) {
                this.scrollLeft -= (delta * 30);
                event.preventDefault();

            });

        }
    };
});

app.directive('rangeLine', function() {
    return {
        restrict: 'C',
        link: function(scope, $elm, atrs) {
            var left = (atrs.startPos*18)-18,
                size  = atrs.size*18;

            $($elm).css({
                'left': left+'px',
                'min-width': size+'px'
            });

            var states = {
                active: "rangeActive",
                refused: "rangeRefused",
                empty: "rangeEmpty",
                accepted: "rangeAccepted",

                approved: "rangeApproved",
                declined: "rangeDeclined"
            };


            switch (atrs.acceptionState) {
                case '0':
                    elmClass = states.active;
                    break;

                case '1':
                    elmClass = states.accepted;
                    break;

                case '2':
                    elmClass = states.refused;
                    break;

                case '10':
                    elmClass = states.approved;
                    break;

                case '11':
                    elmClass = states.declined;
                    break;
            }

            $($elm).addClass(elmClass);
        }
    };
});

app.directive('scrollMouth', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, atrs) {
            // $elm.bind('scroll', function() {
            $($elm).scroll(function(){
                var sticky = $('.days-wrapper'),
                    scroll = $($elm).scrollTop();

                if (scroll >= 1) sticky.addClass('fixed').css({
                    top:scroll
                });
                else sticky.removeClass('fixed');
            });

            //   });

            console.log($elm);
        }
    };
});