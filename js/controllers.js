'use strict';

/* Controllers */

function TimetableCtrl($scope, TimeTable, $routeParams) {
  //format date range for current week (ex.:5-10.5.13)
  var currentDate = new Date();
  var lastSunday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 0);
  var nextFriday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 5);
  $scope.weekRange = lastSunday.getDate() + '-' + nextFriday.getDate() + '.' + (nextFriday.getMonth()+1) + '.' + nextFriday.getFullYear().toString().slice(-2);
  $scope.pageTitle = t('Calendar');
  
  //translation function
	$scope.t = t; 
	$scope.calendar = {1:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 2:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 3:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 4:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 5:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 6:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 7:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}};
  $scope.studentID = $routeParams.studentID ? $routeParams.studentID : 101;
  // get timetable data
	TimeTable.query({studentID: $scope.studentID}, function(data){
		angular.forEach(data, function(item) {
      item.content = '<a class="course_link" href="#/courses/' + $scope.studentID + '?course=' + item.Courses_Id + '">' + item.CourseName + '</a>';
      $scope.calendar[item.HourOfTheDay][item.DayOfTheWeek] = item;
    });
	});
}



function CoursesCtrl($scope, $rootScope, Subjects, Knowies, TimeTable, $routeParams) {
  //translation function
	$scope.t = t; 
	$scope.studentID = $routeParams.studentID ? $routeParams.studentID : 101;
	$scope.courseID = $routeParams.course ? $routeParams.course : 9;
	$scope.page = 1;
	$scope.subjectID = 0;
	$scope.coursesMine = [];
  $scope.coursesAll = [];
  $scope.coursesNames = {};
  $scope.mineTabClass = 'active';
  $scope.courseName = "&nbsp;";
  $rootScope.activeTab = $rootScope.activeTab ? $rootScope.activeTab : 'all';
  var knowliesType = $rootScope.activeTab == 'mine' ? 'myKnowlies' : 'knowlies';
  Knowies.query({knowliesType:knowliesType, studentID:$scope.studentID, courseID:$scope.courseID, subjectID:$scope.subjectID, page:$scope.page}, function(knowiesData){
    angular.forEach(knowiesData, function(course) {
      //console.log(course);
      var stars = getRandomInt(0, 5);
      course.voteStars = stars ? 'stars_' + stars : 'no_stars';
      course.messagesQty = getRandomInt(1, 9);
      course.date = getRandomInt(1, 28) + '.' + getRandomInt(1, 12) + '.' + getRandomInt(10, 12);
      $scope.coursesMine.push(course);
    });
  });
  
  // get timetable data, for courses menu
  TimeTable.query({studentID: $scope.studentID}, function(data){
    angular.forEach(data, function(item) {
      $scope.coursesNames[item.Courses_Id] = {id:item.Courses_Id,title:item.CourseName};
    });
    // add course name
    $scope.courseName = $scope.coursesNames[$scope.courseID].title;
  });
  
  // toggle available courses menu
  $scope.toggleCoursesList = function(a) {
    $('#available_courses').slideToggle();
    return false;
  }
  
  //main tabs
  $scope.tabClicked = function(type){
    $scope.mineTabClass = type == 'mine' ? ' active' : '';
    $scope.allTabClass = type == 'all' ? ' active' : '';    
    //store active tab  
    $rootScope.activeTab = type == 'all' ? 'all' : 'mine';
    
    //set the 'sika' position
    if(type == 'all') {
      $(".sika").addClass("allPoint");
    }
    else {
      $(".sika").removeClass("allPoint");
    }
    
    window.location.reload();
  };

return;
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