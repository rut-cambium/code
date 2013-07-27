'use strict';

/* App Module */

var knowlyApp = angular.module('courses', ['knowlyServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/timetable/:studentID', {templateUrl: 'partials/timetable.html',   controller: TimetableCtrl}).
    when('/courses/:studentID', {templateUrl: 'partials/main.html', controller: CoursesCtrl}).
    when('/knowii/:studentID/:knowiiId', {templateUrl: 'partials/knowii-detail.html', controller: KnowiiDetailCtrl}).
    otherwise({redirectTo: '/timetable'});
}]);




/**
 * get translation
 */
function t(text) {
	return translations[text] ? translations[text] : text;
}


/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 * http://stackoverflow.com/questions/10134237/javascript-random-integer-between-two-numbers
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}