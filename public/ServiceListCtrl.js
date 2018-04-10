app.controller('ServiceListCtrl', function($scope, ServiceService){
  $scope.services = [
    'Hair',
    'Makeup'
  ];
  ServiceService.findAll()
  .then( services => {
    $scope.services = services
  });
});
