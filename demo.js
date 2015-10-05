'use strict';
(function () {
    var app = angular.module('demo', ['mwl.calendar', 'ui.bootstrap', 'ngTouch', 'ngAnimate','calendarNewEvent']);

    //This will change the slide box directive template to one of your choosing
    app.config(function ($provide) {
        $provide.decorator('mwlCalendarSlideBoxDirective', function ($delegate) {
            var directive = $delegate[0];
            delete directive.template; //the calendar uses template instead of template-url so you need to delete this
            directive.templateUrl = 'calendar-slide.html';
            return $delegate;
        });
    });

    app.directive("calendarView", function () {
        return {
            restrict: "E",
            templateUrl: "calendar-view.html"
        };
    });
    app.directive("calendarNewEvent", function () {
        return {
            restrict: "E",
            templateUrl: "calendar-new-event.html"
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
            });
        };
        return svc;
    }]);
    app.controller('MainCtrl', ['$http', 'moment', '$modal', function ($http, moment, $modal) {

        this.getData = function () {
            var obj = this;
            obj.events = [];
            $http({
                method: 'GET',
                url: 'php/server.php?operation=calendarGetData'
            }).then(function successCallback(response) {
                obj.events = response.data.result;
            }, function errorCallback(response) {
                console.log("error");
                console.log(response.statusText);
            });
        };
        this.getData();

        var vm = this;
        //These variables MUST be set as a minimum for the calendar to work
        vm.showCalendar = false;
        vm.showMenu = false;
        vm.calendarView = 'week';
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
               // templateUrl: 'modalContent.html',
                templateUrl: 'model-content.html',
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
            date = date.format("yyyy-mm-dd hh:mm:ss");
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





