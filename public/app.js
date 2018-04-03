var app = angular.module('glamsquad', ['ui.router']);
app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider 
    .state('home', {
      url: '/home',
      template: 'fizz buzz'
    });
});
