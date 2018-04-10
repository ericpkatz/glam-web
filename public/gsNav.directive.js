angular.module('glamsquad')
  .directive('gsNav', function(){
    return {
      restrict: 'E',
      templateUrl: '/public/templates/gsNav.html',
      controller: function(ServiceService, $scope){
        $scope.serviceCount = ()=> ServiceService.services.length;
      }
    };
  });
