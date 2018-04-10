app.service('ServiceService', function($http){
  let _promise;
  var services = [];
  const findAll = ()=> {
    if(_promise){
      return _promise;
    }
    _promise = $http.get('/api/services')
      .then( response => {
        angular.copy(response.data, services);
        console.log(services);
        return response.data;
      });
    return _promise;
  };

  return {
    findAll,
    services
  };
});
