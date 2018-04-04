var app = angular.module('glamsquad', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider 
    .state('home', {
      url: '/',
      template: 'Home'
    });
});
