/**
 * Created by Florenz on 21.09.15.
 */

(function () {
    var app = angular.module('calendarNewEvent', []);


    app.controller('NewEventController', function ($scope,$http) {
        $scope.event =
        {
            title: "Samstagsdisko",
            type: "party",
            link: "https://github.com/Florenz23/tugeil/issues/11",
            organisation: "alteMensa",
            location: "alte Mensa",
            startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
            endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
            description: "So wie immer Samstagsdisko halt kacke"
        };
        $scope.event = {};


        $scope.toggle = function ($event, field, event) {
            $event.preventDefault();
            $event.stopPropagation();
            event[field] = !event[field];
        };
        $scope.formatDate = function (date) {
            date = new Date(date);
            date = date.format("yyyy-mm-dd hh:mm:ss");
            return date;
        };
        $scope.formatDates = function () {
            var startsAt = $scope.event.startsAt;
            var endsAt = $scope.event.endsAt;
            startsAt = $scope.formatDate(startsAt);
            $scope.event.startsAt = startsAt;

            endsAt = $scope.formatDate(endsAt);
            $scope.event.endsAt = endsAt;
        };


        $scope.save = function () {
            $scope.$broadcast('show-errors-check-validity');

            if ($scope.eventForm.$valid) {
                $scope.formatDates();
                var data = $scope.event;
                data = JSON.stringify(data);
                console.log("data");
                $http({
                    method: 'POST',
                    url: 'php/server.php?operation=calendarSaveEvent&data=' + data
                }).then(function successCallback(response) {
                    if(response.status != "ok"){
                        console.log(response.data.status)
                    }else {
                        console.log("läuft");
                    }
                }, function errorCallback(response) {
                    console.log("error");
                    console.log(response);
                });
                $scope.reset();
            }
        };

        $scope.reset = function () {
            $scope.$broadcast('show-errors-reset');
            $scope.user = {name: '', email: ''};
            $scope.event = {};
        }


    });
    app.directive('showErrors', function ($timeout, showErrorsConfig) {
            var getShowSuccess, linkFn;
            getShowSuccess = function (options) {
                var showSuccess;
                showSuccess = showErrorsConfig.showSuccess;
                if (options && options.showSuccess != null) {
                    showSuccess = options.showSuccess;
                }
                return showSuccess;
            };
            linkFn = function (scope, el, attrs, formCtrl) {
                var blurred, inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses;
                blurred = false;
                options = scope.$eval(attrs.showErrors);
                showSuccess = getShowSuccess(options);
                inputEl = el[0].querySelector('[name]');
                inputNgEl = angular.element(inputEl);
                inputName = inputNgEl.attr('name');
                if (!inputName) {
                    throw 'show-errors element has no child input elements with a \'name\' attribute';
                }
                inputNgEl.bind('blur', function () {
                    blurred = true;
                    return toggleClasses(formCtrl[inputName].$invalid);
                });
                scope.$watch(function () {
                    return formCtrl[inputName] && formCtrl[inputName].$invalid;
                }, function (invalid) {
                    if (!blurred) {
                        return;
                    }
                    return toggleClasses(invalid);
                });
                scope.$on('show-errors-check-validity', function () {
                    return toggleClasses(formCtrl[inputName].$invalid);
                });
                scope.$on('show-errors-reset', function () {
                    return $timeout(function () {
                        el.removeClass('has-error');
                        el.removeClass('has-success');
                        return blurred = false;
                    }, 0, false);
                });
                return toggleClasses = function (invalid) {
                    el.toggleClass('has-error', invalid);
                    if (showSuccess) {
                        return el.toggleClass('has-success', !invalid);
                    }
                };
            };
            return {
                restrict: 'A',
                require: '^form',
                compile: function (elem, attrs) {
                    if (!elem.hasClass('form-group')) {
                        throw 'show-errors element does not have the \'form-group\' class';
                    }
                    return linkFn;
                }
            };
        }
    );

    app.provider('showErrorsConfig', function () {
        var _showSuccess;
        _showSuccess = false;
        this.showSuccess = function (showSuccess) {
            return _showSuccess = showSuccess;
        };
        this.$get = function () {
            return {showSuccess: _showSuccess};
        };
    });

})();
