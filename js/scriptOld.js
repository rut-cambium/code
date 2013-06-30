var uniqueCourses = {}, uniqueSubjects = {}, courseSubjects = {}, uniqueStudentCourses = {}, i = 0, ind, cTitle, cssClass;
//get available subjects for courses
for (key in courses) {
	uniqueCourses[courses[key].OwnedByCourse] = i++;
};
//get available subjects for courses (from pupil table)
for (key in pupils) {
	if ($.trim(pupils[key].Subject) != '' && !uniqueSubjects[pupils[key].Subject]) {
	  //uniqueSubjects[pupils[key].Subject] = {name:pupils[key].Subject, qty:0, cssClass:''};
	}
	if ($.trim(pupils[key].Course) != '' && !uniqueStudentCourses[pupils[key].Course]) {
		ind = uniqueCourses[pupils[key].Course] ? uniqueCourses[pupils[key].Course] : '';
		cTitle = uniqueCourses[pupils[key].Course] ? '' : pupils[key].Course;
		cssClass = uniqueCourses[pupils[key].Course] ? '' : 'no_knowly';
	  uniqueStudentCourses[pupils[key].Course] = {key:ind,cssClass:cssClass,title:cTitle};
	}
};

for (key in allSubjects) {
	if ($.trim(allSubjects[key].SubjectName) != '' && !uniqueSubjects[allSubjects[key].SubjectName]) {
	  uniqueSubjects[allSubjects[key].SubjectName] = {name:allSubjects[key].SubjectName,qty:0,cssClass2:'no_knowly'};
	}
	
	if ($.trim(allSubjects[key].SubjectName) != '') {
		if (!courseSubjects[allSubjects[key].IncludedInCourse]) {
			courseSubjects[allSubjects[key].IncludedInCourse] = {};
		}
		courseSubjects[allSubjects[key].IncludedInCourse][allSubjects[key].SubjectName] = {name:allSubjects[key].SubjectName,qty:0,cssClass:'no_knowly'};
	}
};

// calendar page ng controller
function calendarCtrl($scope) {
  //translation function
	$scope.t = t;
  $scope.studentName = pupils[0].Student;

  // format date range for current week (ex.:5-10.5.13)
  var currentDate = new Date();
  var lastSunday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 0);
  var nextFriday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 5);
  $scope.weekRange = lastSunday.getDate() + '-' + nextFriday.getDate() + '.' + (nextFriday.getMonth()+1) + '.' + nextFriday.getFullYear().toString().slice(-2);  
  
  // build calendar matrix object for HTML table - 7 hours x 6 days matrix
  $scope.calendar = {1:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 2:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 3:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 4:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 5:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 6:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}, 7:{1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}}}; 
  angular.forEach(pupils, function(pupil) {
  	// decide one or two rows
  	pupil.content =  '\<span class="row green"\>' + pupil.Course + '\</span\>\<span class="row"\>' + (pupil.Subject ? pupil.Subject : '&nbsp;') + '\</span\>';
  	// course content is linked to main page, passing course name processed by md5 (only if there is related data)
  	if (uniqueCourses[pupil.Course]) {
  	  pupil.content = '<a class="course_link" href="main.html?i=' + uniqueCourses[pupil.Course] + '">' + pupil.content + '</a>';
  	}
  	else {
  		pupil.content = '<a class="course_link" href="main.html?title=' + pupil.Course + '">' + pupil.content + '</a>';
  	}
  	$scope.calendar[pupil.Hour][pupil.WeekDay] = pupil;
  });
}


