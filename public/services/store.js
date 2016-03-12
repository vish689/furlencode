angular.module('MyApp')
  .factory('StoreService', function($http) {
    return {

      createStore: function(storeData){
        return $http.post('/api/store/create', storeData);
      },
      getStore: function(query){
        //http://localhost:3000/api/store?longitude=77.59780883789062&latitude=13
        return $http.get('/api/store?longitude='+query.longitude+'&latitude='+query.latitude);
      }

      /*getProfile: function() {
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
      }*/
    };
  });