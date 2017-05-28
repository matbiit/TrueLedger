app.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/app/home');
  // console.log("Oi");
    $stateProvider

    .state('check', {
        url: '/check/:id',
        replace: true,
        templateUrl: '/app/pages/client-section/client-section.view.html'
    })

    // HOME STATES AND NESTED VIEWS ========================================
    .state('app', {
        url: '/app',
        controller: "MainController",
        abstract: true
    })
    .state('app.home', {
        url: '/home/:user',
        replace: true,
        templateUrl: '/app/pages/home/home.view.html'
    })
    .state('app.history', {
        url: '/historico/:user',
        replace: true,
        templateUrl: '/app/pages/history/history.view.html'
    })
    .state('app.asset', {
        url: '/lote/:id/:user',
        replace: true,
        templateUrl: '/app/pages/asset/asset.view.html'
    })
    .state('app.login', {
        url: '/login/',
        templateUrl: '/app/pages/login/login.view.html'
    });
});
