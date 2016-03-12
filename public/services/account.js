angular.module('MyApp')
  .factory('Account', function($http) {
    return {
      getProfile: function() {
        return $http.get('/api/me');
      },
      updateProfile: function(profileData) {
        return $http.put('/api/me', profileData);
      },
      fetchAndUpdateTwitterInfo: function(request){
        return $http.put('/twitter/details', request);
      },
      getFacebookInfo: function(facebookHandle){
        return $http.get('/facebook/details?screen_name=' + facebookHandle);
      },
      getCompeteInfo: function(competeHandle){
        return $http.get('/compete/details?site_name=' + competeHandle);
      }
    };
  });