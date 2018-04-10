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
    });
    $urlRouterProvider.otherwise('/');
});

app.run(function(ServiceService){
  ServiceService.findAll();
});

