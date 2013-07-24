/**
 * Knowly service will fetch data, from any json file with given fileName
 * by default time_table.json data is returned
 * */

var knowiiApp = angular.module('knowlyServices', ['ngResource']);

knowiiApp.
  factory('TimeTable', function($resource) {
    var result = $resource('http://ec2-54-218-246-13.us-west-2.compute.amazonaws.com/jaxrs/timetable/:studentID', {}, {
      query: {method:'GET', params:{studentID:101}, isArray:true}
    });
    return result;
  }
);

knowiiApp.
  factory('Knowies', function($resource) {
    var result = $resource('http://ec2-54-218-246-13.us-west-2.compute.amazonaws.com/jaxrs/knowlies/:studentID?course=:courseID&subject=:subjectID&page=:page', {}, {
      query: {method:'GET', params:{studentID:101, courseID:9, subjectID:0, page:1}, isArray:true}
    });
    return result;
  }
);

knowiiApp.
  factory('MyKnowies', function($resource) {
    var result = $resource('http://ec2-54-218-246-13.us-west-2.compute.amazonaws.com/jaxrs/myKnowlies/:studentID?course=:courseID&subject=:subjectID&page=:page', {}, {
      query: {method:'GET', params:{studentID:101, courseID:9, subjectID:0, page:1}, isArray:true}
    });
    return result;
  }
);

knowiiApp.
  factory('Subjects', function($resource) {
    var result = $resource('http://ec2-54-218-246-13.us-west-2.compute.amazonaws.com/jaxrs/subjects/:studentID', {}, {
      query: {method:'GET', params:{studentID:101}, isArray:true}
    });
    return result;
  }
);