//main page ng controller
function mainCtrl($scope) {
	// translation function
	$scope.t = t;
	$scope.subjectName = null;
	$scope.uniqueCourses = uniqueCourses;
	$scope.uniqueStudentCourses = uniqueStudentCourses;

  //get active tab from session
	var activeTab = 'mine';
	try {
		activeTab = sessionStorage.getItem('activeTab');
		activeTab = activeTab == 'all' ? 'all' : 'mine';
	}

	catch(e){
		activeTab = 'mine';
	}
    //set the 'sika' position
     if(activeTab== 'all')
        {
            $(".sika").addClass("allPoint");
        }
        else{
             $(".sika").removeClass("allPoint");
        }
	
	// active classes
	$scope.mineTabClass = activeTab == 'mine' ? ' active' : '';
	$scope.allTabClass = activeTab == 'all' ? ' active' : '';
	
  //main html - main tabs
	$scope.tabClicked = function(type){
		$scope.mineTabClass = type == 'mine' ? ' active' : '';
		$scope.allTabClass = type == 'all' ? ' active' : '';		
	  //store active tab in session
		try {
			sessionStorage.setItem('activeTab', (type == 'all' ? 'all' : 'mine'));
		}
		catch(e){}
        //set the 'sika' position
        if(type== 'all')
        {
            $(".sika").addClass("allPoint");
        }
        else{
             $(".sika").removeClass("allPoint");
        }
	};

	var type, ind = 0, courseIndex = GetURLParameter('i'), title = GetURLParameter('title');

	$scope.updateCourses = function(populateRightSideMenu) {
	    courseIndex = courseIndex === false || !courseIndex ? false : courseIndex;
	    $scope.courseName = courseIndex === false ? (title === false ? t('Main') : decodeURIComponent(title)) : courses[courseIndex].OwnedByCourse;
	    // update page title 
	    document.title = $scope.courseName;

	    $scope.coursesMine = [];
	    $scope.coursesAll = [];
	    if(populateRightSideMenu) {
	        //$scope.subjectMenu = uniqueSubjects;
	        //$scope.subjectMenu = {};
	        $scope.subjectMenu = courseIndex === false ? uniqueSubjects : courseSubjects[courses[courseIndex].OwnedByCourse];
	    }

	    if(courseIndex === false) {
	        $scope.subjectMenu = {};
	    }
	    else {
	        angular.forEach(courses, function(course) {
	            // if subject is passed in URL, filter by this subject
	            if(courseIndex !== false && course.OwnedByCourse != $scope.courseName) {
	            }
	            else if($scope.subjectName && course.CourseSubject != $scope.subjectName) {
	            }
	            else if($scope.searchTerm && course.KnowlyRemarks.search($scope.searchTerm) == -1) {
	            }
	            else {
	                course.voteStars = course.Rank ? 'stars_' + course.Rank : 'no_stars';
	                course.messagesQty = getRandomInt(1, 9);
	                course.share1Disabled = course.Pin && parseInt(course.Pin) == 1 ? ' pin' : (course.Pin == '' ? ' hidden' : ' disabled');
	                course.share2Disabled = course.Share && parseInt(course.Share) == 1 ? ' share' : (course.Share == '' ? ' hidden' : ' disabled');
	                course.share3Disabled = course.Archive && parseInt(course.Archive) == 1 ? ' archive' : (course.Archive == '' ? ' hidden' : ' disabled');
	                course.date = getRandomInt(1, 28) + '.' + getRandomInt(1, 12) + '.' + getRandomInt(10, 12);
	                course.index = ind;
	                var docTypeClass = t('doc') == course.DocuType ? 'doc' : (t('link') == course.DocuType ? 'link' : (t('image') == course.DocuType ? 'image' : (t('video') == course.DocuType ? 'video' : (t('presen') == course.DocuType ? 'presen' : ''))));
	                if(docTypeClass == "") {
	                    docTypeClass =course.DocuType;
	                }
	                course.docTypeClass = docTypeClass;
                    
                     var related = t('mine') == course.Related ? 'mine' : (t('student') == course.Related ? 'student' : (t('teacher') == course.Related ? 'teacher':'' ));
	                if(related == "") {
	                    related ='teacher';
	                }
	                course.relatedClass = related ;


	                if(course.Type == translations.Private) {
	                    $scope.coursesMine.push(course);
	                }
	                else {
	                    $scope.coursesAll.push(course);
	                }

	                // populate right side menu data
	                if(populateRightSideMenu) {
	                    if(!$scope.subjectMenu[course.CourseSubject]) {
	                        $scope.subjectMenu[course.CourseSubject] = { name: course.CourseSubject, qty: 1, cssClass: '' };
	                    }
	                    else {
	                        $scope.subjectMenu[course.CourseSubject].qty++;
	                        $scope.subjectMenu[course.CourseSubject].cssClass = '';
	                    }
	                }
	            }
	            ind++;
	        });
	    }
	    // make sure, there areat least 7 items
	    while(Object.keys($scope.subjectMenu).length < 7) {
	        // add t('Search results') to key, which starts with Hebrew tav, thus ensuring last position in sorted array
	        $scope.subjectMenu[t('Search results') + '_placeHolder_' + Object.keys($scope.subjectMenu).length] = { name: ' ', qty: 0, cssClass: 'place_holder' };
	    }
	};
	
	$scope.updateCourses(true);
	
	$scope.submitSearch = function(search) {
    $scope.updateCourses(true);
	};

	$scope.menuClick = function(menu) {
		if (menu != ' ') {
      $scope.subjectName = menu;
      $scope.updateCourses(false);
      angular.forEach($scope.subjectMenu, function(subject) {
      	subject.cssClass = subject.name == $scope.subjectName ? 'active' : '';
      });
		}
		else {
			return false;
		}
	};
}


