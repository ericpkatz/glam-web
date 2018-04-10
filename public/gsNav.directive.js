angular.module('glamsquad')
  .directive('gsNav', function(){
    return {
      restrict: 'E',
      templateUrl: '/public/templates/gsNav.html',
      controller: function(ServiceService, $scope, AuthService){
        $scope.serviceCount = ()=> ServiceService.services.length;
        $scope.user = AuthService.user;
        $scope.logout = ()=> {
          AuthService.logout();
        }
      }
    };
  });
