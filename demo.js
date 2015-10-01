'use strict';
(function () {
    var app = angular.module('demo', ['mwl.calendar', 'ui.bootstrap', 'ngTouch', 'ngAnimate']);

        app.config(function(calendarConfigProvider) {

            calendarConfigProvider.setDateFormatter('moment'); // use either moment or angular to format dates on the calendar. Default angular. Setting this will override any date formats you have already set.

            calendarConfigProvider.setDateFormats({
                hour: 'HH:mm' // this will configure times on the day view to display in 24 hour format rather than the default of 12 hour
            });

            calendarConfigProvider.setTitleFormats({
                day: 'ddd D MMM' //this will configure the day view title to be shorter
            });

            calendarConfigProvider.setI18nStrings({
                eventsLabel: 'Events', //This will set the events label on the day view
                timeLabel: 'Time' //This will set the time label on the time view
            });

            calendarConfigProvider.setDisplayAllMonthEvents(true); //This will display all events on a month view even if they're not in the current month. Default false.

            calendarConfigProvider.setDisplayEventEndTimes(true); //This will display event end times on the month and year views. Default false.

        });

    app.directive("calendarView", function () {
        return {
            restrict: "E",
            templateUrl: "calendar-view.html"
        };
    });
    app.directive("calendarEdit", function () {
        return {
            restrict: "E",
            templateUrl: "calendar-edit.html"
        };
    });
    app.directive("calendarMain", function () {
        return {
            restrict: "E",
            templateUrl: "calendar-main.html"
        };
    });
    app.service('database', ['$http', function ($http) {
        var svc = {};
        var value;
        svc.data = {};
        svc.getData = function () {
            $http.get('php/server.php', {table: 'jaja'}).success(function (data) {
                value = data;
                svc.data = value;
                console.log("http: " + value);
            });
        };
        return svc;
    }]);
    app.controller('MainCtrl', ['$http', 'moment', function ($http, moment, $modal) {
        this.getData = function () {
            var obj = this;
            obj.events = [];
            $http({
                method: 'GET',
                url: 'php/server.php?operation=calendarGetData'
            }).then(function successCallback(response) {
                obj.events = response.data.result;
                console.log(obj.events);
            }, function errorCallback(response) {
                console.log("error");
                console.log(response.statusText);
            });
        };
        this.getData();
        var vm = this;
        //These variables MUST be set as a minimum for the calendar to work
        vm.showMenu = true;
        vm.calendarView = 'month';
        vm.calendarDay = new Date();
        /*
         vm.events = [
         {
         title: 'Alte Mensa',
         type: 'party',
         startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
         endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
         draggable: true,
         resizable: true
         }, {
         title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
         type: 'sport',
         startsAt: moment().subtract(1, 'day').toDate(),
         endsAt: moment().add(5, 'days').toDate(),
         draggable: true,
         resizable: true
         }, {
         title: 'This is a really long event title that occurs on every year',
         type: 'study',
         startsAt: moment().startOf('day').add(7, 'hours').toDate(),
         endsAt: moment().startOf('day').add(19, 'hours').toDate(),
         recursOn: 'year',
         draggable: true,
         resizable: true
         }
         ];
         */


        /*
         var currentYear = moment().year();
         var currentMonth = moment().month();

         function random(min, max) {
         return Math.floor((Math.random() * max) + min);
         }

         for (var i = 0; i < 1000; i++) {
         var start = new Date(currentYear,random(0, 11),random(1, 28),random(0, 24),random(0, 59));
         vm.events.push({
         title: 'Event ' + i,
         type: 'warning',
         startsAt: start,
         endsAt: moment(start).add(2, 'hours').toDate()
         })
         }*/

        function showModal(action, event) {
            $modal.open({
                templateUrl: 'modalContent.html',
                controller: function () {
                    var vm = this;
                    vm.action = action;
                    vm.event = event;
                },
                controllerAs: 'vm'
            });
        }

        vm.eventClicked = function (event) {
            showModal('Clicked', event);
        };

        vm.eventEdited = function (event) {
            showModal('Edited', event);
        };

        vm.eventDeleted = function (event) {
            showModal('Deleted', event);
        };

        vm.eventTimesChanged = function (event) {
            showModal('Dropped or resized', event);
        };
        vm.toggle = function ($event, field, event) {
            $event.preventDefault();
            $event.stopPropagation();
            event[field] = !event[field];
        };
        vm.formatDate = function (date) {
            date = new Date(date);
            date= date.format("yyyy-mm-dd hh:mm:ss");
            return date;
        };
        vm.formatEvent = function (index) {
            var event = this.events[index];
            var startsAt = event.startsAt;
            startsAt = this.formatDate(startsAt);
            this.events[index].startsAt = startsAt;
            var endsAt = event.endsAt;
            endsAt = this.formatDate(endsAt);
            this.events[index].endsAt = endsAt;
        };

        vm.saveData = function (index) {
            this.formatEvent(index);
            var data = this.events[index];
            data = JSON.stringify(data);
            $http({
                method: 'POST',
                url: 'php/server.php?operation=calendarSaveEvent&data=' + data
            }).then(function successCallback(response) {
                console.log(response)
            }, function errorCallback(response) {
                console.log("error");
                console.log(response.statusText);
            });
        };
    }]);
})();





