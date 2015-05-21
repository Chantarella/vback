app.filter('monthName', [function() {
    return function (monthNumber) {
        var monthNames = [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ];
        return monthNames[monthNumber-1];
    }
}]);

app.filter('dayName', [function() {
    return function (monthNumber) {
        var monthNames = [ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс' ];

        return monthNames[monthNumber];
    }
}]);

app.filter('addZeroToMontNum', [function(){
    return function(monthNumber){
        if(monthNumber < 10) {
            return 0 + '' + monthNumber;
        }

        return monthNumber;
    }
}]);
app.filter('range', function() {
    return function(input, start, end) {
        start = parseInt(start);
        end = parseInt(end);
        var direction = (start <= end) ? 1 : -1;
        while (start != end) {
            input.push(start);
            start += direction;
        }
        return input;
    };
});
app.filter('rank', [function() {
    return function(rankNum) {
        var rank_list = [
            'Разработчик',
            'Менеджер',
            'Начальник'
        ];

        return rank_list[rankNum];
    }

}]);