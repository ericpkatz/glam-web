app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  $locationProvider.hashPrefix('');
  $stateProvider 
    .state('home', {
      url: '/',
      template: 'Home'
    })
    .state('services', {
      url: '/services',
      templateUrl: '/templates/Services.html',
    })
    .state('login', {
      url: '/login',
      templateUrl: '/templates/login.html',
      controller: 'LoginCtrl' 
    })
    .state('appointments', {
      url: '/appointments',
      template: '/templates/appointments.html',
    });
    $urlRouterProvider.otherwise('/');
});

app.run(function(ServiceService, AuthService){
  ServiceService.findAll();
  AuthService.attemptLoginFromToken();
});

