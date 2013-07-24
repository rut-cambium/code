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
		  if (item.knowliesFlag) {
        item.content = '<a class="course_link" href="#/courses/' + $scope.studentID + '?course=' + item.Courses_Id + '">' + item.CourseName + '</a>';
      }
      else {
        item.content = item.CourseName;
      }
      $scope.calendar[item.HourOfTheDay][item.DayOfTheWeek] = item;
    });
	});
}



function CoursesCtrl($scope, $rootScope, Subjects, Knowies, MyKnowies, TimeTable, $routeParams) {
  //translation function
	$scope.t = t; 
	$scope.studentID = $routeParams.studentID ? $routeParams.studentID : 101;
	$scope.subjectID = $routeParams.subject ? $routeParams.subject : 0;
	$scope.page = 1;
	//$scope.searchTerm = $routeParams.pattern ? $routeParams.pattern : '';
	$scope.courses = [];
  $rootScope.coursesNames = $rootScope.coursesNames ? $rootScope.coursesNames : {};
  $scope.mineTabClass = 'active';
  $scope.courseName = "&nbsp;";
  $rootScope.activeTab = $rootScope.activeTab ? $rootScope.activeTab : 'mine';
   
  // get subjects data, for subjects menu
  if (($routeParams.course && $rootScope.courseID != $routeParams.course) || !_.size($rootScope.subjectMenu)) {
    var subjectMenu = [];
    Subjects.query({studentID: $scope.studentID}, function(data){
      angular.forEach(data, function(item) {
        item.cssClass = $scope.subjectID == item.Id ? 'active' : '';
        item.href = '#/courses/'+$scope.studentID+'?subject='+item.Id+'&course='+$rootScope.courseID;
        subjectMenu[item.Id] = item;
      });
      $rootScope.subjectMenu = subjectMenu;
    });   
  }
  else {
    angular.forEach($rootScope.subjectMenu, function(item) {
      item.cssClass = $scope.subjectID == item.Id ? 'active' : '';
    });
  }
  
  $rootScope.courseID = $routeParams.course ? $routeParams.course : 9;

  // get timetable data, for courses menu
  if (!_.size($rootScope.coursesNames)) {
    TimeTable.query({studentID: $scope.studentID}, function(data){
      angular.forEach(data, function(item) {
        $rootScope.coursesNames[item.Courses_Id] = {id:item.Courses_Id,title:item.CourseName,cssClass:(item.knowliesFlag?'':'empty'),href:(item.knowliesFlag?'#/courses/'+$scope.studentID+'?subject=0&course='+item.Courses_Id:'')};
      });
      // add course name
      $scope.courseName = $rootScope.coursesNames[$rootScope.courseID].title;
    });
  }
  else {
    // add course name from stored names
    $scope.courseName = $rootScope.coursesNames[$rootScope.courseID].title;
  }
  
  if ($rootScope.activeTab == 'mine') {
    MyKnowies.query({studentID:$scope.studentID, courseID:$rootScope.courseID, subjectID:$scope.subjectID, page:$scope.page}, function(knowiesData){
      angular.forEach(knowiesData, function(course) {
        //console.log(course);
        var stars = getRandomInt(0, 5);
        course.voteStars = stars ? 'stars_' + stars : 'no_stars';
        course.messagesQty = getRandomInt(1, 9);
        course.date = getRandomInt(1, 28) + '.' + getRandomInt(1, 12) + '.' + getRandomInt(10, 12);
        $scope.courses.push(course);
      });
    });
  }
  else {
    Knowies.query({studentID:$scope.studentID, courseID:$rootScope.courseID, subjectID:$scope.subjectID, page:$scope.page}, function(knowiesData){
      angular.forEach(knowiesData, function(course) {
        var stars = getRandomInt(0, 5);
        course.voteStars = stars ? 'stars_' + stars : 'no_stars';
        course.messagesQty = getRandomInt(1, 9);
        course.date = getRandomInt(1, 28) + '.' + getRandomInt(1, 12) + '.' + getRandomInt(10, 12);
        $scope.courses.push(course);
      });
    });
  }
  
  // toggle available courses menu
  $scope.toggleCoursesList = function(a) {
    $('#available_courses').slideToggle();
    return false;
  }
  
  //main tabs event
  $scope.tabClicked = function(type){
    $scope.mineTabClass = type == 'mine' ? ' active' : '';
    $scope.allTabClass = type == 'all' ? ' active' : '';    
    //store active tab  
    $rootScope.activeTab = type == 'all' ? 'all' : 'mine';
    
    //set the 'sika' position
    if (type == 'all') {
      $(".sika").addClass("allPoint");
    }
    else {
      $(".sika").removeClass("allPoint");
    }
  };
  
  // search form submitted
  $scope.submitSearch = function(pattern) {
    console.log('pattern = ' + pattern);
    console.log('#/courses/'+ $scope.studentID +'?course=' + $rootScope.courseID + '&subject=' + $scope.subjectID + '&' + ($rootScope.activeTab == 'all' ? 'a' : 'm'));
    window.location.hash = '#/courses/'+ $scope.studentID +'?course=' + $rootScope.courseID + '&subject=' + $scope.subjectID + '&' + $rootScope.activeTab == 'all' ? 'a' : 'm';
  }

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