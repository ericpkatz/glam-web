var app = angular.module('glamsquad', ['ui.router']);
app.service('FizzBuzzService', function(){
  return {
    fizz: 'buzz'
  };
});

/*
app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider 
    .state('home', {
      url: '/',
      template: 'Home'
    });
});
*/
