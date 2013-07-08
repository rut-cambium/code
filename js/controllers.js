'use strict';

/* Controllers */

function TimetableCtrl($scope, TimeTable) {
  //format date range for current week (ex.:5-10.5.13)
  var currentDate = new Date();
  var lastSunday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 0);
  var nextFriday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 5);
  $scope.weekRange = lastSunday.getDate() + '-' + nextFriday.getDate() + '.' + (nextFriday.getMonth()+1) + '.' + nextFriday.getFullYear().toString().slice(-2);
  
  $scope.pageTitle = t('Calendar');
  
  //translation function
	$scope.t = t; 
	$scope.calendar = {1:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 2:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 3:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 4:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 5:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 6:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 7:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}};
  // 
	TimeTable.query({fileName: 'pupil_schedule'}, function(data){
		angular.forEach(data, function(item) {
      item.content = '<a class="course_link" href="#/courses/' + item.Courses_Id + '">' + item.CourseName + '</a>';
      $scope.calendar[item.HourOfTheDay][item.DayOfTheWeek] = item;
    });
	});
}



function CoursesCtrl($scope, $rootScope, $http, $routeParams) {
  //translation function
	$scope.t = t; 
	

	$http.get('././data/time_table.json').success(function(courses) {
		$scope.courses = courses;
		$scope.uniqueCourses = {};
	  angular.forEach(courses, function(course, index) {
	  	$scope.uniqueCourses[course.OwnedByCourse] = index;
	  });
	  
	  $scope.courseName = $routeParams.courseIndex ? $scope.courses[$routeParams.courseIndex].OwnedByCourse : t('All courses');
	  // update page title 
	  $rootScope.pageTitle = $scope.courseName;
	});
	
	
	
	$scope.courseIndex = $routeParams.courseIndex;
}

function CourseDetailCtrl($scope, $routeParams) {
  //$scope.phoneId = $routeParams.phoneId;
}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams'];