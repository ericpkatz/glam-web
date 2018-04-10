app.controller('LoginCtrl', function($scope, AuthService){
  $scope.credentials = {
    email: 'mae@glamsquad.com',
    password: ''
  };
  $scope.loginDisabled = ()=> !$scope.credentials.email || !$scope.credentials.password;
  $scope.authenticate = ()=> {
    AuthService.authenticate($scope.credentials);
  };
});
