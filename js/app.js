'use strict';

/* App Module */

var knowlyApp = angular.module('courses', ['knowlyServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/timetable/:studentID', {templateUrl: 'partials/timetable.html',   controller: TimetableCtrl}).
    when('/courses/:courseId', {templateUrl: 'partials/main.html', controller: CoursesCtrl}).
    //when('/courses/:courseId', {templateUrl: 'partials/course-detail.html', controller: CourseDetailCtrl}).
    otherwise({redirectTo: '/timetable'});
}]);




/**
 * get translation
 */
function t(text) {
	return translations[text] ? translations[text] : text;
}