//preview page ng controller
function previewCtrl($scope) {
  //translation function
	$scope.t = t;
	
	var courseIndex = GetURLParameter('i'); 

	courseIndex = courseIndex === false ? 0 : courseIndex;
	$scope.iframeSrc = courses[courseIndex].Link;
	// youtube disallow embedding their content except of under /embed/ subdir
	if ($scope.iframeSrc.search('youtube.com') != -1) {
		$scope.iframeSrc = 'http://www.youtube.com/embed/' + GetURLParameter('v', $scope.iframeSrc);
	}

	
    $scope.course = courses[courseIndex];
    $scope.course.voteStars = courses[courseIndex].Rank ? 'stars_' + courses[courseIndex].Rank : 'no_stars';
    $scope.course.date2 =  getRandomInt(1, 28) + '.' + getRandomInt(1, 12) + '.' + getRandomInt(10, 12);;
    $scope.course.share1Disabled = courses[courseIndex].Pin && parseInt(courses[courseIndex].Pin) == 1 ? ' pin' : (courses[courseIndex].Pin == '' ? ' hidden' : ' disabled');
	$scope.course.share2Disabled = courses[courseIndex].Share && parseInt(courses[courseIndex].Share) == 1 ? ' share' : (courses[courseIndex].Share == '' ? ' hidden' : ' disabled');
	$scope.course.share3Disabled = courses[courseIndex].Archive && parseInt(courses[courseIndex].Archive) == 1 ? ' archive' : (courses[courseIndex].Archive == '' ? ' hidden' : ' disabled');
    $scope.course.messagesQty = getRandomInt(1, 9);
	document.title = courses[courseIndex].CourseSubject;
}
    

$(document).ready(function(){
	// main html, student courses drop down
	$('XXX#available_courses li a.no_knowly, li.qty_0 a').live('click', function(){

		return false;
	});
	
	// disabled share link on course footer
	$('.course_footer a.footer_share.disabled').bind('click', function(){
		return false;
	});
	
	// back buttons
	$('#preview a.back, #main a.back').bind('click', function(){
		history.go(-1);
		return false;
	});
	
	// toggle available courses menu
	$('#header_tabs .h_tabs').bind('click', function(){
		$('#available_courses').slideToggle();
		return false;
	});
});



/**
 * get url argument by its name
 * http://stackoverflow.com/questions/5073859/jquery-how-to-get-parameters-of-a-url
 */
function GetURLParameter(sParam, sPageURL) {
	if (sPageURL) {
		var search = sPageURL.split('?');
		sPageURL = search.length > 1 ? search[1] : sPageURL;
	}
	else {
	  sPageURL = window.location.search.substring(1);
	}
	var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
  	var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
    	return sParameterName[1];
    }
  }
  return false;
}

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 * http://stackoverflow.com/questions/10134237/javascript-random-integer-between-two-numbers
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * get translation
 */
function t(text) {
	return translations[text] ? translations[text] : text;
}