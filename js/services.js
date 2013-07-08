/**
 * Knowly service will fetch data, from any json file with given fileName
 * by default time_table.json data is returned
 * */
angular.module('knowlyServices', ['ngResource']).
  factory('Knowly', function($resource) {
    var result = $resource('././data/:fileName.json', {}, {
      query: {method:'GET', params:{fileName:'time_table'}, isArray:true}
    });
    return result;
  }
);

angular.module('knowlyServices', ['ngResource']).
  factory('TimeTable', function($resource) {
    var result = $resource('http://ec2-54-218-246-13.us-west-2.compute.amazonaws.com/jaxrs/timetable/:studentID', {}, {
      query: {method:'GET', params:{studentID:101}, isArray:true}
    });
    return result;
  }
);