'use strict';
(function () {
    var app = angular.module('demo', ['mwl.calendar', 'ui.bootstrap', 'ngTouch', 'ngAnimate','myApp']);

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
                url: '../php/server.php?operation=calendarGetData'
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

        vm.saveData = function (index) {
            //todo change confirmed to tue in database
            console.log("todo");
        };
    }]);

})();





